"use client";
import { useState, useEffect } from 'react';

export default function ModsManager() {
  const [mods, setMods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMods = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mods/list');
      const data = await res.json();
      if (data.success) {
        setMods(data.mods);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const toggleMod = async (name: string, type: string, currentStatus: string) => {
    try {
      await fetch('/api/mods/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, currentStatus })
      });
      fetchMods();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMods();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-red-500">Mod & VPK Manager</h1>
      <p className="mb-4">Enable or disable server plugins and addons in real-time.</p>
      
      {loading ? (
        <p>Loading arsenal...</p>
      ) : (
        <div className="bg-black border-2 border-green-500 p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2 text-yellow-400">Mod Name</th>
                <th className="p-2 text-yellow-400">Type</th>
                <th className="p-2 text-yellow-400">Status</th>
                <th className="p-2 text-yellow-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {mods.map((mod: any, i: number) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-900">
                  <td className="p-2">{mod.name}</td>
                  <td className="p-2 uppercase text-xs text-gray-400">{mod.type}</td>
                  <td className="p-2">
                    <span className={mod.status === 'enabled' ? 'text-green-500' : 'text-red-500'}>
                      {mod.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-2">
                    <button 
                      onClick={() => toggleMod(mod.name, mod.type, mod.status)}
                      className="px-3 py-1 bg-gray-800 border border-gray-600 hover:border-white text-sm"
                    >
                      {mod.status === 'enabled' ? 'DISABLE' : 'ENABLE'}
                    </button>
                  </td>
                </tr>
              ))}
              {mods.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">No mods found. Install the server first.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
