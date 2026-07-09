import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Both passwords required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username: session.user.name } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) return NextResponse.json({ error: 'Incorrect old password' }, { status: 403 });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
