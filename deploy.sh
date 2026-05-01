#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required to deploy this stack."
  exit 1
fi

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

# Configuration
STACK_NAME="${STACK_NAME:-jmurth-site}"
IMAGE_NAME="${IMAGE_NAME:-jmurth-site}"
SITE_HOST="${SITE_HOST:-jmurth.co.uk}"
SITE_URL="${SITE_URL:-https://$SITE_HOST}"
PAYLOAD_PUBLIC_SITE_URL="${PAYLOAD_PUBLIC_SITE_URL:-$SITE_URL}"
NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-$PAYLOAD_PUBLIC_SITE_URL}"
HTTP_PORT="${HTTP_PORT:-3333}"
TRAEFIK_DASHBOARD_PORT="${TRAEFIK_DASHBOARD_PORT:-3334}"
TRAEFIK_ROUTER_NAME="${TRAEFIK_ROUTER_NAME:-$STACK_NAME}"
TRAEFIK_SERVICE_NAME="${TRAEFIK_SERVICE_NAME:-$STACK_NAME}"
TAG="${TAG:-$(git rev-parse --short HEAD)}"
SKIP_BUILD="${SKIP_BUILD:-false}"

: "${PAYLOAD_SECRET:?Set PAYLOAD_SECRET in the environment or .env before deploying.}"

export IMAGE_NAME
export TAG
export STACK_NAME
export SITE_HOST
export PAYLOAD_SECRET
export PAYLOAD_PUBLIC_SITE_URL
export NEXT_PUBLIC_SITE_URL
export HTTP_PORT
export TRAEFIK_DASHBOARD_PORT
export TRAEFIK_ROUTER_NAME
export TRAEFIK_SERVICE_NAME

if [ "$SKIP_BUILD" != "true" ]; then
  # Build the new image
  echo "Building new image: $IMAGE_NAME:$TAG"
  docker build \
    --build-arg NEXT_PUBLIC_SITE_URL="$NEXT_PUBLIC_SITE_URL" \
    --build-arg PAYLOAD_PUBLIC_SITE_URL="$PAYLOAD_PUBLIC_SITE_URL" \
    -t "$IMAGE_NAME:$TAG" .
  docker tag "$IMAGE_NAME:$TAG" "$IMAGE_NAME:latest"
else
  echo "Skipping image build; deploying existing image: $IMAGE_NAME:$TAG"
fi

# Update the stack with zero downtime
echo "Deploying stack: $STACK_NAME"
docker stack deploy --compose-file docker-stack.yml "$STACK_NAME" --with-registry-auth --resolve-image never

# Monitor the deployment
echo "Monitoring deployment..."
docker service ls --filter name="$STACK_NAME"
echo "Deployment initiated. Check status with: docker service ls"
