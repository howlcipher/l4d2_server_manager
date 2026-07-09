"use client";

import { useState, useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Server, Power, Play, Settings, Download, LogOut, Upload, FileText, Save, Eye, Terminal, MessageSquare, Users, RefreshCw, Globe } from 'lucide-react';

const i18n: Record<string, Record<string, string>> = {
  en: {
    title: "L4D2 Manager", sub: "Custom Server & Mod Controller", skip: "Skip to main content",
    ctrl: "Server Control", start: "Start Server", stop: "Stop Server",
    setup: "Initial Setup", install: "Install Server & Core Mods",
    up: "Mod & VPK Upload", upDesc: "Upload custom campaigns, scripts, or SourceMod plugins directly to the addons folder.",
    sel: "Select File (.vpk, .smx)", upg: "Uploading...",
    cfg: "Config Editor", save: "Save File", svg: "Saving...",
    cons: "Live Server Console", consDesc: "Console stream will appear here while server is running...",
    disc: "Discord Webhook", discDesc: "Enter Webhook URL", saveD: "Save Webhook",
    upd: "Server Updates", runUpd: "Update via SteamCMD",
    usr: "Admin Management", addU: "Add Sub-Admin",
    logout: "Logout", cb: "Color Blind Mode"
  },
  es: {
    title: "Gestor L4D2", sub: "Controlador de Servidor y Mods", skip: "Saltar al contenido principal",
    ctrl: "Control del Servidor", start: "Iniciar Servidor", stop: "Detener Servidor",
    setup: "Configuración Inicial", install: "Instalar Servidor",
    up: "Subir Mods", upDesc: "Sube campañas personalizadas y plugins.",
    sel: "Seleccionar Archivo", upg: "Subiendo...",
    cfg: "Editor de Configuración", save: "Guardar", svg: "Guardando...",
    cons: "Consola en Vivo", consDesc: "La consola aparecerá aquí...",
    disc: "Webhook de Discord", discDesc: "Introduce la URL del Webhook", saveD: "Guardar",
    upd: "Actualizaciones", runUpd: "Actualizar vía SteamCMD",
    usr: "Gestión de Administradores", addU: "Añadir Administrador",
    logout: "Cerrar Sesión", cb: "Modo Daltónico"
  },
  ru: {
    title: "Менеджер L4D2", sub: "Управление сервером", skip: "Перейти к контенту",
    ctrl: "Управление", start: "Запустить сервер", stop: "Остановить сервер",
    setup: "Установка", install: "Установить сервер",
    up: "Загрузка модов", upDesc: "Загрузите пользовательские карты и плагины.",
    sel: "Выбрать файл", upg: "Загрузка...",
    cfg: "Редактор конфигов", save: "Сохранить", svg: "Сохранение...",
    cons: "Живая консоль", consDesc: "Здесь будет консоль...",
    disc: "Discord Webhook", discDesc: "Введите URL Webhook", saveD: "Сохранить",
    upd: "Обновления", runUpd: "Обновить через SteamCMD",
    usr: "Управление админами", addU: "Добавить админа",
    logout: "Выйти", cb: "Режим для дальтоников"
  },
  zh: {
    title: "L4D2管理器", sub: "自定义服务器控制器", skip: "跳到主要内容",
    ctrl: "服务器控制", start: "启动服务器", stop: "停止服务器",
    setup: "初始设置", install: "安装服务器",
    up: "MOD上传", upDesc: "上传自定义战役和插件。",
    sel: "选择文件", upg: "上传中...",
    cfg: "配置编辑器", save: "保存", svg: "保存中...",
    cons: "实时控制台", consDesc: "控制台流将显示在这里...",
    disc: "Discord Webhook", discDesc: "输入Webhook URL", saveD: "保存",
    upd: "服务器更新", runUpd: "通过SteamCMD更新",
    usr: "管理员管理", addU: "添加管理员",
    logout: "登出", cb: "色盲模式"
  },
  de: {
    title: "L4D2-Manager", sub: "Server-Controller", skip: "Zum Hauptinhalt springen",
    ctrl: "Serversteuerung", start: "Server starten", stop: "Server stoppen",
    setup: "Ersteinrichtung", install: "Server installieren",
    up: "Mod Upload", upDesc: "Lade Kampagnen und Plugins hoch.",
    sel: "Datei auswählen", upg: "Wird hochgeladen...",
    cfg: "Konfigurationseditor", save: "Speichern", svg: "Wird gespeichert...",
    cons: "Live-Konsole", consDesc: "Konsolen-Stream erscheint hier...",
    disc: "Discord Webhook", discDesc: "Webhook-URL eingeben", saveD: "Speichern",
    upd: "Updates", runUpd: "Über SteamCMD aktualisieren",
    usr: "Benutzerverwaltung", addU: "Admin hinzufügen",
    logout: "Abmelden", cb: "Farbenblind-Modus"
  },
  fi: {
    title: "L4D2-hallinta", sub: "Mukautettu palvelin", skip: "Siirry sisältöön",
    ctrl: "Palvelimen hallinta", start: "Käynnistä", stop: "Sammuta",
    setup: "Alkuasennus", install: "Asenna palvelin ja modit",
    up: "Lataa VPK", upDesc: "Lataa mukautettuja kampanjoita ja laajennuksia.",
    sel: "Valitse tiedosto", upg: "Ladataan...",
    cfg: "Asetuseditori", save: "Tallenna", svg: "Tallennetaan...",
    cons: "Live-konsoli", consDesc: "Konsolin virta näkyy tässä...",
    disc: "Discord Webhook", discDesc: "Anna Webhook URL", saveD: "Tallenna",
    upd: "Päivitykset", runUpd: "Päivitä SteamCMD:n kautta",
    usr: "Käyttäjien hallinta", addU: "Lisää ylläpitäjä",
    logout: "Kirjaudu ulos", cb: "Värisokeiden tila"
  },
  hi: {
    title: "L4D2 प्रबंधक", sub: "कस्टम सर्वर", skip: "मुख्य सामग्री पर जाएं",
    ctrl: "सर्वर नियंत्रण", start: "सर्वर प्रारंभ करें", stop: "सर्वर रोकें",
    setup: "प्रारंभिक सेटअप", install: "सर्वर स्थापित करें",
    up: "VPK अपलोड करें", upDesc: "कस्टम अभियान और प्लगइन्स अपलोड करें।",
    sel: "फ़ाइल चुनें", upg: "अपलोड हो रहा है...",
    cfg: "कॉन्फ़िगरेशन संपादक", save: "सहेजें", svg: "सहेजा जा रहा है...",
    cons: "लाइव कंसोल", consDesc: "कंसोल स्ट्रीम यहां दिखाई देगी...",
    disc: "Discord वेबहुक", discDesc: "वेबहुक URL दर्ज करें", saveD: "सहेजें",
    upd: "सर्वर अपडेट", runUpd: "SteamCMD के माध्यम से अपडेट करें",
    usr: "उपयोगकर्ता प्रबंधन", addU: "व्यवस्थापक जोड़ें",
    logout: "लॉग आउट", cb: "कलर ब्लाइंड मोड"
  },
  pl: {
    title: "Menedżer L4D2", sub: "Niestandardowy serwer", skip: "Przejdź do głównej treści",
    ctrl: "Kontrola serwera", start: "Uruchom serwer", stop: "Zatrzymaj serwer",
    setup: "Początkowa konfiguracja", install: "Zainstaluj serwer",
    up: "Prześlij VPK", upDesc: "Prześlij niestandardowe kampanie i wtyczki.",
    sel: "Wybierz plik", upg: "Przesyłanie...",
    cfg: "Edytor konfiguracji", save: "Zapisz", svg: "Zapisywanie...",
    cons: "Konsola na żywo", consDesc: "Strumień konsoli pojawi się tutaj...",
    disc: "Discord Webhook", discDesc: "Wprowadź adres URL Webhooka", saveD: "Zapisz",
    upd: "Aktualizacje", runUpd: "Aktualizuj przez SteamCMD",
    usr: "Zarządzanie użytkownikami", addU: "Dodaj administratora",
    logout: "Wyloguj", cb: "Tryb dla daltonistów"
  },
  ja: {
    title: "L4D2マネージャー", sub: "カスタムサーバー", skip: "メインコンテンツへスキップ",
    ctrl: "サーバー制御", start: "サーバー起動", stop: "サーバー停止",
    setup: "初期セットアップ", install: "サーバーをインストール",
    up: "VPKのアップロード", upDesc: "カスタムキャンペーンとプラグインをアップロードします。",
    sel: "ファイルを選択", upg: "アップロード中...",
    cfg: "構成エディター", save: "保存", svg: "保存中...",
    cons: "ライブコンソール", consDesc: "コンソールストリームがここに表示されます...",
    disc: "Discord Webhook", discDesc: "Webhook URLを入力", saveD: "保存",
    upd: "サーバーの更新", runUpd: "SteamCMDで更新",
    usr: "ユーザー管理", addU: "管理者を追加",
    logout: "ログアウト", cb: "色覚異常モード"
  }
};

