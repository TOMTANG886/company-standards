# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install               # Install deps (js-yaml, glob, ajv)
npm run validate          # Validate specific spec files passed as args
npm run validate:all      # Validate all specs
npm run build:index       # Rebuild index.json from all specs
WEBHOOK_SECRET=<s> npm run webhook:notify
```

Requires Node >= 18.

## Architecture

Centralized spec repository. Product repos, MCP servers, and dashboards consume `index.json`.

**Data flow:** author writes `specs/{project}/{###-name}/spec.md` → `npm run validate` → PR merged to `main` → CI rebuilds `index.json` → webhooks notify consumers.

## Key files

| File | Role |
|------|------|
| `index.json` | Auto-generated — never edit by hand |
| `index.schema.json` | JSON Schema `build-index.js` validates against |
| `templates/constitution.md` | Quality gates all specs must satisfy |
| `scripts/validate-spec.js` | Validates frontmatter + required h2 sections |
| `scripts/build-index.js` | Walks `specs/` → emits `index.json` |
| `scripts/webhook-notify.sh` | POSTs to consumers in `.github/webhook-consumers.json` |

## Spec format

YAML frontmatter fields: `id`, `title`, `project`, `status` (draft/review/active/deprecated), `version` (semver), `tags`, `authors`, `created`, `updated`.

Required h2 sections: **Overview · Problem · Solution · Acceptance Criteria**

Branch pattern: `draft/{project}/{###-feature-name}`
