# Spec Constitution

## Frontmatter (required fields)

- `id` — `{project}/{###-name}`, matches directory path
- `title` — sentence-case, human-readable
- `project` — lowercase key matching the containing directory
- `status` — `draft` | `review` | `active` | `deprecated`
- `version` — semver `MAJOR.MINOR.PATCH`
- `tags` — list (may be `[]`)
- `authors` — list of `@handle`
- `created` / `updated` — `YYYY-MM-DD`

## Required sections (h2)

`Overview` · `Problem` · `Solution` · `Acceptance Criteria`

## Acceptance criteria rules

- Must be objectively verifiable — no "fast", "intuitive", "reasonable"
- Use _Given / When / Then_ or a direct assertion with a measurable target

## Review gates

| Gate | Who | Must confirm |
|------|-----|---|
| Self-review | Author | Frontmatter valid, sections complete, criteria testable |
| Peer review | Any non-author | Problem accurate, solution sound, no hidden assumptions |
| Sign-off | Tech lead | Aligns with architecture, no conflicts with other specs |
