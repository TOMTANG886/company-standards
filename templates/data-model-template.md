---
id: <project>/<###-name>
title: <Data Model: Title>
project: <project>
status: draft
version: 0.1.0
tags: [data-model]
authors: [@<handle>]
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

## Overview

**Storage:** PostgreSQL · **Schema:** `<schema_name>`

## Entities

### `<table_name>`

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | `uuid` | No | `gen_random_uuid()` | Primary key |
| `created_at` | `timestamptz` | No | `now()` | |
| `updated_at` | `timestamptz` | No | `now()` | |
| `<field>` | `<type>` | Yes | | |

## Relationships

- `<table>.<field>` → `<other_table>.id` (many-to-one)

## Migrations

| # | File | Description |
|---|------|-------------|
| 1 | `<timestamp>_create_<table>.sql` | |

**Tool:** Flyway / Liquibase / Alembic

## Indexes

| Table | Columns | Type | Purpose |
|-------|---------|------|---------|
| `<table>` | `(col)` | B-tree | |

## Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| 1 | | @ | |
