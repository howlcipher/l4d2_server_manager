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

## 🚀 Getting Started (For Beginners)

We designed this manager so that you don't need to be a programmer to use it. If you can copy and paste, you can run a highly customized L4D2 server!

### Step 1: Download the Manager
Open your Linux terminal (e.g., PuTTY or your server's console) and copy-paste these commands one by one, pressing **Enter** after each:
```bash
git clone https://github.com/howlcipher/l4d2_server_manager.git
cd l4d2_server_manager
```

### Step 2: Run the Automated Setup
We wrote a script that will automatically install all the boring technical stuff (Node.js, SteamCMD, Databases) for you:
```bash
./setup.sh
```
*(Wait a minute or two for this to finish. It will print "Setup Complete!" when it's done.)*

### Step 3: Start the Web Dashboard
Now, start the web interface so you can access it from your browser:
```bash
npm run build
npx pm2 start npm --name "l4d2-web" -- start
```

### Step 4: Access Your Server
1. Open your web browser (Chrome, Firefox, etc.).
2. Type in your server's IP address followed by `:3000` (Example: `http://192.168.1.50:3000`).
3. You should see the login screen!

### Step 5: Install the Game
Inside the web dashboard, simply click the **"Install Server & Core Mods"** button. The dashboard will automatically download the Left 4 Dead 2 game files and inject all the custom plugins for you.

---

## ⚙️ Advanced Configuration (Optional)

### Automated Background Updates & Discord Webhooks
If you want the server to automatically check for updates every night and send alerts to a Discord channel, run these commands:
```bash
# Set your Discord webhook URL (replace the URL inside the quotes)
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/your-webhook-link"

# Start the automated background worker
npx pm2 start cron.js --name "l4d2-cron"
```

### 🧪 Running Tests (For Developers)
If you are modifying the code and want to ensure you haven't broken anything, run the automated test suite:
```bash
npm install
npm run test
```

## 📂 Architecture
*   **`bundled_mods/`**: The statically compiled directory containing all custom `.smx` plugins, `.so` extensions, `.cfg` configurations, and VScripts ready to be injected into the server.
*   **`src/app/`**: The Next.js frontend and API routes.
*   **`cron.js`**: The background worker for automation.
*   **`docs/`**: The 16-bit retro GitHub Pages landing site.

## 📝 License
MIT License. Created for the L4D2 Modding Community.
