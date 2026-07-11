import { GET } from '../src/app/api/mods/list/route';

// Mock fs/promises
jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(true),
  readdir: jest.fn().mockImplementation((dir) => {
    if (dir.includes('disabled')) return Promise.resolve(['test_disabled.smx']);
    if (dir.includes('plugins')) return Promise.resolve(['test_plugin.smx']);
    if (dir.includes('addons')) return Promise.resolve(['test_addon.vpk']);
    return Promise.resolve([]);
  })
}));

describe('Mods List API', () => {
  it('should return a unified list of mods and their statuses', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.mods).toHaveLength(3);
    
    const disabledMod = data.mods.find((m: any) => m.name === 'test_disabled.smx');
    expect(disabledMod).toBeDefined();
    expect(disabledMod.status).toBe('disabled');
  });
});
