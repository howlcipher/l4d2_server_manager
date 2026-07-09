import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { existsSync, openSync } from 'fs';

export async function POST() {
  const scriptPath = path.join(process.cwd(), 'install_server.sh');
  
  if (!existsSync(scriptPath)) {
    return NextResponse.json({ success: false, error: 'Install script not found' }, { status: 404 });
  }

  const out = openSync(path.join(process.cwd(), 'install.log'), 'a');
  const err = openSync(path.join(process.cwd(), 'install.err'), 'a');

  const child = spawn('bash', [scriptPath], {
    cwd: process.cwd(),
    detached: true,
    stdio: ['ignore', out, err]
  });

  child.unref();

  return NextResponse.json({ success: true, message: 'Installation started in background. Check install.log for progress.' });
}
