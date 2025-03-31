#!/bin/bash
set -e

# Configuration
STACK_NAME="jmurth-site"
IMAGE_NAME="jmurth-site"
TAG=$(git rev-parse --short HEAD)

# Build the new image
echo "Building new image: $IMAGE_NAME:$TAG"
docker build -t $IMAGE_NAME:$TAG .
docker tag $IMAGE_NAME:$TAG $IMAGE_NAME:latest

# Update the stack with zero downtime
echo "Deploying stack: $STACK_NAME"
TAG=$TAG docker stack deploy --compose-file docker-stack.yml $STACK_NAME --with-registry-auth

# Monitor the deployment
echo "Monitoring deployment..."
docker service ls --filter name=$STACK_NAME
echo "Deployment initiated. Check status with: docker service ls" 