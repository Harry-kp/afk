#!/bin/bash
# =============================================================================
# Version Bump Script
# Updates version across all config files
# Usage: ./scripts/bump-version.sh 1.2.0
# =============================================================================

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 1.2.0"
  exit 1
fi

NEW_VERSION="$1"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "🔄 Bumping version to $NEW_VERSION..."

# package.json (primary source)
echo "  → package.json"
cd "$ROOT_DIR"
npm version "$NEW_VERSION" --no-git-tag-version --allow-same-version

# src-tauri/Cargo.toml
echo "  → Cargo.toml"
sed -i '' "s/^version = \".*\"/version = \"$NEW_VERSION\"/" "$ROOT_DIR/src-tauri/Cargo.toml"

# src-tauri/tauri.conf.json
echo "  → tauri.conf.json"
sed -i '' "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" "$ROOT_DIR/src-tauri/tauri.conf.json"

# landing/constants.js
echo "  → landing/constants.js"
sed -i '' "s/version: '.*'/version: '$NEW_VERSION'/" "$ROOT_DIR/landing/constants.js"

# src/renderer/constants/authors.ts
echo "  → constants/authors.ts"
sed -i '' "s/version: '.*'/version: '$NEW_VERSION'/" "$ROOT_DIR/src/renderer/constants/authors.ts"

# Update Cargo.lock
echo "  → Updating Cargo.lock"
cd "$ROOT_DIR/src-tauri"
cargo check --quiet 2>/dev/null || true

echo ""
echo "✅ Version bumped to $NEW_VERSION"
echo ""
echo "Files updated:"
echo "  - package.json"
echo "  - package-lock.json"
echo "  - src-tauri/Cargo.toml"
echo "  - src-tauri/Cargo.lock"
echo "  - src-tauri/tauri.conf.json"
echo "  - landing/constants.js"
echo "  - src/renderer/constants/authors.ts"
echo ""
echo "Next steps:"
echo "  git add -A"
echo "  git commit -m 'chore: bump version to v$NEW_VERSION'"
echo "  git tag v$NEW_VERSION"
echo "  git push && git push --tags"

