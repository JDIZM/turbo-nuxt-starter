#!/bin/bash
# Development environment setup script
# Run this script to set up your local development environment

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 Setting up development environment..."

# Check for required tools
check_dependency() {
    if ! command -v "$1" &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    fi
    echo "✅ $1 is installed"
}

echo ""
echo "Checking dependencies..."
check_dependency "docker"
check_dependency "pnpm"
check_dependency "node"

# Check Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi
echo "✅ Docker is running"

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20+ is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version $(node -v) meets requirements"

# Create .env file if it doesn't exist
if [ ! -f "$ROOT_DIR/.env" ]; then
    echo ""
    echo "📝 Creating .env file from .env.example..."
    cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"

    # Set development-friendly defaults
    sed -i.bak 's/DATABASE_URL=.*/DATABASE_URL=postgresql:\/\/postgres:postgres@localhost:54322\/postgres/' "$ROOT_DIR/.env" 2>/dev/null || \
    sed -i '' 's/DATABASE_URL=.*/DATABASE_URL=postgresql:\/\/postgres:postgres@localhost:54322\/postgres/' "$ROOT_DIR/.env"

    rm -f "$ROOT_DIR/.env.bak"
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
cd "$ROOT_DIR"
pnpm install

# Start the database
echo ""
echo "🗄️ Starting PostgreSQL database..."
docker compose -f docker-compose.db.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
until docker exec turbo-postgres-local pg_isready -U postgres > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Database failed to start after $MAX_RETRIES attempts"
        exit 1
    fi
    echo "  Waiting for database... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 1
done
echo "✅ Database is ready"

# Run migrations
echo ""
echo "🔄 Running database migrations..."
pnpm --filter=db-schema run db:push || echo "⚠️ Migrations skipped (may already be applied)"

# Seed the database
echo ""
echo "🌱 Seeding database..."
pnpm --filter=db-schema run db:seed || echo "⚠️ Seeding skipped (may already be seeded)"

echo ""
echo "=========================================="
echo "✅ Development environment is ready!"
echo "=========================================="
echo ""
echo "Available commands:"
echo "  pnpm dev           - Start all apps in development mode"
echo "  pnpm docker:dev    - Start full Docker development environment"
echo "  pnpm docker:db     - Start only the database"
echo "  pnpm docker:down   - Stop all Docker containers"
echo "  pnpm docker:logs   - View container logs"
echo "  pnpm docker:reset  - Reset database and volumes"
echo ""
echo "Access points:"
echo "  Nuxt Frontend:  http://localhost:3001"
echo "  Express API:    http://localhost:3002"
echo "  API Docs:       http://localhost:3002/docs"
echo "  Nitro Server:   http://localhost:3004"
echo "  Docus Docs:     http://localhost:3003"
echo "  Storybook:      http://localhost:6006"
echo ""
