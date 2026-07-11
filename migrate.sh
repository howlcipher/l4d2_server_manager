#!/bin/bash
set -e

BUILDER_DIR="/home/howlcipher/dev/L4D2/l4d2_server_builder"
MANAGER_DIR="/home/howlcipher/dev/L4D2/l4d2_server_manager"

echo "Copying web UI files to the builder project..."
cp -r "$MANAGER_DIR"/* "$BUILDER_DIR/"
cp -r "$MANAGER_DIR"/.git "$BUILDER_DIR/" 2>/dev/null || true
cp "$MANAGER_DIR"/.gitignore "$BUILDER_DIR/" 2>/dev/null || true

echo "Configuring the build script to output to bundled_mods..."
cd "$BUILDER_DIR"
sed -i 's/"build_directory": "dist\/left4dead2"/"build_directory": "bundled_mods"/g' config.json

echo "Running the build script to bundle all plugins, extensions, and configs..."
python3 build.py

echo "Done restructuring!"
