import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { existsSync, openSync } from 'fs';

const BASE_DIR = process.cwd();
const SERVER_DIR = path.join(BASE_DIR, 'game-server');
const STEAMCMD_DIR = path.join(BASE_DIR, 'steamcmd');
const PID_FILE = path.join(SERVER_DIR, 'server.pid');

export async function getServerStatus() {
  try {
    if (!existsSync(PID_FILE)) {
      return { status: 'stopped' };
    }
    const pidStr = await fs.readFile(PID_FILE, 'utf-8');
    const pid = parseInt(pidStr.trim(), 10);
    // Check if process exists by sending signal 0
    process.kill(pid, 0);
    return { status: 'running', pid };
  } catch (e) {
    // Process doesn't exist or file error
    return { status: 'stopped' };
  }
}

export async function startServer() {
  const status = await getServerStatus();
  if (status.status === 'running') return { success: false, message: 'Already running' };

  const exePath = path.join(SERVER_DIR, 'srcds_run');
  if (!existsSync(exePath)) {
    return { success: false, message: 'Server executable not found. Please install first.' };
  }

  // Basic L4D2 start command
  const out = openSync(path.join(SERVER_DIR, 'server.log'), 'a');
  const err = openSync(path.join(SERVER_DIR, 'server.err'), 'a');

  // +maxplayers 16 because of L4DToolz integration target
  const child = spawn('./srcds_run', [
    '-game', 'left4dead2',
    '-strictportbind',
    '-port', '27015',
    '+clientport', '27005',
    '+map', 'c1m1_hotel',
    '+servercfgfile', 'server.cfg',
    '+maxplayers', '16',
    '-tickrate', '100'
  ], {
    cwd: SERVER_DIR,
    detached: true,
    stdio: ['ignore', out, err]
  });

  child.unref();

  if (child.pid) {
    await fs.writeFile(PID_FILE, child.pid.toString());
    return { success: true, pid: child.pid };
  }
  return { success: false, message: 'Failed to spawn process' };
}

export async function stopServer() {
  const status = await getServerStatus();
  if (status.status !== 'running') return { success: false, message: 'Not running' };

  try {
    process.kill(status.pid!, 'SIGTERM');
    await fs.unlink(PID_FILE).catch(() => {});
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Failed to kill process' };
  }
}
