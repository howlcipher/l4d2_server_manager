import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const addonsDir = path.join(process.cwd(), 'game-server', 'left4dead2', 'addons');
    const pluginsDir = path.join(addonsDir, 'sourcemod', 'plugins');
    const disabledPluginsDir = path.join(pluginsDir, 'disabled');

    // Ensure directories exist
    await fs.mkdir(addonsDir, { recursive: true });
    await fs.mkdir(pluginsDir, { recursive: true });
    await fs.mkdir(disabledPluginsDir, { recursive: true });

    const getFiles = async (dir: string) => {
      try {
        const files = await fs.readdir(dir);
        return files.filter(f => f.endsWith('.smx') || f.endsWith('.vpk'));
      } catch {
        return [];
      }
    };

    const enabledVpks = await getFiles(addonsDir);
    const enabledPlugins = await getFiles(pluginsDir);
    const disabledPlugins = await getFiles(disabledPluginsDir);

    // Map to unified structure
    const mods = [
      ...enabledVpks.map(name => ({ name, type: 'vpk', status: 'enabled', path: addonsDir })),
      ...enabledPlugins.map(name => ({ name, type: 'smx', status: 'enabled', path: pluginsDir })),
      ...disabledPlugins.map(name => ({ name, type: 'smx', status: 'disabled', path: disabledPluginsDir }))
    ];

    return NextResponse.json({ success: true, mods });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list mods' }, { status: 500 });
  }
}
