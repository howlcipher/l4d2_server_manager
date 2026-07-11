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

echo "Incorporating bundled plugins, extensions, and configs..."
if [ -d "$BASE_DIR/bundled_mods" ]; then
    echo "Copying bundled files to the Game Server..."
    cp -r "$BASE_DIR/bundled_mods/"* "$SERVER_DIR/left4dead2/"
    echo "Local plugins and configurations successfully incorporated!"
else
    echo "Bundled mods not found at $BASE_DIR/bundled_mods. Skipping local plugin integration."
fi

echo "Installation Complete!"
