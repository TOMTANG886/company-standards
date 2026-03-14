# Contributing

## New spec

```bash
git checkout -b draft/{project}/{###-feature-name}
mkdir -p specs/{project}/{###-name}
cp templates/spec-template.md specs/{project}/{###-name}/spec.md
# fill in frontmatter + sections
npm run validate specs/{project}/{###-name}/spec.md
# set status: review, open PR
```

- `id` must match the directory path exactly
- `status` starts as `draft`; change to `review` before opening a PR
- `version` starts at `0.1.0`

## Amending a spec

1. Edit the spec body
2. Bump `version` per [versioning policy](../versioning/VERSIONING_POLICY.md)
3. Update `updated` to today
4. Run `npm run validate`, open a PR

## PR requirements

- CI (`validate-specs`) passes
- CODEOWNERS approval obtained
- PR description attests constitution quality gates are met
