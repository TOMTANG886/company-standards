#!/usr/bin/env node
// build-index.js — walks specs/ and emits index.json
// Usage: node scripts/build-index.js

import { readFileSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';
import { glob } from 'glob';
import Ajv from 'ajv';

const INDEX_PATH = 'index.json';
const SCHEMA_PATH = 'index.schema.json';
const GLOB_PATTERN = 'specs/**/spec.md';

/**
 * Parse YAML frontmatter from a markdown string.
 * Returns the parsed frontmatter object, or null on failure.
 */
function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;

  const end = content.indexOf('\n---', 3);
  if (end === -1) return null;

  const yamlBlock = content.slice(3, end).trim();
  try {
    return yaml.load(yamlBlock);
  } catch {
    return null;
  }
}

async function main() {
  // 1. Find all spec files
  const files = await glob(GLOB_PATTERN, { posix: true });

  // 2. Parse each file and build the entries array
  const specs = [];

  for (const filePath of files) {
    let content;
    try {
      content = readFileSync(filePath, 'utf8');
    } catch (err) {
      console.error(`Warning: cannot read ${filePath}: ${err.message}`);
      continue;
    }

    const fm = parseFrontmatter(content);
    if (!fm || typeof fm !== 'object') {
      console.error(`Warning: no valid frontmatter in ${filePath} — skipping`);
      continue;
    }

    const entry = {
      id:      String(fm.id      ?? ''),
      title:   String(fm.title   ?? ''),
      project: String(fm.project ?? ''),
      status:  String(fm.status  ?? ''),
      version: String(fm.version ?? ''),
      path:    filePath,
      tags:    Array.isArray(fm.tags) ? fm.tags.map(String) : [],
      authors: Array.isArray(fm.authors) ? fm.authors.map(String) : [],
      created: String(fm.created ?? ''),
      updated: String(fm.updated ?? ''),
    };

    specs.push(entry);
  }

  // 3. Build the index object
  const index = {
    generated: new Date().toISOString(),
    specs,
  };

  // 4. Validate against index.schema.json
  let schema;
  try {
    schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
  } catch (err) {
    console.error(`Error: cannot read ${SCHEMA_PATH}: ${err.message}`);
    process.exit(1);
  }

  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(index);

  if (!valid) {
    console.error('Schema validation failed:');
    for (const error of validate.errors ?? []) {
      console.error(`  ${error.instancePath || '/'} ${error.message}`);
    }
    process.exit(1);
  }

  // 5. Write index.json
  writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + '\n', 'utf8');

  console.log(`Built ${INDEX_PATH} — ${specs.length} spec${specs.length !== 1 ? 's' : ''}`);
}

main().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
