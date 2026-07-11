const cron = require('node-cron');
const { exec } = require('child_process');

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

async function notifyDiscord(message) {
  if (!DISCORD_WEBHOOK_URL) return;
  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `[L4D2 Manager] ${message}` })
    });
  } catch (e) {
    console.error("Failed to send webhook:", e);
  }
}

// Check for SteamCMD updates every morning at 4 AM
cron.schedule('0 4 * * *', () => {
  console.log('Running scheduled SteamCMD update check...');
  notifyDiscord('Running scheduled SteamCMD update check...');
  
  exec('./steamcmd/steamcmd.sh +force_install_dir ./game-server +login anonymous +app_update 222860 +quit', (err, stdout, stderr) => {
    if (err) {
      console.error('Update failed:', err);
      notifyDiscord(`Update failed: ${err.message}`);
      return;
    }
    console.log('Update check completed successfully.');
    notifyDiscord('SteamCMD update check completed.');
  });
});

console.log('Cron daemon started.');
notifyDiscord('Server Manager Cron Daemon initialized.');
