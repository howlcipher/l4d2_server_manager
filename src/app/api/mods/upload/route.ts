import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const addonsDir = path.join(process.cwd(), 'game-server', 'left4dead2', 'addons');
    
    // Ensure directory exists
    await fs.mkdir(addonsDir, { recursive: true });
    
    const filePath = path.join(addonsDir, file.name);
    await fs.writeFile(filePath, buffer);
    
    return NextResponse.json({ success: true, message: `Uploaded ${file.name}` });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
