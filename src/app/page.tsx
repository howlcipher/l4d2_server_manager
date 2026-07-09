"use client";

import { useState, useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Server, Power, Play, Settings, ShieldAlert, Download, Cpu, HardDrive, LogOut, Upload, FileText, Save } from 'lucide-react';

export default function Home() {
  const [status, setStatus] = useState<'running' | 'stopped' | 'loading'>('loading');
  const [installing, setInstalling] = useState(false);
  const [message, setMessage] = useState('');

  // Config & Mod States
  const [configFiles, setConfigFiles] = useState<{name: string, dirId: string, dirPath: string}[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [configContent, setConfigContent] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/server');
      const data = await res.json();
      setStatus(data.status);
    } catch {
      setStatus('stopped');
    }
  };

  const fetchConfigs = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.files) setConfigFiles(data.files);
    } catch (e) {}
  };

  useEffect(() => {
    fetchStatus();
    fetchConfigs();
    const interval = setInterval(() => {
      fetchStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (action: 'start' | 'stop') => {
    setStatus('loading');
    try {
      const res = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (!data.success) {
        setMessage(data.message);
      } else {
        setMessage('');
      }
      fetchStatus();
    } catch (e) {
      setMessage('Action failed');
      fetchStatus();
    }
  };

  const handleInstall = async () => {
    setInstalling(true);
    setMessage('Installation started in background. Please check install.log');
    try {
      await fetch('/api/install', { method: 'POST' });
    } catch (e) {
      setMessage('Failed to start installation');
    }
    setTimeout(() => {
      setInstalling(false);
      fetchConfigs();
    }, 5000);
  };

  const loadConfig = async (file: any) => {
    setSelectedFile(file);
    setConfigContent('Loading...');
    try {
      const res = await fetch(`/api/config?file=${file.name}&dir=${file.dirId}`);
      const data = await res.json();
      if (data.content !== undefined) setConfigContent(data.content);
      else setConfigContent('');
    } catch {
      setConfigContent('Error loading file');
    }
  };

  const saveConfig = async () => {
    if (!selectedFile) return;
    setSavingConfig(true);
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: selectedFile.name, dirId: selectedFile.dirId, content: configContent })
      });
      setMessage(`Saved ${selectedFile.name} successfully.`);
    } catch {
      setMessage(`Failed to save ${selectedFile.name}.`);
    }
    setSavingConfig(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setMessage(`Uploading ${file.name}...`);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/mods/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setMessage(data.message || 'Upload complete');
    } catch {
      setMessage('Upload failed');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-24 flex flex-col items-center justify-start relative overflow-auto">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl glass-panel p-8 md:p-12 z-10 mb-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-white/10 pb-8 gap-6">
          <div className="flex items-center gap-5">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="p-4 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
            >
              <Server size={36} />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">L4D2 Manager</h1>
              <p className="text-gray-400 text-sm md:text-base">Custom Server & Mod Controller</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
            <div className="flex items-center gap-3 bg-black/30 px-5 py-3 rounded-full border border-white/5">
              <div className={`w-3 h-3 rounded-full ${status === 'running' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : status === 'loading' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`} />
              <span className="font-bold text-sm uppercase tracking-widest text-gray-200">
                {status}
              </span>
            </div>
            <button 
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full border border-red-500/20 transition-all text-sm font-medium"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-4 bg-white/5 border border-white/10 text-gray-200 rounded-xl text-sm font-medium"
          >
            {message}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Quick Actions */}
          <div className="glass-panel p-6 md:p-8 bg-black/10 border-white/5">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-200">
              <Power size={22} className="text-red-400" /> Server Control
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => handleAction('start')}
                disabled={status === 'running' || status === 'loading'}
                className="flex-1 flex items-center justify-center gap-2 btn-primary py-3.5 rounded-xl font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Play size={18} className="group-hover:scale-110 transition-transform" /> Start Server
              </button>
              <button 
                onClick={() => handleAction('stop')}
                disabled={status === 'stopped' || status === 'loading'}
                className="flex-1 flex items-center justify-center gap-2 btn-secondary py-3.5 rounded-xl font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Power size={18} className="group-hover:scale-110 transition-transform" /> Stop Server
              </button>
            </div>
          </div>

          {/* Setup / Install */}
          <div className="glass-panel p-6 md:p-8 bg-black/10 border-white/5">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-200">
              <Download size={22} className="text-blue-400" /> Initial Setup
            </h2>
            <button 
              onClick={handleInstall}
              disabled={installing}
              className="w-full flex items-center justify-center gap-2 btn-secondary py-3.5 rounded-xl font-semibold tracking-wide disabled:opacity-50 group hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 transition-all"
            >
              <Settings size={18} className={`group-hover:rotate-90 transition-transform duration-500 ${installing ? 'animate-spin text-blue-400' : ''}`} /> 
              {installing ? 'Installing...' : 'Install Server & Core Mods'}
            </button>
          </div>
        </div>

        {/* Upload & Config Editor Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* File Upload Panel */}
          <div className="glass-panel p-6 bg-black/10 border-white/5 col-span-1">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-200">
              <Upload size={20} className="text-green-400" /> Mod & VPK Upload
            </h2>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Upload custom campaigns, scripts, or SourceMod plugins directly to the addons folder.
            </p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden" 
              accept=".vpk,.smx,.cfg"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-green-500/30 bg-green-500/5 hover:bg-green-500/10 text-green-400 py-6 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <Upload size={24} /> {uploading ? 'Uploading...' : 'Select File (.vpk, .smx)'}
            </button>
          </div>

          {/* Config Editor Panel */}
          <div className="glass-panel p-6 bg-black/10 border-white/5 col-span-1 lg:col-span-2 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
                <FileText size={20} className="text-purple-400" /> Config Editor
              </h2>
              {selectedFile && (
                <button 
                  onClick={saveConfig}
                  disabled={savingConfig}
                  className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Save size={16} /> {savingConfig ? 'Saving...' : 'Save File'}
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 h-full overflow-hidden">
              {/* File List */}
              <div className="w-full md:w-1/3 bg-black/30 rounded-xl border border-white/5 overflow-y-auto">
                <ul className="p-2 space-y-1">
                  {configFiles.map((file, i) => (
                    <li key={i}>
                      <button
                        onClick={() => loadConfig(file)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex flex-col ${selectedFile?.name === file.name && selectedFile?.dirId === file.dirId ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                      >
                        <span className="font-medium truncate">{file.name}</span>
                        <span className="text-[10px] opacity-60 truncate">{file.dirPath}</span>
                      </button>
                    </li>
                  ))}
                  {configFiles.length === 0 && (
                    <div className="text-center p-4 text-sm text-gray-500">No configs found. Install server first.</div>
                  )}
                </ul>
              </div>

              {/* Editor */}
              <div className="w-full md:w-2/3 bg-black/40 rounded-xl border border-white/5 p-4 flex flex-col">
                {selectedFile ? (
                  <textarea
                    value={configContent}
                    onChange={(e) => setConfigContent(e.target.value)}
                    className="w-full h-full bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none placeholder-gray-600"
                    placeholder="File content..."
                    spellCheck={false}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                    Select a configuration file to edit
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </main>
  );
}
