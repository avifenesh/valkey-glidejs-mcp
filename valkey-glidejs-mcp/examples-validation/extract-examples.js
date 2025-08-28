#!/usr/bin/env node

/**
 * Extract examples from the mappings.ts file for validation
 */

const fs = require('fs');
const path = require('path');

// Read the mappings file
const mappingsPath = path.join(__dirname, '../src/data/api/mappings.ts');
const mappingsContent = fs.readFileSync(mappingsPath, 'utf8');

function extractExamplesFromDataset(datasetName, clientName) {
  const examples = [];
  
  // Find the dataset start
  const datasetStart = mappingsContent.indexOf(`export const ${datasetName}: ApiDataset = {`);
  if (datasetStart === -1) {
    console.log(`Dataset ${datasetName} not found`);
    return examples;
  }
  
  // Find the entries array
  const entriesStart = mappingsContent.indexOf('entries: [', datasetStart);
  if (entriesStart === -1) {
    console.log(`Entries array not found in ${datasetName}`);
    return examples;
  }
  
  // Find the end of the dataset (next export or end of file)
  const nextExport = mappingsContent.indexOf('export const', entriesStart);
  const datasetEnd = nextExport !== -1 ? nextExport : mappingsContent.length;
  
  // Extract the entries section
  const entriesSection = mappingsContent.substring(entriesStart, datasetEnd);
  
  // Parse each entry manually
  let pos = entriesSection.indexOf('{', entriesSection.indexOf('entries: ['));
  
  while (pos !== -1) {
    // Find the matching closing brace for this entry
    let braceCount = 1;
    let endPos = pos + 1;
    
    while (braceCount > 0 && endPos < entriesSection.length) {
      if (entriesSection[endPos] === '{') braceCount++;
      else if (entriesSection[endPos] === '}') braceCount--;
      endPos++;
    }
    
    if (braceCount === 0) {
      const entryText = entriesSection.substring(pos, endPos);
      
      // Extract fields from the entry
      const categoryMatch = entryText.match(/category:\s*"([^"]+)"/);
      const symbolMatch = entryText.match(/symbol:\s*"([^"]+)"/);
      
      // Check if this entry has examples
      const examplesStart = entryText.indexOf('examples:');
      if (examplesStart !== -1 && categoryMatch && symbolMatch) {
        // Find the examples object
        const examplesObjectStart = entryText.indexOf('{', examplesStart);
        if (examplesObjectStart !== -1) {
          // Find the matching closing brace for examples
          let examplesBraceCount = 1;
          let examplesEndPos = examplesObjectStart + 1;
          
          while (examplesBraceCount > 0 && examplesEndPos < entryText.length) {
            if (entryText[examplesEndPos] === '{') examplesBraceCount++;
            else if (entryText[examplesEndPos] === '}') examplesBraceCount--;
            examplesEndPos++;
          }
          
          const examplesText = entryText.substring(examplesObjectStart, examplesEndPos);
          
          // Extract source and glide examples
          const sourceMatch = examplesText.match(/source:\s*`([^`]+)`/s);
          const glideMatch = examplesText.match(/glide:\s*`([^`]+)`/s);
          
          if (sourceMatch || glideMatch) {
            examples.push({
              client: clientName,
              category: categoryMatch[1],
              symbol: symbolMatch[1],
              source: sourceMatch ? sourceMatch[1].replace(/\\n/g, '\n') : null,
              glide: glideMatch ? glideMatch[1].replace(/\\n/g, '\n') : null
            });
          }
        }
      }
    }
    
    // Find next entry
    pos = entriesSection.indexOf('{', endPos);
    // Make sure we're not inside an examples object
    const nextComma = entriesSection.indexOf(',', endPos);
    const nextBrace = entriesSection.indexOf('{', endPos);
    if (nextBrace !== -1 && nextComma !== -1 && nextBrace < nextComma) {
      // This is likely inside an examples object, skip it
      pos = entriesSection.indexOf('{', nextBrace + 1);
    }
  }
  
  return examples;
}

// Extract examples from both datasets
const ioredisExamples = extractExamplesFromDataset('IOREDIS_DATASET', 'ioredis');
const nodeRedisExamples = extractExamplesFromDataset('NODE_REDIS_DATASET', 'node-redis');

const allExamples = [...ioredisExamples, ...nodeRedisExamples];

console.log(`Found ${allExamples.length} examples:`);
console.log('');

allExamples.forEach(ex => {
  console.log(`${ex.client}/${ex.category}/${ex.symbol}`);
  if (ex.source) console.log(`  Source: ${ex.source.substring(0, 50)}...`);
  if (ex.glide) console.log(`  Glide: ${ex.glide.substring(0, 50)}...`);
  console.log('');
});

// Save to JSON for easier processing
fs.writeFileSync(
  path.join(__dirname, 'extracted-examples.json'),
  JSON.stringify(allExamples, null, 2)
);

console.log(`Saved to extracted-examples.json`);