export default function Home() {
  const [lang, setLang] = useState('en');
  const t = i18n[lang];

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
  const [hits, setHits] = useState(0);
  
  // Theme & Accessibility
  const [isColorBlind, setIsColorBlind] = useState(false);

  useEffect(() => {
    if (isColorBlind) {
      document.documentElement.setAttribute('data-theme', 'color-blind');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isColorBlind]);

  useEffect(() => {
    let savedHits = localStorage.getItem('l4d2_hits');
    if (!savedHits) savedHits = (Math.floor(Math.random() * 50000) + 1000000).toString();
    const newHits = parseInt(savedHits) + 1;
    localStorage.setItem('l4d2_hits', newHits.toString());
    setHits(newHits);
  }, []);

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
        setMessage(action === 'start' ? 'Server started successfully.' : 'Server stopped.');
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
    <div className="min-h-screen flex flex-col transition-colors duration-300 relative overflow-auto bg-background text-foreground" style={{ backgroundImage: "url('/bg.jpg')", backgroundAttachment: "fixed" }}>
      
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand text-white p-4 rounded z-50">
        {t.skip}
      </a>

      <div style={{ textAlign: "center", marginTop: "10px", width: "100%" }}>
        <p><span className="blink" style={{ color: "yellow", fontSize: "1.2rem" }}>LAST UPDATED: JULY 09, 2026</span></p>
        <audio controls autoPlay loop id="bgm" style={{ border: "3px ridge red", margin: "0 auto", display: "inline-block" }}>
          <source src="https://bitmidi.com/uploads/16279.mid" type="audio/midi" />
        </audio>
      </div>

      <header className="w-full p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-4 border-green-500 bg-black/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          
          <button 
            onClick={() => setIsColorBlind(!isColorBlind)}
            className={`p-2 rounded-full focus-ring transition-colors flex items-center gap-2 ${isColorBlind ? 'bg-brand/20 text-brand' : 'hover:bg-secondary'}`}
            aria-label="Toggle Color Blind Mode"
            aria-pressed={isColorBlind}
          >
            <Eye size={20} /> <span className="sr-only sm:not-sr-only text-sm font-medium">{t.cb}</span>
          </button>

          <div className="flex items-center gap-2 bg-secondary border border-border rounded-full px-3 py-1">
            <Globe size={16} className="text-muted" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-sm font-medium focus-ring focus:outline-none"
              aria-label="Select Language"
            >
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="zh">🇨🇳 中文</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="fi">🇫🇮 Suomi</option>
              <option value="hi">🇮🇳 हिन्दी</option>
              <option value="pl">🇵🇱 Polski</option>
              <option value="ja">🇯🇵 日本語</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-3 bg-secondary px-5 py-2 rounded-full border border-border"
            aria-live="polite"
            role="status"
          >
            <div 
              className={`w-3 h-3 rounded-full ${
                status === 'running' ? 'bg-success shadow-[0_0_10px_var(--color-success)]' : 
                status === 'loading' ? 'bg-warning animate-pulse' : 
                'bg-danger shadow-[0_0_10px_var(--color-danger)]'
              }`} 
              aria-hidden="true"
            />
            <span className="font-bold text-sm uppercase tracking-widest">
              <span className="sr-only">Status: </span>{status}
            </span>
          </div>
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 bg-danger/10 hover:bg-danger/20 text-danger rounded-full border border-danger/20 transition-all text-sm font-medium focus-ring"
            aria-label={t.logout}
          >
            <LogOut size={16} aria-hidden="true" /> {t.logout}
          </button>
        </div>
      </header>

      <table border={5} cellPadding={15} cellSpacing={5} align="center" style={{ borderColor: '#00ff00', backgroundColor: '#111', width: '95%', margin: '20px auto' }}>
        <tbody><tr><td>
      <main id="main-content" className="flex-1 w-full mx-auto p-4 sm:p-8 lg:p-12 focus:outline-none" tabIndex={-1}>
        {/* @ts-ignore */}
        <marquee direction="right" scrollamount="12" className="text-yellow-400 font-bold text-2xl mb-8 bg-red-900/50 p-2 border-4 border-red-500 shadow-[0_0_15px_#f00]">⚠️ WARNING: INFECTION DETECTED ⚠️ UNDER CONSTRUCTION ⚠️</marquee>

        <div className="flex items-center gap-5 mb-10 border-4 border-green-500 p-4 bg-black">
          <div className="p-4 bg-black rounded-2xl text-danger border-[5px] border-red-500" aria-hidden="true">
            <img src="/logo.jpg" alt="Logo" width="64" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-1 font-impact uppercase" style={{ color: "yellow", textShadow: "2px 2px #ff0000" }}>{t.title}</h1>
            <p className="text-green-400 font-mono text-sm md:text-xl font-bold">{t.sub}</p>
          </div>
        </div>

        <div aria-live="assertive" role="alert">
          {message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 p-4 bg-secondary border border-border rounded-xl text-sm font-medium shadow-sm"
            >
              {message}
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
          {/* Main Controls - Left Column */}
          <div className="col-span-1 xl:col-span-2 space-y-6">
            
            <section aria-labelledby="quick-actions-heading" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6">
                <h2 id="quick-actions-heading" className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <img src="https://cyber.dabamos.de/88x31/linux.gif" alt="linux" /> {t.ctrl}
                </h2>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleAction('start')}
                    disabled={status === 'running' || status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 btn-primary py-3 rounded-xl font-semibold tracking-wide disabled:opacity-50 focus-ring"
                  >
                    <Play size={18} /> {t.start}
                  </button>
                  <button 
                    onClick={() => handleAction('stop')}
                    disabled={status === 'stopped' || status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 btn-secondary py-3 rounded-xl font-semibold tracking-wide disabled:opacity-50 focus-ring"
                  >
                    <Power size={18} /> {t.stop}
                  </button>
                </div>
              </div>

              <div className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <img src="https://cyber.dabamos.de/88x31/winzip.gif" alt="zip" /> {t.setup}
                </h2>
                <button 
                  onClick={handleInstall}
                  disabled={installing}
                  className="w-full flex items-center justify-center gap-2 btn-secondary py-3 rounded-xl font-semibold tracking-wide disabled:opacity-50 focus-ring mb-3"
                >
                  <Settings size={18} className={installing ? 'animate-spin' : ''} /> 
                  {installing ? '...' : t.install}
                </button>
                <button className="w-full flex items-center justify-center gap-2 border border-brand/30 bg-brand/10 text-brand py-3 rounded-xl font-semibold tracking-wide hover:bg-brand/20 transition-colors focus-ring">
                  <RefreshCw size={18} /> {t.runUpd}
                </button>
              </div>
            </section>

            <section className="glass-panel p-6 flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <img src="https://cyber.dabamos.de/88x31/notepad.gif" alt="notepad" /> {t.cfg}
                </h3>
                {selectedFile && (
                  <button 
                    onClick={saveConfig}
                    disabled={savingConfig}
                    className="flex items-center gap-2 btn-primary px-4 py-2 rounded-lg text-sm font-medium focus-ring"
                  >
                    <Save size={16} /> {savingConfig ? t.svg : t.save}
                  </button>
                )}
              </div>
              <div className="flex flex-col md:flex-row gap-4 h-full overflow-hidden">
                <nav className="w-full md:w-1/3 bg-secondary rounded-xl border border-border overflow-y-auto">
                  <ul className="p-2 space-y-1">
                    {configFiles.map((file, i) => {
                      const isSelected = selectedFile?.name === file.name && selectedFile?.dirId === file.dirId;
                      return (
                        <li key={i}>
                          <button
                            onClick={() => loadConfig(file)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex flex-col focus-ring ${isSelected ? 'bg-brand/20 text-brand' : 'text-muted hover:bg-background hover:text-foreground'}`}
                          >
                            <span className="font-medium truncate">{file.name}</span>
                            <span className="text-[10px] opacity-60 truncate">{file.dirPath}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
                <div className="w-full md:w-2/3 bg-background rounded-xl border border-border p-4 flex flex-col">
                  {selectedFile ? (
                    <textarea
                      value={configContent}
                      onChange={(e) => setConfigContent(e.target.value)}
                      className="w-full h-full bg-transparent text-foreground font-mono text-sm resize-none focus-ring p-2 rounded"
                      spellCheck={false}
                    />
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted text-sm text-center">{t.sel}</div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Side Panel - Right Column */}
          <div className="col-span-1 space-y-6">
            
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <img src="https://cyber.dabamos.de/88x31/java.gif" alt="console" /> {t.cons}
              </h3>
              <div className="bg-black text-green-400 p-4 rounded-xl font-mono text-xs h-[200px] overflow-y-auto border border-border flex items-end">
                <span className="opacity-50">{t.consDesc}</span>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <img src="https://web.archive.org/web/20090829104037/http://geocities.com/Heartland/Acres/5850/cd.gif" alt="upload" /> {t.up}
              </h3>
              <p className="text-sm text-muted mb-4">{t.upDesc}</p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="sr-only" accept=".vpk,.smx,.cfg" id="file-upload" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-success/30 bg-success/5 hover:bg-success/10 text-success py-4 rounded-xl font-medium focus-ring"
              >
                <Upload size={20} /> {uploading ? t.upg : t.sel}
              </button>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <img src="https://cyber.dabamos.de/88x31/pgpi.gif" alt="admin" /> {t.usr}
              </h3>
              <button className="w-full btn-secondary py-3 rounded-xl font-semibold focus-ring text-sm">
                + {t.addU}
              </button>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <img src="https://cyber.dabamos.de/88x31/icq.gif" alt="icq" /> {t.disc}
              </h3>
              <input type="text" placeholder={t.discDesc} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus-ring mb-3 text-foreground" />
              <button className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-2 rounded-lg text-sm font-semibold focus-ring transition-colors">
                {t.saveD}
              </button>
            </div>

          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "40px", border: "5px inset #555", padding: "20px", background: "#000" }}>
          <p className="font-bold text-green-500 mb-2 font-mono text-xl">You are survivor number:</p>
          <div className="flex justify-center gap-1">
            {hits.toString().padStart(7, '0').split('').map((d, i) => (
              <span key={i} className="inline-block bg-[#111] text-[#0f0] font-mono text-4xl font-bold px-3 py-1 border-2 border-[#333]">
                {d}
              </span>
            ))}
          </div>
        </div>

      </main>
        </td></tr></tbody>
      </table>
    </div>
  );
}
