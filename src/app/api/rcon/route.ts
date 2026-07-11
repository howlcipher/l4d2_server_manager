import { NextResponse } from 'next/server';
import { Rcon } from 'rcon-client';

export async function POST(req: Request) {
  try {
    const { command, password, port = 27015 } = await req.json();
    
    if (!command || !password) {
      return NextResponse.json({ error: 'Command and RCON password are required' }, { status: 400 });
    }

    const rcon = await Rcon.connect({
      host: '127.0.0.1', port, password
    });

    const response = await rcon.send(command);
    rcon.end();

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('RCON Error:', error);
    return NextResponse.json({ error: 'Failed to connect to RCON or execute command' }, { status: 500 });
  }
}
