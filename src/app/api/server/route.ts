import { NextResponse } from 'next/server';
import { getServerStatus, startServer, stopServer } from '@/lib/serverManager';

export async function GET() {
  const status = await getServerStatus();
  return NextResponse.json(status);
}

export async function POST(request: Request) {
  const { action } = await request.json();

  if (action === 'start') {
    const result = await startServer();
    return NextResponse.json(result);
  } else if (action === 'stop') {
    const result = await stopServer();
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
