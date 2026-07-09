#!/bin/bash

# Exit on any error
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}=================================================${NC}"
echo -e "${RED}       L4D2 SERVER MANAGER - AUTO SETUP          ${NC}"
echo -e "${RED}=================================================${NC}"
echo ""

echo -e "${YELLOW}[1/5] Checking system dependencies...${NC}"
if [ -x "$(command -v apt-get)" ]; then
    sudo apt-get update
    sudo apt-get install -y curl wget lib32gcc-s1
else
    echo -e "${YELLOW}Note: apt-get not found. Make sure you have curl, wget, and 32-bit libraries installed.${NC}"
fi

echo -e "${YELLOW}[2/5] Checking Node.js installation...${NC}"
if ! [ -x "$(command -v node)" ]; then
    echo "Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
echo -e "${GREEN}Node.js installed!${NC}"

echo -e "${YELLOW}[3/5] Installing project dependencies...${NC}"
npm install

echo -e "${YELLOW}[4/5] Setting up the database and default admin...${NC}"
npx prisma generate
npx prisma db push
node seed.js

echo -e "${YELLOW}[5/5] Building the web dashboard...${NC}"
npm run build

echo -e "${RED}=================================================${NC}"
echo -e "${GREEN}Setup Complete! The Manager is ready.${NC}"
echo -e "${RED}=================================================${NC}"
echo ""
echo -e "To start the manager, you have two options:"
echo -e "1. Run ${YELLOW}npm start${NC} (runs in your current terminal)"
echo -e "2. Run ${YELLOW}npx pm2 start npm --name \"l4d2-manager\" -- start${NC} (runs in the background 24/7)"
echo ""
echo -e "Once started, open your web browser and go to:"
echo -e "${GREEN}http://YOUR_SERVER_IP:3000${NC}"
echo -e "Login with Username: ${YELLOW}admin${NC} and Password: ${YELLOW}123${NC}"
