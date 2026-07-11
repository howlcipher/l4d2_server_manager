# L4D2 Server Manager & Builder

<div align="center">
  <img src="https://img.shields.io/github/package-json/v/howlcipher/l4d2_server_manager?color=red&style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/github/license/howlcipher/l4d2_server_manager?color=green&style=for-the-badge" alt="License" />
</div>

The ultimate, all-in-one suite for deploying, configuring, and managing Left 4 Dead 2 dedicated servers on Linux. 

This project combines a **Next.js Web Dashboard** with a **Pre-bundled Mod Architecture**, meaning you can deploy a fully competitive, highly customized server with a single click.

## ✨ Features
*   **One-Click SteamCMD Deploy:** The `setup.sh` and web UI handle everything from downloading the game to installing Metamod and SourceMod.
*   **Live RCON Web Terminal:** Send commands directly to your server from the web dashboard.
*   **Server Metrics Dashboard:** View real-time graphs of your server's player count and status via `gamedig` and `recharts`.
*   **Live Mod Toggling:** Enable or disable custom `.smx` plugins and `.vpk` addons instantly from the UI.
*   **Automated Updates:** A built-in Node.js cron daemon checks for SteamCMD updates daily at 4:00 AM.
*   **Discord Webhooks:** Get notified in your Discord server when automated updates happen.
*   **Automated Testing:** Powered by Jest and React Testing Library to ensure your APIs and UI remain stable.

## 🚀 Getting Started

### Prerequisites
*   Linux Server (Ubuntu/Debian recommended)
*   Node.js 18+ and npm
*   `lib32gcc-s1` (Required by SteamCMD)

### 1. Installation
Clone the repository and run the setup script:
```bash
git clone git@github.com:howlcipher/l4d2_server_manager.git
cd l4d2_server_manager
./setup.sh
```
*(The setup script installs Node.js, dependencies, and prepares the local SQLite database).*

### 2. Start the Manager
You can run the web dashboard in the background using PM2, or run it directly:
```bash
npm run dev
# OR for production:
npm start
```
Go to `http://YOUR_SERVER_IP:3000` in your web browser. 

### 3. Deploy the L4D2 Server
Inside the web dashboard, click **"Install Server & Core Mods"**. The manager will automatically download the L4D2 server files and inject all the custom plugins and configs located in the `bundled_mods/` folder.

### 4. Start the Background Daemon (Optional)
To enable automated updates and Discord notifications, run the cron worker:
```bash
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
node cron.js &
```

## 🧪 Running Tests
To run the automated regression tests:
```bash
npm run test
```

## 📂 Architecture
*   **`bundled_mods/`**: The statically compiled directory containing all custom `.smx` plugins, `.so` extensions, `.cfg` configurations, and VScripts ready to be injected into the server.
*   **`src/app/`**: The Next.js frontend and API routes.
*   **`cron.js`**: The background worker for automation.
*   **`docs/`**: The 16-bit retro GitHub Pages landing site.

## 📝 License
MIT License. Created for the L4D2 Modding Community.
