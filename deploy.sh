#!/usr/bin/env bash
#
# Update the live website after new code has been uploaded (see DEPLOYMENT.md).
# Run as the "deploy" user from the project folder:  bash deploy.sh
#
set -euo pipefail

cd "$(dirname "$0")"

echo "→ Maintenance mode on"
php artisan down --retry=15 || true

# Bring the site back up even if a step below fails.
trap 'echo "✗ Deploy failed — bringing the site back up"; php artisan up' ERR

if [ -d .git ]; then
    echo "→ Pulling the latest code"
    git pull --ff-only
fi

echo "→ Installing PHP dependencies"
composer install --no-dev --optimize-autoloader --no-interaction

echo "→ Running database migrations"
php artisan migrate --force

echo "→ Installing Node dependencies and building the site"
npm ci
npm run build:ssr

echo "→ Refreshing caches"
php artisan optimize:clear
php artisan optimize

echo "→ Restarting the server-side renderer"
php artisan inertia:stop-ssr --graceful

echo "→ Maintenance mode off"
php artisan up

echo "✓ Deploy finished"
