import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const getDirs = () => [
  { path: path.join(process.cwd(), 'game-server', 'left4dead2', 'cfg'), id: 'root' },
  { path: path.join(process.cwd(), 'game-server', 'left4dead2', 'cfg', 'sourcemod'), id: 'sourcemod' }
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileToRead = searchParams.get('file');
  const dirId = searchParams.get('dir');

  try {
    const dirs = getDirs();

    if (fileToRead && dirId) {
      const safePath = path.normalize(fileToRead).replace(/^(\.\.(\/|\\|$))+/, '');
      const dirObj = dirs.find(d => d.id === dirId);
      if (!dirObj) return NextResponse.json({ error: 'Invalid directory' }, { status: 400 });
      
      const fullPath = path.join(dirObj.path, safePath);
      if (!existsSync(fullPath)) return NextResponse.json({ error: 'File not found' }, { status: 404 });
      
      const content = await fs.readFile(fullPath, 'utf-8');
      return NextResponse.json({ content });
    }

    const files = [];
    for (const dirObj of dirs) {
      if (existsSync(dirObj.path)) {
        const dirFiles = await fs.readdir(dirObj.path);
        files.push(...dirFiles.filter(f => f.endsWith('.cfg')).map(f => ({
          name: f,
          dirId: dirObj.id,
          dirPath: dirObj.id === 'root' ? 'cfg/' : 'cfg/sourcemod/'
        })));
      }
    }
    
    // Fallback if no files exist yet (server not installed)
    if (files.length === 0) {
      return NextResponse.json({ files: [{ name: 'server.cfg (Not Created Yet)', dirId: 'root', dirPath: 'cfg/' }]});
    }

    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { file, content, dirId } = await req.json();
    const dirs = getDirs();
    const dirObj = dirs.find(d => d.id === dirId);
    
    if (!dirObj) return NextResponse.json({ error: 'Invalid directory' }, { status: 400 });
    
    const safePath = path.normalize(file).replace(/^(\.\.(\/|\\|$))+/, '');
    const fullPath = path.join(dirObj.path, safePath);
    
    // Ensure dir exists before writing
    await fs.mkdir(dirObj.path, { recursive: true });
    
    await fs.writeFile(fullPath, content);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write config' }, { status: 500 });
  }
}
