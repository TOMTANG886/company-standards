---
id: <project>/<###-name>
title: <API Contract: Title>
project: <project>
status: draft
version: 0.1.0
tags: [api]
authors: [@<handle>]
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

## Overview

**Protocol:** REST · **Format:** JSON · **Auth:** Bearer (JWT)

## Base URL

| Env | URL |
|-----|-----|
| Production | `https://api.example.com/v1` |
| Staging | `https://api.staging.example.com/v1` |
| Local | `http://localhost:3000/v1` |

## Authentication

```
Authorization: Bearer <token>
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/resources` | List |
| `POST` | `/resources` | Create |
| `GET` | `/resources/{id}` | Get by ID |
| `PATCH` | `/resources/{id}` | Update |
| `DELETE` | `/resources/{id}` | Delete |

### `GET /resources`

**Query params:** `page` (int), `per_page` (int, max 100), `status` (string)

**Response `200`:**
```json
{ "data": [{ "id": "…", "name": "…", "status": "active" }], "meta": { "page": 1, "total": 1 } }
```

### `POST /resources`

**Body:**
```json
{ "name": "…", "description": "…", "tags": [] }
```

**Response `201`:** Returns created resource.

### `GET /resources/{id}` → `200` resource object

### `PATCH /resources/{id}` — partial update → `200` updated object

### `DELETE /resources/{id}` → `204 No Content`

## Error Codes

```json
{ "error": { "code": "RESOURCE_NOT_FOUND", "message": "…" } }
```

| Status | Code | Meaning |
|--------|------|---------|
| `400` | `INVALID_REQUEST` | Validation failure |
| `401` | `UNAUTHORIZED` | Bad/missing token |
| `403` | `FORBIDDEN` | Insufficient permissions |
| `404` | `RESOURCE_NOT_FOUND` | Not found |
| `429` | `RATE_LIMITED` | Retry after `Retry-After` |
| `500` | `INTERNAL_ERROR` | Server error |

## Changelog

| Version | Date | Summary |
|---------|------|---------|
| `0.1.0` | <YYYY-MM-DD> | Initial draft |
