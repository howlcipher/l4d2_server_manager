# L4D2 Server Manager

![L4D2 Manager](docs/hero-bg.jpg)

A modern, highly-customizable web dashboard for deploying and managing Left 4 Dead 2 dedicated servers natively on Linux. Built with **Next.js**, **Tailwind CSS**, and **Prisma**, this tool gives you absolute control over your server without ever needing to touch the terminal.

## ✨ Features
- **One-Click Deploy:** Automated `setup.sh` script installs everything (Node.js, SteamCMD, dependencies) for absolute beginners.
- **Global Accessibility:** Built-in support for 9 languages 🇺🇸🇪🇸🇷🇺🇨🇳🇩🇪🇫🇮🇮🇳🇵🇱🇯🇵, seamless Light/Dark modes, and high-contrast Color-Blind mode.
- **Live Config Editor:** Edit `server.cfg` and SourceMod configurations directly in the browser.
- **VPK & Mod Uploader:** Upload custom maps, campaigns, and `.smx` plugins with a drag-and-drop interface.
- **Secure Admin Dashboard:** NextAuth session management with SQLite ensures your server is locked down.
- **Roadmap Ready:** UI scaffolding is live for Server Console streaming, Discord Webhooks, Auto-Updates, and Sub-Admin Management (Backend APIs coming soon).

## 🛠 Planned Features
- Real-time Server Console streaming
- Automated SteamCMD L4D2 Updates
- Multi-User Management / Sub-Admins

## 🚀 Getting Started

### Prerequisites
- Linux Server (Ubuntu/Debian recommended)
- Node.js 18+ and npm
- `lib32gcc-s1` (Required by SteamCMD)

### Installation (For Beginners)

We've created a completely automated, one-click installer designed for absolute beginners. You don't need to know how to set up databases or node modules.

1. Open your terminal on your Linux server and clone the repository:
   ```bash
   git clone git@github.com:howlcipher/l4d2_server_manager.git
   cd l4d2_server_manager
   ```
2. Run the automated setup script:
   ```bash
   ./setup.sh
   ```
   *This script will automatically install Node.js, download dependencies, configure the database, inject the default admin account, and build the dashboard.*

3. Start the dashboard in the background so it runs 24/7:
   ```bash
   npx pm2 start npm --name "l4d2-manager" -- start
   ```

4. Go to `http://YOUR_SERVER_IP:3000` in your web browser.
5. Login with Username: `admin` and Password: `123`

*(Note: Once logged in, click "Install Server & Core Mods" from the dashboard to download the actual L4D2 server files).*

## 🎨 Architecture
- **Frontend:** Next.js App Router (React), Tailwind CSS, Framer Motion for animations, Lucide Icons.
- **Backend:** Next.js API Routes, NextAuth.js for session management, Prisma ORM with SQLite.
- **System:** Uses Node's `child_process` to spawn and manage the detached `srcds_run` L4D2 process and read/write to the Linux file system natively.

## 📝 License
MIT License. Created for the L4D2 Modding Community.
