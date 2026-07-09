"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
      } else {
        router.push('/login');
      }
    } catch (err) {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-danger/10 rounded-full text-danger border border-danger/20 mb-4">
            <Server size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">System Init</h1>
          <p className="text-muted mt-2">Create the master admin account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm font-medium flex items-center gap-2">
            <ShieldAlert size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Admin Username</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus-ring placeholder-muted transition-colors"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Secure Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus-ring placeholder-muted transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 rounded-xl font-semibold tracking-wide disabled:opacity-50 mt-4 focus-ring"
          >
            {loading ? 'Creating Account...' : 'Register Admin'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted">
          Already have an account? <Link href="/login" className="text-brand hover:underline font-medium focus-ring rounded">Login</Link>
        </div>
      </motion.div>
    </main>
  );
}
