"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Entry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export default function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/guestbook');
      const data = await res.json();
      if (data.entries) setEntries(data.entries);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message })
      });
      setName('');
      setMessage('');
      fetchEntries();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#00ff00',
      fontFamily: '"Comic Sans MS", "Times New Roman", serif',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', border: '5px dotted #ff0000', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', color: '#ff0000', textDecoration: 'underline' }}>
          💀 SURVIVOR GUESTBOOK 💀
        </h1>
        
        <marquee direction="left" scrollamount="10" style={{ backgroundColor: '#ff0000', color: 'yellow', fontSize: '20px', padding: '5px', marginBottom: '20px' }}>
          LEAVE YOUR MARK BEFORE THE HORDE GETS YOU!
        </marquee>

        <form onSubmit={handleSubmit} style={{ backgroundColor: '#111', padding: '20px', border: '3px solid #00ff00', marginBottom: '30px' }}>
          <h2 style={{ color: 'yellow', marginTop: 0 }}>Sign the book:</h2>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Name (Alias):</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required 
              style={{ width: '100%', padding: '5px', backgroundColor: '#000', color: '#00ff00', border: '2px inset #ff0000' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Message:</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              required 
              rows={4}
              style={{ width: '100%', padding: '5px', backgroundColor: '#000', color: '#00ff00', border: '2px inset #ff0000' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ backgroundColor: '#ff0000', color: 'yellow', fontWeight: 'bold', padding: '10px 20px', border: '3px outset #ff0000', cursor: 'pointer' }}
          >
            {loading ? 'SUBMITTING...' : 'SUBMIT ENTRY'}
          </button>
        </form>

        <h2 style={{ color: '#ff0000', textDecoration: 'underline' }}>Entries:</h2>
        
        {entries.length === 0 ? (
          <p>No survivors have signed yet...</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} style={{ border: '2px solid #00ff00', marginBottom: '15px', padding: '10px', backgroundColor: '#111' }}>
              <h3 style={{ margin: '0 0 10px 0', color: 'yellow' }}>
                {entry.name} <span style={{ fontSize: '12px', color: '#ff0000' }}>({new Date(entry.createdAt).toLocaleDateString()})</span>
              </h3>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{entry.message}</p>
            </div>
          ))
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link href="/" style={{ color: '#ff0000', textDecoration: 'underline', fontWeight: 'bold' }}>
            [ RETURN TO DASHBOARD ]
          </Link>
        </div>
      </div>
    </div>
  );
}
