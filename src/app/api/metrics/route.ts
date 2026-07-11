import { NextResponse } from 'next/server';
import { GameDig } from 'gamedig';

export async function GET(req: Request) {
  try {
    const state = await GameDig.query({
      type: 'left4dead2',
      host: '127.0.0.1',
      port: 27015
    });

    return NextResponse.json({ 
      success: true, 
      metrics: {
        name: state.name,
        map: state.map,
        players: state.players.length,
        maxplayers: state.maxplayers,
        ping: state.ping
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server offline or unreachable' });
  }
}
