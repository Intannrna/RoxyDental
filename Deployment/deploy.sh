#!/bin/bash

# Deployment Script for RoxyDental
echo "🚀 Starting Deployment Process..."

# 1. Pull latest changes from Git
echo "📥 Pulling latest code..."
git pull origin main

# 2. Rebuild and restart containers
echo "building and researching containers..."
docker compose --env-file .env.prod build --no-cache
docker compose --env-file .env.prod up -d

# 3. Prune unused images to save space
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment Success! Server is running."
