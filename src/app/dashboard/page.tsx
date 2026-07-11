"use client";
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ServerDashboard() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [command, setCommand] = useState('');
  const [rconLog, setRconLog] = useState<string[]>([]);
  const [password, setPassword] = useState('');

  // Fetch metrics every 5 seconds
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/metrics');
        const data = await res.json();
        if (data.success) {
          const timestamp = new Date().toLocaleTimeString();
          setMetrics(prev => [...prev.slice(-19), { time: timestamp, players: data.metrics.players }]);
        }
      } catch (e) {}
    };
    
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendRcon = async (e: any) => {
    e.preventDefault();
    setRconLog(prev => [...prev, `> ${command}`]);
    try {
      const res = await fetch('/api/rcon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, password })
      });
      const data = await res.json();
      if (data.success) {
        setRconLog(prev => [...prev, data.response]);
      } else {
        setRconLog(prev => [...prev, `Error: ${data.error}`]);
      }
    } catch (e) {
      setRconLog(prev => [...prev, `Connection failed.`]);
    }
    setCommand('');
  };

  return (
    <div className="p-8 text-white max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-red-500">Live Server Dashboard</h1>
      
      {/* Metrics Graph */}
      <div className="bg-black border-2 border-green-500 p-4">
        <h2 className="text-xl text-yellow-400 mb-4">Player Activity (Live)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#00ff00" />
              <YAxis stroke="#00ff00" />
              <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #00ff00' }} />
              <Legend />
              <Line type="monotone" dataKey="players" stroke="#ff0000" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RCON Terminal */}
      <div className="bg-black border-2 border-red-500 p-4">
        <h2 className="text-xl text-yellow-400 mb-4">RCON Web Terminal</h2>
        <div className="h-48 overflow-y-auto bg-gray-900 border border-gray-700 p-2 font-mono text-sm mb-4">
          {rconLog.map((log, i) => (
            <div key={i} className="whitespace-pre-wrap">{log}</div>
          ))}
        </div>
        <form onSubmit={sendRcon} className="flex gap-2">
          <input 
            type="password" 
            placeholder="RCON Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-600 focus:outline-none w-1/4"
          />
          <input 
            type="text" 
            placeholder="Enter command (e.g. status, changelevel)" 
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-600 focus:outline-none flex-grow"
          />
          <button type="submit" className="px-4 bg-red-600 hover:bg-red-500 font-bold">SEND</button>
        </form>
      </div>

    </div>
  );
}
