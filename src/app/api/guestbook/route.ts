import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const entries = await prisma.guestbook.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return NextResponse.json({ entries });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch guestbook' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, message } = await req.json();
    
    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
    }

    const entry = await prisma.guestbook.create({
      data: { name, message }
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to sign guestbook' }, { status: 500 });
  }
}
