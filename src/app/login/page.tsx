"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError('Invalid username or password');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen flex flex-col transition-colors duration-300 relative overflow-auto bg-background text-foreground" style={{ backgroundImage: "url('/bg.jpg')", backgroundAttachment: "fixed" }}>
      <table border={5} cellPadding={15} cellSpacing={5} align="center" style={{ borderColor: '#00ff00', backgroundColor: '#111', width: '90%', maxWidth: '500px', margin: '50px auto' }}>
        <tbody><tr><td>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8"
      >
        <div className="text-center mb-8 border-4 border-green-500 bg-black p-4">
          <div className="inline-flex p-4 bg-black rounded-2xl text-danger border-[5px] border-red-500 mb-4">
            <img src="/logo.jpg" alt="Logo" width="64" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1 font-impact uppercase" style={{ color: "yellow", textShadow: "2px 2px #ff0000" }}>Admin Access</h1>
          <p className="text-green-400 font-mono text-sm md:text-lg font-bold">Login to manage your L4D2 server</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm font-medium flex items-center gap-2">
            <ShieldAlert size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Username</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus-ring placeholder-muted transition-colors"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Password</label>
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
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted">
          Need an account? <Link href="/register" className="text-brand hover:underline font-medium focus-ring rounded">Create Admin Account</Link>
        </div>
      </motion.div>
        </td></tr></tbody>
      </table>
    </main>
  );
}
