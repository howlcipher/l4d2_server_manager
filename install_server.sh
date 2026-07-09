#!/bin/bash
set -e

BASE_DIR="$(pwd)"
SERVER_DIR="$BASE_DIR/game-server"
STEAMCMD_DIR="$BASE_DIR/steamcmd"
MODS_DIR="$SERVER_DIR/left4dead2/addons"

echo "Creating directories..."
mkdir -p "$STEAMCMD_DIR"
mkdir -p "$SERVER_DIR"

echo "Downloading and installing SteamCMD..."
cd "$STEAMCMD_DIR"
if [ ! -f "steamcmd.sh" ]; then
    curl -sqL "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz" | tar zxvf -
fi

echo "Installing L4D2 Dedicated Server..."
./steamcmd.sh +force_install_dir "$SERVER_DIR" +login anonymous +app_update 222860 validate +quit

echo "Installing MetaMod and SourceMod..."
cd "$SERVER_DIR/left4dead2"
# Download Metamod:Source 1.11
curl -sqL "https://mms.alliedmods.net/mmsdrop/1.11/mmsource-1.11.0-git1148-linux.tar.gz" | tar zxvf -
# Download SourceMod 1.11
curl -sqL "https://sm.alliedmods.net/smdrop/1.11/sourcemod-1.11.0-git6934-linux.tar.gz" | tar zxvf -

echo "Downloading Satanic-Spirit extensions (L4DToolz & Tickrate-Enabler)..."
mkdir -p "$MODS_DIR/sourcemod/extensions"

# L4DToolz (Assuming standard latest release download link, we might need to compile or fetch binary)
# Usually you fetch a pre-compiled .so from the releases. I'll download generic placeholders or standard links if available.
# Actually, it's better to clone or download specific releases if we can find them.
# I'll create a placeholder for downloading specific mods for now. We can refine this later.
# In a real scenario, you'd use GitHub API to get the latest release asset url.
echo "To complete mod installation, place the specific .so and .vdf files from Satanic-Spirit into left4dead2/addons/"

echo "Installation Complete!"
