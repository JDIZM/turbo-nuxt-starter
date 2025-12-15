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
    echo "✅ .env file created"
    echo ""
    echo "⚠️  Please update .env with your Supabase credentials:"
    echo "   Run: supabase status -o env"
    echo "   Copy the values to your .env file"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
cd "$ROOT_DIR"
pnpm install

# Check if Supabase is available
echo ""
if command -v supabase &> /dev/null; then
    echo "🗄️ Checking Supabase status..."
    if supabase status > /dev/null 2>&1; then
        echo "✅ Supabase is running"
    else
        echo "⚠️ Supabase is not running. Starting it now..."
        supabase start
        echo "✅ Supabase started"
        echo ""
        echo "📋 Copy these credentials to your .env file:"
        supabase status
    fi
else
    echo "⚠️ Supabase CLI not found. Install with: brew install supabase/tap/supabase"
    echo "   Or use docker-compose.db.yml for a standalone PostgreSQL database."
fi

# Run migrations
echo ""
echo "🔄 Running database migrations..."
pnpm --filter=db-schema run db:push || echo "⚠️ Migrations skipped (may need Supabase running)"

echo ""
echo "=========================================="
echo "✅ Development environment is ready!"
echo "=========================================="
echo ""
echo "Available commands:"
echo "  pnpm dev           - Start all apps in development mode"
echo "  pnpm docker:dev    - Start API + Nuxt in Docker (requires Supabase)"
echo "  pnpm docker:db     - Start standalone PostgreSQL (alternative to Supabase)"
echo "  pnpm docker:down   - Stop all Docker containers"
echo "  pnpm docker:logs   - View container logs"
echo "  pnpm docker:reset  - Reset Docker volumes"
echo ""
echo "Access points:"
echo "  Nuxt Frontend:     http://localhost:3001"
echo "  Express API:       http://localhost:3002"
echo "  API Docs:          http://localhost:3002/docs"
echo "  Nitro Server:      http://localhost:3004"
echo "  Docus Docs:        http://localhost:3003"
echo "  Storybook:         http://localhost:6006"
echo "  Supabase Studio:   http://localhost:54323"
echo ""
