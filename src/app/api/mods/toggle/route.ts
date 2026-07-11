import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { name, type, currentStatus } = await req.json();
    
    const addonsDir = path.join(process.cwd(), 'game-server', 'left4dead2', 'addons');
    const pluginsDir = path.join(addonsDir, 'sourcemod', 'plugins');
    const disabledPluginsDir = path.join(pluginsDir, 'disabled');

    let src = '';
    let dest = '';

    if (type === 'smx') {
      if (currentStatus === 'enabled') {
        src = path.join(pluginsDir, name);
        dest = path.join(disabledPluginsDir, name);
      } else {
        src = path.join(disabledPluginsDir, name);
        dest = path.join(pluginsDir, name);
      }
    } else if (type === 'vpk') {
      // For VPKs, we append .disabled to the extension to disable them
      if (currentStatus === 'enabled') {
        src = path.join(addonsDir, name);
        dest = path.join(addonsDir, name + '.disabled');
      } else {
        src = path.join(addonsDir, name); // it will actually be passed as .vpk.disabled in a real robust app, but for simplicity:
        dest = path.join(addonsDir, name.replace('.disabled', ''));
      }
    }

    await fs.rename(src, dest);

    return NextResponse.json({ success: true, message: `Toggled ${name}` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle mod' }, { status: 500 });
  }
}
