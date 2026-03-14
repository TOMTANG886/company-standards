# Review Process

## Lifecycle

`draft` → `review` → `active` (→ `deprecated`)

- **draft** — work in progress; open as GitHub Draft PR for early feedback
- **review** — spec complete, PR open, awaiting all three constitution gates
- **active** — merged to main; authoritative for implementation
- **deprecated** — superseded or removed; retained for 2 release cycles before archival

## SLAs

| Action | SLA |
|--------|-----|
| Initial review after PR opened | 2 business days |
| Final approval | 5 business days |
| Tech-lead sign-off | 3 business days |
| Expedited (post in `#standards-reviews` + tag on-call lead) | 4 business hours |

## Approvals (per CODEOWNERS)

| Path | Approvers | Min |
|------|-----------|-----|
| `specs/` | tech-leads | 1 |
| `templates/`, `guidelines/`, `versioning/` | tech-leads | 2 |
| `scripts/`, `.github/` | devops + tech-leads | 1 each |
