"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
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
    <main className="min-h-screen flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-red-500/10 rounded-full text-red-500 mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-100">Admin Login</h1>
          <p className="text-gray-400 mt-1">L4D2 Server Manager</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-gray-100 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                required
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-gray-100 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-3 rounded-xl font-semibold tracking-wide disabled:opacity-50 mt-4"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          First time? <Link href="/register" className="text-red-400 hover:text-red-300">Create Admin Account</Link>
        </div>
      </motion.div>
    </main>
  );
}
