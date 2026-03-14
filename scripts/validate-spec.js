#!/usr/bin/env node
// validate-spec.js — validates spec.md frontmatter and required sections
// Usage:
//   node scripts/validate-spec.js specs/myproject/001-name/spec.md [...]
//   node scripts/validate-spec.js --all

import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import { glob } from 'glob';

const REQUIRED_FIELDS = ['id', 'title', 'project', 'status', 'version', 'authors', 'created', 'updated'];
const VALID_STATUSES = ['draft', 'review', 'active', 'deprecated'];
const REQUIRED_SECTIONS = ['Overview', 'Problem', 'Solution', 'Acceptance Criteria'];

/**
 * Parse YAML frontmatter from a markdown string.
 * Returns { frontmatter: object|null, body: string }.
 */
function parseFrontmatter(content) {
  if (!content.startsWith('---')) {
    return { frontmatter: null, body: content };
  }

  const end = content.indexOf('\n---', 3);
  if (end === -1) {
    return { frontmatter: null, body: content };
  }

  const yamlBlock = content.slice(3, end).trim();
  const body = content.slice(end + 4);

  try {
    const frontmatter = yaml.load(yamlBlock);
    return { frontmatter, body };
  } catch {
    return { frontmatter: null, body: content };
  }
}

/**
 * Validate a single spec file.
 * Returns an array of error strings. Empty array means the file passes.
 */
function validateFile(filePath) {
  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch (err) {
    return [`cannot read file: ${err.message}`];
  }

  const errors = [];
  const { frontmatter, body } = parseFrontmatter(content);

  // --- Frontmatter existence ---
  if (!frontmatter || typeof frontmatter !== 'object') {
    errors.push('missing or unparseable YAML frontmatter');
    // Cannot validate further without frontmatter
    return errors;
  }

  // --- Required fields ---
  for (const field of REQUIRED_FIELDS) {
    if (frontmatter[field] === undefined || frontmatter[field] === null || frontmatter[field] === '') {
      errors.push(`missing required frontmatter field: ${field}`);
    }
  }

  // --- Status enum ---
  if (frontmatter.status !== undefined && !VALID_STATUSES.includes(frontmatter.status)) {
    errors.push(
      `invalid status "${frontmatter.status}"; must be one of: ${VALID_STATUSES.join(', ')}`
    );
  }

  // --- authors must be an array ---
  if (frontmatter.authors !== undefined && !Array.isArray(frontmatter.authors)) {
    errors.push('frontmatter field "authors" must be an array');
  }

  // --- Required h2 sections in body ---
  for (const section of REQUIRED_SECTIONS) {
    // Match "## Section Name" at the start of a line (with optional trailing whitespace)
    const pattern = new RegExp(`^##\\s+${section}\\s*$`, 'm');
    if (!pattern.test(body)) {
      errors.push(`missing required section: ## ${section}`);
    }
  }

  return errors;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: validate-spec.js <file> [...files]');
    console.error('       validate-spec.js --all');
    process.exit(1);
  }

  let files;

  if (args.includes('--all')) {
    files = await glob('specs/**/spec.md', { posix: true });
    if (files.length === 0) {
      console.log('No spec files found.');
      process.exit(0);
    }
  } else {
    files = args.filter(a => !a.startsWith('--'));
  }

  let anyFailed = false;

  for (const filePath of files) {
    const errors = validateFile(filePath);
    if (errors.length === 0) {
      console.log(`✓ ${filePath}`);
    } else {
      for (const error of errors) {
        console.error(`✗ ${filePath} — ${error}`);
      }
      anyFailed = true;
    }
  }

  if (anyFailed) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
