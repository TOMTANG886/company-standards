#!/usr/bin/env bash
# webhook-notify.sh — POST a standards-updated event to all registered consumers
# Usage: WEBHOOK_SECRET=<secret> bash scripts/webhook-notify.sh

set -euo pipefail

CONSUMERS_FILE=".github/webhook-consumers.json"
EVENT_BODY='{"event_type":"standards-updated"}'

# ── Guard: WEBHOOK_SECRET must be set ────────────────────────────────────────
if [[ -z "${WEBHOOK_SECRET:-}" ]]; then
  echo "Error: WEBHOOK_SECRET environment variable is not set." >&2
  exit 1
fi

# ── Guard: consumers file must exist ─────────────────────────────────────────
if [[ ! -f "$CONSUMERS_FILE" ]]; then
  echo "Error: $CONSUMERS_FILE not found." >&2
  exit 1
fi

# ── Compute HMAC-SHA256 signature ────────────────────────────────────────────
SIGNATURE="sha256=$(printf '%s' "$EVENT_BODY" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | awk '{print $2}')"

# ── Iterate over consumers ───────────────────────────────────────────────────
consumer_count=$(jq '.consumers | length' "$CONSUMERS_FILE")

if [[ "$consumer_count" -eq 0 ]]; then
  echo "No consumers registered in $CONSUMERS_FILE."
  exit 0
fi

exit_code=0

for i in $(seq 0 $((consumer_count - 1))); do
  name=$(jq -r ".consumers[$i].name // \"consumer-$i\"" "$CONSUMERS_FILE")
  url=$(jq -r ".consumers[$i].url" "$CONSUMERS_FILE")

  if [[ -z "$url" || "$url" == "null" ]]; then
    echo "✗ Skipping $name — no URL configured" >&2
    exit_code=1
    continue
  fi

  http_code=$(curl \
    --silent \
    --output /dev/null \
    --write-out "%{http_code}" \
    --max-time 15 \
    --request POST \
    --header "Content-Type: application/json" \
    --header "X-Hub-Signature-256: $SIGNATURE" \
    --data "$EVENT_BODY" \
    "$url")

  if [[ "$http_code" -ge 200 && "$http_code" -lt 300 ]]; then
    echo "→ Notified $name"
  else
    echo "✗ Failed $name (HTTP $http_code)" >&2
    exit_code=1
  fi
done

exit "$exit_code"
