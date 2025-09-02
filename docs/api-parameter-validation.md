# Glide API Parameter & Arity Validation

This report validates that all Glide client method usages across the codebase and documentation match the extracted official API surface (including method existence and argument arity).

## Data Sources
- Inventory: `glide-api-inventory.json` (294 methods, with `minArity` / `maxArity` metadata)
- Code scan: `scripts/validate-glide-parameters.ts` (AST-based)
- Docs scan: README + `docs/**/*.md` code fences (TypeScript / JavaScript fences only)

## Validation Summary
| Metric | Count |
|--------|-------|
| Total Calls Analyzed | (See JSON report) |
| Invalid Calls (pre-fix) | 4 |
| Invalid Calls (current) | 0 |
| Unknown Methods | 0 |
| Arity Mismatches | 0 |
| Shape Mismatches | 0 |
| Dynamic Calls (bracket) | 0 (currently all literal or none) |

## Issues Identified & Resolved
| Issue | Location | Type | Resolution |
|-------|----------|------|------------|
| `forEach` flagged | `coverage-validator.ts` (false positive) | Unknown method FP | Added heuristic to ignore array utilities & non-client objects |
| `test` flagged | `system-tools.ts` (regex `.test`) | Unknown method FP | Added regex/test detection skip |
| Deprecated `zrevrange` example | README | Unknown method (not exported) | Replaced with `zrange` + range object + `{ reverse: true }` |
| `zrange` arity mismatch | README | Arity mismatch (incorrect signature) | Corrected to object-based signature `{ start: 0, end: 2, type: "byIndex" }` |

## Current Status
All detected Glide client usages and documentation examples conform to the official method inventory and required argument counts.

## Scanner Heuristics
Client identifiers (case-insensitive) recognized:
- Base: `client`, `glideClient`, `clusterClient`
- Modules: `jsonClient`, `ftClient` (reserved for future usage)

Ignored:
- Array helpers: `forEach`, `map`, `filter`, `reduce`, `some`, `every`, etc.
- `regex.test()` patterns
- Non-matching property chains / non-client objects

Dynamic Access:
- Detects `client["cmd"](...)` (literal) and `client[var](...)` (variable). Literal forms validated against inventory; variable forms recorded as dynamic (currently treated as valid unless other mismatch).

Shape Validation:
- Uses extracted `paramTypes` to heuristically detect object-like expectations (presence of `{`, `Record<`, `Options`, `Configuration`, `Config`).
- Flags calls where the first argument is a simple string/number literal but an object type is expected.

Markdown Scanning:
- Fenced code blocks (ts/js) are parsed as TypeScript AST.
- Inline patterns `client.method(...)` scanned with heuristic argument counting and first-arg shape rule.
- Placeholder examples adjusted to prevent false positives.

## Limitations & Future Enhancements
1. Overload Disambiguation: Currently treats combined variants; deeper discrimination (by param type union matching) could refine shape detection.
2. Deep Shape Checking: Only first argument coarse heuristic; could integrate TypeScript checker for full type comparison including generics.
3. Dynamic Variable Bracket Access: Variable-based `client[var]` calls not validated (cannot know target without execution or data flow analysis).
4. Module Client Alias Detection: If users alias module clients (e.g., `const jc = jsonClient`), these aliases are not currently traced.
5. Return Type Usage: Not yet validating that async results are awaited or typed contexts match.

## Automation Proposal
Add an npm script:
```
"validate:glide:extended": "npm run extract:apis && npx tsx scripts/validate-glide-parameters.ts"
```
Integrate into CI to prevent regressions (`prepublishOnly` or dedicated workflow step).

## Artifacts
- Raw call validation output: `glide-parameter-validation.json`
- Inventory with arity metadata: `glide-api-inventory.json`
- Scanner scripts: `scripts/extract-all-apis.ts`, `scripts/validate-glide-parameters.ts`

_Last updated: current commit validation run._
