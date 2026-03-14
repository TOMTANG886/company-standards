# company-standards

Centralized specification repository for all engineering projects. Contains canonical spec templates, contribution guidelines, versioning policy, and a machine-readable index consumed by tooling (MCP, CI, dashboards).

## Repository Layout

```
company-standards/
├── specs/                    # All approved feature/project specs
│   └── {project}/{###-name}/ # One folder per feature, namespaced by project
├── templates/                # Spec-kit authoring templates
│   ├── spec-template.md
│   ├── plan-template.md
│   ├── research-template.md
│   ├── data-model-template.md
│   ├── quickstart-template.md
│   ├── tasks-template.md
│   ├── checklist-template.md
│   ├── constitution.md       # Quality gates & principles
│   └── contracts/
│       └── api-template.md
├── guidelines/
│   ├── CONTRIBUTING.md       # How to author and submit a spec
│   ├── REVIEW_PROCESS.md     # Approval workflow and SLAs
│   └── STYLE_GUIDE.md        # Writing conventions
├── versioning/
│   ├── VERSIONING_POLICY.md  # Semver rules for specs
│   └── CHANGELOG.md          # Global change history
├── scripts/
│   ├── build-index.js        # Rebuilds index.json from all specs
│   ├── validate-spec.js      # Validates frontmatter + required sections
│   └── webhook-notify.sh     # Fires re-index webhooks to consumers
├── .github/
│   ├── CODEOWNERS            # Access control per path
│   ├── pull_request_template.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── new-spec.yml
│   │   └── spec-amendment.yml
│   └── workflows/
│       ├── validate-specs.yml      # PR: lint + validate changed specs
│       ├── build-index.yml         # Push to main: rebuild + commit index.json
│       └── sync-to-consumers.yml   # Push to main: webhook all registered consumers
├── index.json                # Auto-generated. DO NOT edit by hand.
├── index.schema.json         # JSON Schema for index.json
├── SYNC.md                   # How consumer repos sync (submodule / CI)
└── package.json              # Scripts runner
```

## Quick Start

### Authoring a spec

```bash
# 1. Clone and branch
git clone git@github.com:your-org/company-standards.git
cd company-standards
git checkout -b draft/{project}/###-feature-name

# 2. Copy the template
cp templates/spec-template.md specs/{project}/###-feature-name/spec.md

# 3. Fill in the frontmatter and sections, then validate
npm run validate

# 4. Open a PR — CI will auto-validate and rebuild the index on merge
```

### Consuming specs (in a product repo)

See [SYNC.md](SYNC.md) for git-submodule and CI-sync options.

### Re-indexing

The `index.json` is rebuilt automatically on every push to `main`. To rebuild locally:

```bash
npm run build:index
```

To manually trigger a webhook re-index for registered consumers:

```bash
WEBHOOK_SECRET=<secret> npm run webhook:notify
```

## CI Pipelines

| Workflow | Trigger | Does |
|----------|---------|------|
| `validate-specs` | PR (any branch) | Validates frontmatter + sections on changed `.md` files |
| `build-index` | Push to `main` | Rebuilds `index.json`, commits & pushes |
| `sync-to-consumers` | Push to `main` (after build-index) | POSTs to all registered consumer webhooks |

## Access Control

See [`.github/CODEOWNERS`](.github/CODEOWNERS). In summary:

- **`templates/`** and **`versioning/`** — tech-leads only (2-reviewer minimum)
- **`specs/{project}/`** — project team + tech-leads
- **`guidelines/`** — tech-leads only
- **`scripts/`** and **`.github/workflows/`** — DevOps + tech-leads

## Index Schema

`index.json` is machine-readable and validated against `index.schema.json`. Each spec entry exposes:

```json
{
  "id": "carerp/001-db-connection-pool",
  "title": "Database Connection Pool",
  "project": "carerp",
  "status": "active",
  "version": "1.2.0",
  "path": "specs/carerp/001-db-connection-pool/spec.md",
  "tags": ["database", "infrastructure"],
  "authors": ["@alice"],
  "created": "2026-01-01",
  "updated": "2026-03-14"
}
```

MCP servers and dashboards poll `index.json` directly or subscribe via webhook.
