# Syncing company-standards into Consumer Repos

Two supported patterns: **git submodule** (tight coupling, versioned) and **CI sync** (loose coupling, automatic). Choose based on your team's workflow.

---

## Option A — Git Submodule (Recommended for versioned pinning)

### Initial setup (in the consumer repo)

```bash
# Add company-standards as a submodule at standards/
git submodule add git@github.com:your-org/company-standards.git standards
git submodule update --init --recursive

# Commit the .gitmodules entry
git add .gitmodules standards
git commit -m "chore: add company-standards submodule"
```

### Reading specs from CI

Your CI can reference any file under `standards/`:

```yaml
# .github/workflows/example.yml
- name: Checkout with submodules
  uses: actions/checkout@v4
  with:
    submodules: recursive

- name: Read company index
  run: cat standards/index.json | jq '.specs[] | select(.project == "carerp")'
```

### Updating to latest standards

```bash
# Pull latest main from company-standards
git submodule update --remote --merge standards

# Review the diff, then commit
git add standards
git commit -m "chore: update company-standards to $(cd standards && git rev-parse --short HEAD)"
```

### Pinning to a specific version/tag

```bash
cd standards
git checkout v1.3.0      # pin to a release tag
cd ..
git add standards
git commit -m "chore: pin company-standards to v1.3.0"
```

### .gitmodules reference

```ini
[submodule "standards"]
    path = standards
    url = git@github.com:your-org/company-standards.git
    branch = main
```

---

## Option B — CI Sync (Recommended for full automation)

On every push to `company-standards` main, a GitHub Actions workflow in the consumer repo can pull a fresh copy.

### Step 1 — Add the sync workflow to the consumer repo

```yaml
# .github/workflows/sync-standards.yml
name: Sync company-standards

on:
  repository_dispatch:
    types: [standards-updated]   # triggered by company-standards webhook
  workflow_dispatch:              # allow manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.STANDARDS_SYNC_PAT }}

      - name: Download latest index.json
        run: |
          curl -sSfL \
            -H "Authorization: token ${{ secrets.STANDARDS_SYNC_PAT }}" \
            "https://raw.githubusercontent.com/your-org/company-standards/main/index.json" \
            -o standards/index.json

      - name: Sync templates
        run: |
          mkdir -p standards/templates
          # Rsync templates from company-standards via API or sparse checkout
          git clone --depth 1 --filter=blob:none --sparse \
            git@github.com:your-org/company-standards.git /tmp/cs
          cd /tmp/cs && git sparse-checkout set templates specs
          rsync -av /tmp/cs/templates/ standards/templates/
          rsync -av /tmp/cs/specs/ standards/specs/

      - name: Commit synced files
        run: |
          git config user.name "standards-sync[bot]"
          git config user.email "standards-sync@your-org.com"
          git add standards/
          git diff --cached --quiet || \
            git commit -m "chore: sync company-standards $(date -u +%Y-%m-%dT%H:%M:%SZ)"
          git push
```

### Step 2 — Register this repo as a webhook consumer

In `company-standards`, add the consumer to the webhook registry:

```json
// .github/webhook-consumers.json  (managed by the standards team)
{
  "consumers": [
    {
      "name": "carerp",
      "url": "https://api.github.com/repos/your-org/carerp/dispatches",
      "event_type": "standards-updated",
      "auth_header": "CARERP_DISPATCH_TOKEN"
    }
  ]
}
```

The `sync-to-consumers.yml` workflow in this repo reads that file and fires `repository_dispatch` events automatically on every main push.

---

## Option C — Read-Only Mirror (Lightweight)

For teams that only need the index and don't pull templates:

```bash
# In any script or CI step — no submodule needed
curl -sSfL \
  "https://raw.githubusercontent.com/your-org/company-standards/main/index.json" \
  | jq '.specs[] | select(.status == "active")'
```

For MCP servers, configure the server to poll `index.json` at startup:

```python
# In your MCP server
STANDARDS_INDEX_URL = "https://raw.githubusercontent.com/your-org/company-standards/main/index.json"
```

---

## Access Control for Sync Tokens

| Secret | Scope | Used by |
|--------|-------|---------|
| `STANDARDS_SYNC_PAT` | `repo:read` on `company-standards` | Consumer CI sync workflows |
| `CARERP_DISPATCH_TOKEN` | `repo:write` on `carerp` | `sync-to-consumers.yml` in standards repo |
| `WEBHOOK_SECRET` | HMAC signing | External webhook consumers validating payloads |

All tokens are stored as **repository secrets** in the consumer repo and as **organization secrets** for the standards repo. Rotate every 90 days.

---

## Verifying a Sync

After sync, validate the local copy matches the expected checksum:

```bash
# In the consumer repo
sha256sum standards/index.json

# Compare against the checksum published in company-standards releases
# (each release tag includes a checksums.txt)
```
