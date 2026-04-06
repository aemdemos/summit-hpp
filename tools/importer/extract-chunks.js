#!/usr/bin/env node
/**
 * Extracts base64 chunks from Playwright tool result JSON files,
 * concatenates them, decodes from base64, and writes the HTML output.
 */
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, 'hpe-source.html');

// Get chunk file paths from command line arguments
const chunkFiles = process.argv.slice(2);

if (chunkFiles.length === 0) {
  console.error('Usage: node extract-chunks.js <chunk1.json> <chunk2.json> ...');
  process.exit(1);
}

let fullBase64 = '';

for (const filePath of chunkFiles) {
  const raw = fs.readFileSync(filePath, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error(`Failed to parse JSON from ${filePath}`);
    process.exit(1);
  }

  // The structure is an array with one object containing { type: "text", text: "### Result\n\"...\"" }
  let text = '';
  if (Array.isArray(parsed) && parsed[0] && parsed[0].text) {
    text = parsed[0].text;
  } else if (typeof parsed === 'string') {
    text = parsed;
  } else {
    console.error(`Unexpected JSON structure in ${filePath}`);
    process.exit(1);
  }

  // The text format is:
  // ### Result\n"BASE64..."
  // followed by blank line and ### Ran Playwright code etc.
  // Extract: after "### Result\n" take the line, strip quotes

  const lines = text.split('\n');
  // Line 0: "### Result"
  // Line 1: "\"BASE64_DATA\""
  let b64Line = lines[1] || '';
  // Strip leading/trailing quotes
  b64Line = b64Line.replace(/^"/, '').replace(/"$/, '');

  fullBase64 += b64Line;
}

console.log(`Total base64 length: ${fullBase64.length}`);

// Decode base64
const htmlBuffer = Buffer.from(fullBase64, 'base64');
console.log(`Decoded HTML size: ${htmlBuffer.length} bytes`);

// Write output
fs.writeFileSync(OUTPUT_FILE, htmlBuffer);
console.log(`Written to ${OUTPUT_FILE}`);
