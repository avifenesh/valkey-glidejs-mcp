import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

type EnrichedSection = {
  heading: string;
  level: number;
  codeBlocks: string[];
  bullets: string[];
};

function extractSectionsFromHtml(html: string): EnrichedSection[] {
  const sections: EnrichedSection[] = [];

  // Very light-weight HTML parsing using regex; good enough for GitHub wiki pages
  const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  const listItemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  const codeBlockRegex = /<pre[\s\S]*?<code[\s\S]*?>([\s\S]*?)<\/code>[\s\S]*?<\/pre>/gi;

  let match: RegExpExecArray | null;
  const indices: { index: number; level: number; text: string }[] = [];
  while ((match = headingRegex.exec(html))) {
    indices.push({ index: match.index, level: Number(match[1]), text: stripTags(match[2]) });
  }
  // Push a sentinel end index
  indices.push({ index: html.length, level: 1, text: "__END__" });

  for (let i = 0; i < indices.length - 1; i++) {
    const start = indices[i].index;
    const end = indices[i + 1].index;
    const sectionHtml = html.slice(start, end);
    const codeBlocks: string[] = [];
    const bullets: string[] = [];

    let m: RegExpExecArray | null;
    while ((m = codeBlockRegex.exec(sectionHtml))) {
      codeBlocks.push(htmlDecode(stripTags(m[1])));
    }
    while ((m = listItemRegex.exec(sectionHtml))) {
      bullets.push(htmlDecode(stripTags(m[1])));
    }

    sections.push({ heading: indices[i].text, level: indices[i].level, codeBlocks, bullets });
  }

  return sections.filter((s) => s.heading !== "__END__");
}

function stripTags(input: string): string {
  return input.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function htmlDecode(input: string): string {
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function registerDataTools(mcp: McpServer) {
  mcp.tool(
    "data.enrich",
    z
      .object({
        sources: z
          .array(
            z.object({ id: z.string(), url: z.string().url(), html: z.string().optional() })
          )
          .optional()
          .describe("Optional override of sources and HTML to parse (for tests)"),
      })
      .shape,
    async (args) => {
      const defaultSources = [
        {
          id: "wiki-migration-ioredis",
          url: "https://github.com/valkey-io/valkey-glide/wiki/Migration-Guide-ioredis",
        },
        {
          id: "wiki-general-concepts",
          url: "https://github.com/valkey-io/valkey-glide/wiki/General-Concepts",
        },
      ];

      const sources = args.sources ?? defaultSources;

      const results: Record<string, { sections: EnrichedSection[]; length: number }> = {};
      for (const src of sources) {
        const html = src.html ?? (await (await fetch(src.url)).text());
        const sections = extractSectionsFromHtml(html);
        results[src.id] = { sections, length: html.length };
      }

      return {
        structuredContent: { results },
        content: [
          { type: "text", text: Object.keys(results).map((k) => `- ${k}: ${results[k].sections.length} sections`).join("\n") },
        ],
      } as any;
    }
  );
}

