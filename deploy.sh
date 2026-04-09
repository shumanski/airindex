#!/usr/bin/env bash
set -euo pipefail

# Deploy airindex.today — run on the server in ~/apps/airindex/
# Usage: ./deploy.sh

cd "$(dirname "$0")"

echo "=== Pull latest code ==="
git pull

echo ""
echo "=== Stop container ==="
docker compose down

echo ""
echo "=== Rebuild image (no cache) ==="
docker compose build --no-cache

echo ""
echo "=== Start container ==="
docker compose up -d

echo ""
echo "=== Waiting for container to be healthy... ==="
sleep 3

if docker compose ps | grep -q "Up"; then
  echo "✓ Container is running"
else
  echo "✗ Container failed to start!"
  docker compose logs --tail=30
  exit 1
fi

echo ""
echo "=== Recent logs ==="
docker compose logs --tail=20
echo ""
echo "=== Deploy complete. Run command to monitor logs: docker compose logs -f --tail=0 ==="
