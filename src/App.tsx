import React, { useState, useEffect, useCallback } from 'react';
import { 
  Zap, Bot, Sparkles, Share2, Video, Image as ImageIcon, 
  BarChart3, Settings, Play, Check, Trash2, RotateCcw, 
  Plus, ExternalLink, Globe, Layout, Clock, Rocket,
  TrendingUp, RefreshCw, Send, Shield, Info, Gauge,
  X, ChevronDown, Wand2, Lightbulb, Workflow, MousePointer2,
  Lock, User, Menu, Download, Heart, Mic, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from './lib/utils';

// Constants
const VIDEO_MODELS = [
  { id: 'seedance-2.0', name: 'Seedance 2.0', speed: '~2 min', tag: 'High-Fidelity', color: 'neon-cyan' },
  { id: '3d-cartoon-gen-v1', name: '3D Cartoon Pro', speed: '~90s', tag: 'Stylized', color: 'neon-orange' },
  { id: 'kling-v3-pro', name: 'Kling V3 Pro', speed: '~2 min', tag: 'Cinematic', color: 'neon-magenta' },
  { id: 'sora-2', name: 'Sora 2 Pro', speed: '~3 min', tag: 'OpenAI', color: 'neon-purple' },
  { id: 'grok-vid-720', name: 'Grok Vid 720', speed: '~1 min', tag: 'Fast', color: 'neon-yellow' },
];

const IMAGE_MODELS = [
  { id: 'flux-pro', name: 'Flux Pro', speed: '~8s', tag: 'Best', color: 'neon-green' },
  { id: 'sdxl-turbo', name: 'SDXL Turbo', speed: '~3s', tag: 'Instant', color: 'neon-orange' },
];

const PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'youtube-shorts', name: 'YouTube Shorts', icon: '🎬' },
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
  { id: 'telegram', name: 'Telegram', icon: '✈️' },
  { id: 'x', name: 'X (Twitter)', icon: '𝕏' },
  { id: 'snapchat', name: 'Snapchat', icon: '👻' },
  { id: 'likee', name: 'Likee', icon: '🌟' },
  { id: 'kwai', name: 'Kwai', icon: '🟠' },
];

const NICHES = [
  "🤣 Comedy / Funny", "🤖 AI & Tech", "🎮 Gaming", "💰 Finance", "✈️ Travel", "🐱 Animals", "🍳 Cooking", "💪 Fitness", "📚 Education", "🏠 Home & DIY"
];

// Components
const GlassCard = ({ children, className, title, icon: Icon, color = "neon-cyan" }: any) => (
  <div className={cn("card-holographic rounded-2xl overflow-hidden border border-white/5", className)}>
    {title && (
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
        {Icon && <Icon className={cn("size-4", `text-${color}`)} />}
        <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">{title}</span>
        <div className="flex-1" />
        <div className={cn("w-1 h-1 rounded-full animate-pulse", `bg-${color}`)} />
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);

const Ra = ({ badge, badgeColor = "neon-cyan", title, subtitle }: any) => {
  const colorMap: Record<string, string> = {
    'neon-cyan': 'bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan',
    'neon-magenta': 'bg-neon-magenta/10 border-neon-magenta/20 text-neon-magenta',
    'neon-purple': 'bg-neon-purple/10 border-neon-purple/20 text-neon-purple',
    'neon-green': 'bg-neon-green/10 border-neon-green/20 text-neon-green',
    'neon-orange': 'bg-neon-orange/10 border-neon-orange/20 text-neon-orange',
    'neon-yellow': 'bg-neon-yellow/10 border-neon-yellow/20 text-neon-yellow',
  };
  
  return (
    <div className="text-center mb-16">
      <span className={cn(
        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-4",
        colorMap[badgeColor] || colorMap['neon-cyan']
      )}>
        {badge}
      </span>
      <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text text-center">{title}</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-center">{subtitle}</p>
    </div>
  );
};

const Navbar = ({ onViewChange, currentView }: any) => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('landing')}>
        <div className="size-8 hexagon bg-linear-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
          <Zap className="size-4 text-white" fill="white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm leading-none">ICON CODE Y</span>
          <span className="text-[8px] text-neon-cyan font-bold tracking-tighter">AI CONTENT FACTORY</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {currentView === 'landing' ? (
          <button 
            onClick={() => onViewChange('dashboard')}
            className="px-5 py-2 rounded-xl bg-neon-cyan text-background font-bold text-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
          >
            Launch Dashboard
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-neon-green">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              NEURAL CORE: ONLINE
            </div>
            <button onClick={() => onViewChange('landing')} className="text-sm text-muted-foreground hover:text-white transition-colors">
              Exit
            </button>
          </div>
        )}
      </div>
    </div>
  </nav>
);

const LandingPage = ({ onLaunch }: any) => (
  <div className="pt-32 pb-20 px-4 relative overflow-hidden">
    <div className="absolute inset-0 hex-bg pointer-events-none" />
    
    <div className="max-w-5xl mx-auto text-center relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-semibold mb-8"
      >
        <Sparkles className="size-3.5" />
        Next-Gen AI Content Factory
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
      >
        Automate Your <br />
        <span className="gradient-text">Viral Presence</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
      >
        Generate cinema-quality AI videos, write viral scripts, and auto-publish to 10+ social accounts. 100% autonomous content creation.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <button 
          onClick={onLaunch}
          className="w-full sm:w-auto px-10 h-14 rounded-2xl bg-linear-to-r from-neon-cyan to-neon-purple text-background font-bold text-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all shadow-xl"
        >
          Enter Control Center
        </button>
        <a href="#features" className="w-full sm:w-auto px-10 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold hover:bg-white/10 transition-all">
          Explore Features
        </a>
      </motion.div>
    </div>

      {/* Differences Section (Based on Arabic Text) */}
      <div className="max-w-5xl mx-auto mt-40">
        <Ra 
          badge="⚠️ مهم جداً قبل البدء" 
          badgeColor="neon-orange" 
          title="الفرق بين السيستم الأصلي والتقليد" 
          subtitle="اوعى تشتري سيستم AI Videos قبل ما تعرف أنت بتشتري من مين 👀"
        />
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-holographic p-8 rounded-3xl border border-neon-green/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <Check className="size-6 text-neon-green" />
            </div>
            <h3 className="text-2xl font-bold mb-6 text-neon-green">Digital Assets (النسخة الأصلية)</h3>
            <ul className="space-y-4 text-right" dir="rtl">
              <li className="flex items-start gap-3 justify-end text-sm text-foreground/90">
                <span>سيستم متحدث، متجهز، ومربوط بطريقة احترافية.</span>
                <div className="size-1.5 rounded-full bg-neon-green mt-2 shrink-0" />
              </li>
              <li className="flex items-start gap-3 justify-end text-sm text-foreground/90">
                <span>دعم فني حقيقي من ناس فاهمة Automation.</span>
                <div className="size-1.5 rounded-full bg-neon-green mt-2 shrink-0" />
              </li>
              <li className="flex items-start gap-3 justify-end text-sm text-foreground/90">
                <span>تحديثات وتطوير مستمر لضمان استمرارية التشغيل.</span>
                <div className="size-1.5 rounded-full bg-neon-green mt-2 shrink-0" />
              </li>
              <li className="flex items-start gap-3 justify-end text-sm text-foreground/90">
                <span>فيديو شرح خطوة بخطوة وحماية خاصة لجهازك فقط.</span>
                <div className="size-1.5 rounded-full bg-neon-green mt-2 shrink-0" />
              </li>
              <li className="flex items-start gap-3 justify-end text-sm text-foreground/90 font-bold">
                <span className="text-neon-green">تشغيل ومتابعة لحد ما السيستم يشتغل عندك بالفعل.</span>
                <div className="size-1.5 rounded-full bg-neon-green mt-2 shrink-0" />
              </li>
            </ul>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20">Verified Original</div>
              <div className="text-xs font-bold text-white/50">95% Discount Active</div>
            </div>
          </div>

          <div className="card-holographic p-8 rounded-3xl border border-red-500/10 grayscale opacity-70">
             <h3 className="text-2xl font-bold mb-6 text-red-400">النسخ غير الموثوقة (المقلدة)</h3>
             <ul className="space-y-4 text-right" dir="rtl">
              <li className="flex items-start gap-3 justify-end text-sm text-muted-foreground">
                <span>وعود ضخمة بالثراء دون دعم حقيقي.</span>
                <div className="size-1.0 rounded-full bg-red-400 mt-2 shrink-0" />
              </li>
              <li className="flex items-start gap-3 justify-end text-sm text-muted-foreground">
                <span>نسخ قديمة، غير مستقرة، أو متوقفة عن العمل.</span>
                <div className="size-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
              </li>
              <li className="flex items-start gap-3 justify-end text-sm text-muted-foreground">
                <span>وقت المشكلة تكتشف إن مفيش حد فاهم التقنية.</span>
                <div className="size-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-6" dir="rtl">
            لو كنت شايف إن ده ممكن يكون مناسب ليك… فأنت كده بالفعل عارف الخطوة الجاية 🔥
          </p>
          <button onClick={onLaunch} className="px-8 py-3 rounded-2xl bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan font-bold hover:bg-neon-cyan/30 transition-all">
            ابدأ الآن — التفاصيل كلها في الرابط بالأسفل
          </button>
        </div>
      </div>
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [prompt, setPrompt] = useState('');
  const [genType, setGenType] = useState('text-to-video');
  const [model, setModel] = useState('kling-v3-pro');
  const [niche, setNiche] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [customApis, setCustomApis] = useState<any[]>([]);
  const [showModelSelect, setShowModelSelect] = useState(false);

  // API management state
  const [newApiName, setNewApiName] = useState('');
  const [newApiUrl, setNewApiUrl] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [newApiType, setNewApiType] = useState<'video' | 'image'>('video');

  // Fetch initial data
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [gRes, aRes, apiRes] = await Promise.all([
        fetch('/api/ai/generations').then(r => r.json()),
        fetch('/api/social/accounts').then(r => r.json()),
        fetch('/api/admin/apis').then(r => r.json())
      ]);
      
      setGenerations(gRes.generations);
      setAccounts(aRes.accounts);
      setCustomApis(apiRes.apis || []);
    } catch (e) {
      console.error("Fetch error", e);
    }
  };

  const handleAddApi = async () => {
    if (!newApiName || !newApiUrl || !newApiKey) return;
    try {
      const res = await fetch('/api/admin/apis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newApiName, url: newApiUrl, apiKey: newApiKey, type: newApiType })
      });
      if (res.ok) {
        toast.success("API Endpoint added!");
        setNewApiName('');
        setNewApiUrl('');
        setNewApiKey('');
        fetchData();
      }
    } catch (e) {
      toast.error("Failed to add API");
    }
  };

  const handleDeleteApi = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/apis/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("API Endpoint removed");
        fetchData();
      }
    } catch (e) {
      toast.error("Failed to remove API");
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: genType, model })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Generation queued successfully!");
        setPrompt('');
      } else {
        toast.error("Failed to queue generation");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViralAnalysis = async () => {
    if (!prompt.trim()) return;
    toast.promise(fetch('/api/ai/viral-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    }).then(r => r.json()), {
      loading: 'Analyzing viral potential...',
      success: (data) => {
        const { analysis } = data;
        setPrompt(prev => `${prev}\n\n# Viral Hook: ${analysis.hook}\n# Tags: ${analysis.hashtags.join(' ')}`);
        return 'Analysis complete! Hook and tags added to prompt.';
      },
      error: 'Analysis failed.'
    });
  };

  const [strategyResults, setStrategyResults] = useState<any[]>([]);
  const [auditUrl, setAuditUrl] = useState('');
  const [auditReport, setAuditReport] = useState<any>(null);
  const [dailyPlan, setDailyPlan] = useState<any>(null);

  const handleAudit = async () => {
    if (!auditUrl) return;
    toast.promise(fetch('/api/ai/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: auditUrl })
    }).then(r => r.json()), {
      loading: '🔬 Running AI Content Audit...',
      success: (data) => {
        setAuditReport(data.report);
        return 'Audit complete! See insights below.';
      },
      error: 'Audit failed.'
    });
  };

  const fetchDailyPlan = async () => {
    const res = await fetch('/api/ai/daily-plan');
    const data = await res.json();
    if (data.success) setDailyPlan(data.plan);
  };

  const handleAutoPlan = async () => {
    if (!niche) return;
    toast.promise(fetch('/api/ai/strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ niche, style: 'Viral' })
    }).then(r => r.json()), {
      loading: 'Analyzing niche & generating concepts...',
      success: (data) => {
        setStrategyResults(data.ideas);
        return 'Viral hooks generated! Scroll down to see ideas.';
      },
      error: 'Strategy generation failed.'
    });
  };

  return (
    <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-6 min-h-screen">
      {/* Sidebar Nav */}
      <aside className="w-full md:w-60 shrink-0 space-y-2">
        {[
          { id: 'generate', label: 'Generator', icon: Sparkles, color: 'neon-cyan' },
          { id: 'auto', label: 'Auto Content', icon: Bot, color: 'neon-magenta' },
          { id: 'social', label: 'Accounts', icon: Share2, color: 'neon-purple' },
          { id: 'api-manager', label: 'API Manager', icon: Workflow, color: 'neon-yellow' },
          { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'neon-green' },
          { id: 'settings', label: 'Settings', icon: Settings, color: 'neon-orange' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all",
              activeTab === item.id 
                ? `bg-white/[0.06] text-white border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]` 
                : "text-muted-foreground hover:text-white hover:bg-white/[0.03]"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn("size-4", activeTab === item.id ? `text-${item.color}` : "text-muted-foreground")} />
              {item.label}
            </div>
            {activeTab === item.id && (
              <div className={cn("w-1.5 h-1.5 rounded-full", `bg-${item.color}`)} />
            )}
          </button>
        ))}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6">
        {activeTab === 'generate' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <GlassCard title="Generation Engine" icon={Wand2}>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setGenType('text-to-video')}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all",
                        genType === 'text-to-video' ? "bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan" : "bg-white/[0.02] border-white/5 text-muted-foreground hover:bg-white/[0.04]"
                      )}
                    >
                      <Video className="size-4" /> Text-to-Video
                    </button>
                    <button 
                      onClick={() => setGenType('text-to-image')}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all",
                        genType === 'text-to-image' ? "bg-neon-magenta/10 border-neon-magenta/40 text-neon-magenta" : "bg-white/[0.02] border-white/5 text-muted-foreground hover:bg-white/[0.04]"
                      )}
                    >
                      <ImageIcon className="size-4" /> Text-to-Image
                    </button>
                  </div>

                  <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">Select Model</label>
                    <button 
                      onClick={() => setShowModelSelect(!showModelSelect)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm font-medium hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Bot className="size-4 text-neon-cyan" />
                        <span>{model}</span>
                      </div>
                      <ChevronDown className="size-4 text-muted-foreground" />
                    </button>
                    <AnimatePresence>
                      {showModelSelect && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 right-0 z-20 mt-2 p-1 rounded-2xl bg-[#0a0a22] border border-white/10 shadow-2xl overflow-hidden"
                        >
                          {(genType === 'text-to-video' ? VIDEO_MODELS : IMAGE_MODELS).map(m => (
                            <button
                              key={m.id}
                              onClick={() => { setModel(m.id); setShowModelSelect(false); }}
                              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.05] transition-colors text-left"
                            >
                              <div>
                                <div className="text-xs font-bold text-white">{m.name}</div>
                                <div className="text-[10px] text-muted-foreground">{m.speed}</div>
                              </div>
                              <span className={cn("text-[8px] px-2 py-0.5 rounded-full bg-white/5", `text-${m.color}`)}>{m.tag}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block">Style / Vibe</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["Cinematic", "3D Cartoon", "Anime", "Photorealistic", "Cyberpunk", "Horror"].map(s => (
                        <button
                          key={s}
                          onClick={() => {
                            if (s === "3D Cartoon") {
                              setModel('3d-cartoon-gen-v1');
                              setGenType('text-to-video');
                            }
                            setPrompt(prev => prev.includes(s) ? prev : `${prev} [Style: ${s}]`.trim());
                          }}
                          className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground block">Prompt (Description)</label>
                      <button 
                        onClick={handleViralAnalysis}
                        disabled={!prompt.trim()}
                        className="text-[10px] font-bold text-neon-cyan hover:underline flex items-center gap-1"
                      >
                        <TrendingUp className="size-3" /> Viral Analysis
                      </button>
                    </div>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={genType === 'text-to-video' ? "A dragon breathing blue fire over a cyberpunk city landscape..." : "A realistic portrait of an astronaut on Mars..."}
                      className="w-full h-32 p-4 rounded-2xl bg-white/[0.02] border border-white/10 focus:border-neon-cyan/40 focus:ring-0 transition-colors text-sm resize-none"
                    />
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-neon-cyan to-neon-purple text-background font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all disabled:opacity-50"
                  >
                    {isGenerating ? <RefreshCw className="size-5 animate-spin" /> : <Rocket className="size-5" />}
                    Generate {genType === 'text-to-video' ? 'Video' : 'Image'}
                  </button>
                </div>
              </GlassCard>

              {/* Progress / History Grid */}
              <div className="grid grid-cols-2 gap-4">
                {generations.filter(g => g.status !== 'done').map(g => (
                  <GlassCard key={g.id} className="border-neon-cyan/20 bg-neon-cyan/[0.02]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                        <Activity className="size-4 text-neon-cyan animate-pulse" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-white uppercase truncate">{g.prompt}</div>
                        <div className="text-[8px] text-muted-foreground tracking-wider underline">ID: {g.id}</div>
                      </div>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${g.progress}%` }}
                        className="h-full bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]" 
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2 text-[10px]">
                      <span className="text-neon-cyan">{g.status}...</span>
                      <span className="text-muted-foreground">{g.progress}%</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <GlassCard title="Recent Gallery" icon={ImageIcon} color="neon-magenta">
                <div className="space-y-4">
                  {generations.filter(g => g.status === 'done').slice(0, 10).map(g => (
                    <div key={g.id} className="relative group rounded-xl overflow-hidden border border-white/5 aspect-video bg-black/40">
                      {g.type === 'text-to-video' ? (
                        <video src={g.resultUrl} className="w-full h-full object-cover" muted loop onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} />
                      ) : (
                        <img src={g.resultUrl} className="w-full h-full object-cover" loading="lazy" />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                        <p className="text-[10px] text-white line-clamp-1 mb-2">{g.prompt}</p>
                        <div className="flex gap-2">
                          <button className="flex-1 h-8 rounded-lg bg-neon-magenta text-white text-[10px] font-bold flex items-center justify-center gap-1">
                            <Send className="size-3" /> Publish
                          </button>
                          <button className="size-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-red-500/20 transition-colors">
                            <Trash2 className="size-3 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {generations.filter(g => g.status === 'done').length === 0 && (
                    <div className="py-10 text-center space-y-3">
                      <ImageIcon className="mx-auto size-8 text-white/10" />
                      <p className="text-xs text-muted-foreground">No outputs yet.</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {activeTab === 'auto' && (
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard title="Viral Strategy Brain" icon={Bot} color="neon-magenta">
              <div className="space-y-5">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter your niche and style, and our AI brain will research trending topics and generate a high-retention content plan.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {NICHES.map(n => (
                    <button 
                      key={n}
                      onClick={() => setNiche(n)}
                      className={cn(
                        "p-3 rounded-xl border text-[11px] font-medium transition-all text-left",
                        niche === n ? "bg-neon-magenta/10 border-neon-magenta/40 text-neon-magenta" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleAutoPlan}
                  className="w-full h-12 rounded-2xl bg-white text-background font-bold text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
                >
                  Generate Strategy Plan
                </button>

                {strategyResults.length > 0 && (
                  <div className="pt-4 space-y-3">
                    <div className="text-[10px] uppercase font-bold text-neon-magenta tracking-widest px-1">AI Generated Concepts</div>
                    {strategyResults.map((idea, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                        <div className="font-bold text-xs mb-1">{idea.title}</div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2">{idea.caption}</p>
                        <button 
                          onClick={() => { setPrompt(idea.prompt); setActiveTab('generate'); }}
                          className="w-full h-8 rounded-lg bg-neon-magenta/20 text-neon-magenta text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all"
                        >
                          Load Prompt
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>

            <div className="space-y-4">
              <GlassCard title="Live Viral Trends" icon={TrendingUp} color="neon-green">
                <div className="space-y-3">
                  {[
                    { tag: '#AIArt', growth: '+240%', desc: 'Hyper-realistic video transitions' },
                    { tag: '#FutureTech', growth: '+180%', desc: 'Spatial computing concept demos' },
                    { tag: '#CinematicAI', growth: '+95%', desc: 'Long-form narrations with Sora' },
                  ].map((trend, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div>
                        <div className="text-xs font-bold text-neon-green">{trend.tag}</div>
                        <div className="text-[10px] text-muted-foreground">{trend.desc}</div>
                      </div>
                      <div className="text-[10px] font-mono text-neon-green bg-neon-green/5 px-2 py-1 rounded-lg">{trend.growth}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
              
              <GlassCard title="Golden Posting Times" icon={Clock} color="neon-yellow">
                <div className="grid grid-cols-7 gap-1">
                  {['M','T','W','T','F','S','S'].map((day, i) => (
                    <div key={i} className="space-y-1">
                      <div className="text-[8px] text-center opacity-40">{day}</div>
                      <div className={cn("h-8 rounded-[4px] bg-neon-yellow/10 border border-white/5", i % 2 === 0 && "bg-neon-yellow/40 border-neon-yellow/20")} />
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>9:00 AM — Peak Reach</span>
                  <button className="text-neon-yellow hover:underline flex items-center gap-1">
                    Apply to Schedule <ExternalLink className="size-2.5" />
                  </button>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
             <div className="grid md:grid-cols-3 gap-4">
                <GlassCard title="Total Audience" icon={User} color="neon-cyan" className="bg-neon-cyan/[0.02]">
                    <div className="text-2xl font-bold">17,880</div>
                    <div className="text-[10px] text-neon-green font-bold">+12% this week</div>
                </GlassCard>
                <GlassCard title="Global Reach" icon={Globe} color="neon-purple" className="bg-neon-purple/[0.02]">
                    <div className="text-2xl font-bold">342.3K</div>
                    <div className="text-[10px] text-neon-purple font-bold">Impressions</div>
                </GlassCard>
                <GlassCard title="AI Content Score" icon={Gauge} color="neon-green" className="bg-neon-green/[0.02]">
                    <div className="text-2xl font-bold">92/100</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Viral Probability</div>
                </GlassCard>
             </div>

            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard title="Connected Platforms (100% Active)" icon={Share2} color="neon-purple">
                <div className="space-y-4">
                  {accounts.map(acc => (
                    <div key={acc.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 group hover:border-neon-purple/40 transition-all">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                          {PLATFORMS.find(p => p.id === acc.platform)?.icon || '📱'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold truncate">{acc.accountName}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">{acc.platform} • Stable</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-white">{acc.followers?.toLocaleString() || '0'}</div>
                            <div className="text-[8px] text-muted-foreground uppercase tracking-widest">Followers</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-white/5 rounded-lg p-2 text-center">
                            <div className="text-[10px] font-bold text-white">{acc.views?.toLocaleString() || '0'}</div>
                            <div className="text-[8px] text-muted-foreground uppercase">Views</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 text-center">
                            <div className="text-[10px] font-bold text-white">{acc.engagement || '0%'}</div>
                            <div className="text-[8px] text-muted-foreground uppercase">Engagement</div>
                        </div>
                      </div>

                      {acc.platform === 'tiktok' && (
                        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-red-400 mb-1">
                                <Info className="size-3" /> Performance Alert
                            </div>
                            <p className="text-[9px] text-red-400/80 leading-relaxed">Weak description detected on last 3 videos. Engagement dropping by 4%. Update hashtags immediately.</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                         <div className="flex gap-1">
                            <div className="size-1.5 rounded-full bg-neon-green" />
                            <div className="size-1.5 rounded-full bg-neon-green" />
                            <div className="size-3 h-1.5 rounded-full bg-white/10" />
                         </div>
                         <button className="text-[10px] font-bold text-neon-purple hover:underline">Strategic Adjustments</button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-4 rounded-2xl border border-dashed border-white/10 text-muted-foreground text-xs font-bold hover:bg-neon-purple/10 hover:text-white transition-all flex items-center justify-center gap-2">
                    <Plus className="size-4" /> Connect Other Platform
                  </button>
                </div>
              </GlassCard>

              <div className="space-y-6">
                <GlassCard title="AI Content Auditor (Real-time)" icon={Shield} color="neon-green">
                    <div className="space-y-4">
                        <p className="text-[10px] text-muted-foreground leading-relaxed">Paste any video or account link (TikTok, IG, YT) to analyze why it's not going viral and how to fix it.</p>
                        <div className="flex gap-2">
                            <input 
                                value={auditUrl}
                                onChange={(e) => setAuditUrl(e.target.value)}
                                placeholder="https://tiktok.com/@user/video/..." 
                                className="flex-1 h-10 px-4 rounded-xl bg-background border border-white/10 text-xs text-white" 
                            />
                            <button 
                                onClick={handleAudit}
                                className="px-4 h-10 rounded-xl bg-neon-green text-background font-bold text-xs hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all"
                            >
                                Audit
                            </button>
                        </div>

                        {auditReport && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-bold">Virality Score</div>
                                    <div className={cn("text-lg font-bold", auditReport.score > 70 ? "text-neon-green" : "text-neon-orange")}>
                                        {auditReport.score}/100
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="text-[9px] uppercase font-bold text-red-400">Critical Problems</div>
                                    {auditReport.problems.map((p: string, i: number) => (
                                        <div key={i} className="text-[10px] text-muted-foreground flex items-center gap-2">
                                            <X className="size-3 text-red-500" /> {p}
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[9px] uppercase font-bold text-neon-green">AI Improvements</div>
                                    {auditReport.improvements.map((imp: string, i: number) => (
                                        <div key={i} className="text-[10px] text-muted-foreground flex items-center gap-2">
                                            <Check className="size-3 text-neon-green" /> {imp}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </GlassCard>

                <GlassCard title="Auto Viral Publishing Pipeline" icon={Workflow} color="neon-cyan">
                    <div className="space-y-4">
                        {[
                            { label: 'Multi-Format Export', desc: 'Auto-resizing for TikTok(9:16) & FB(16:9)', active: true },
                            { label: 'Smart Hook Injection', desc: 'AI modifies first 3s based on platform trend', active: true },
                            { label: 'Peak Engagement Hub', desc: 'Syncs posting across 11+ platforms at once', active: true },
                        ].map(feat => (
                            <div key={feat.label} className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold">{feat.label}</div>
                                    <div className="text-[10px] text-muted-foreground">{feat.desc}</div>
                                </div>
                                <div className="size-4 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                                    <Check className="size-2.5 text-neon-cyan" />
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api-manager' && (
          <div className="space-y-6">
            <GlassCard title="Model API & Endpoint Manager" icon={Workflow} color="neon-yellow">
              <div className="space-y-6">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Add your own API endpoints and keys to swap logic. You can connect local GPUs via Gradio/FastAPI or third-party providers like Kling, Runway, or SORA directly.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block font-bold">API Name</label>
                      <input 
                        value={newApiName} 
                        onChange={(e) => setNewApiName(e.target.value)}
                        placeholder="e.g. Local RTX 4090 Worker" 
                        className="w-full h-10 px-4 rounded-xl bg-background border border-white/10 text-xs text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block font-bold">Endpoint URL</label>
                      <input 
                        value={newApiUrl} 
                        onChange={(e) => setNewApiUrl(e.target.value)}
                        placeholder="https://api.yourdomain.com/v1" 
                        className="w-full h-10 px-4 rounded-xl bg-background border border-white/10 text-xs text-white" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block font-bold">Secret Key</label>
                      <input 
                        type="password"
                        value={newApiKey} 
                        onChange={(e) => setNewApiKey(e.target.value)}
                        placeholder="sk-****************" 
                        className="w-full h-10 px-4 rounded-xl bg-background border border-white/10 text-xs text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block font-bold">Pipeline Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setNewApiType('video')}
                          className={cn("h-10 rounded-xl border text-[10px] font-bold uppercase transition-all", newApiType === 'video' ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "bg-background border-white/10 text-muted-foreground")}
                        >
                          Video
                        </button>
                        <button 
                          onClick={() => setNewApiType('image')}
                          className={cn("h-10 rounded-xl border text-[10px] font-bold uppercase transition-all", newApiType === 'image' ? "bg-neon-magenta/20 border-neon-magenta text-neon-magenta" : "bg-background border-white/10 text-muted-foreground")}
                        >
                          Image
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 pt-2">
                    <button 
                      onClick={handleAddApi}
                      className="w-full h-11 rounded-xl bg-neon-yellow text-background font-bold text-xs hover:shadow-[0_0_20px_rgba(255,230,0,0.3)] transition-all"
                    >
                      Connect Model Endpoint
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">Active Endpoints</div>
                  {customApis.map(api => (
                    <div key={api.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all">
                      <div className={cn("size-10 rounded-xl bg-white/5 flex items-center justify-center", api.type === 'video' ? 'text-neon-cyan' : 'text-neon-magenta')}>
                        {api.type === 'video' ? <Video className="size-5" /> : <ImageIcon className="size-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate">{api.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{api.url}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-bold text-neon-green uppercase">Stable Connection</span>
                            <span className="text-[8px] text-muted-foreground font-mono">LATENCY: 42ms</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteApi(api.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
            
            <div className="grid md:grid-cols-2 gap-4">
               <GlassCard title="Security & Hosting" icon={Shield} color="neon-green">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    All API keys are encrypted at rest and never exposed to the client. The system operates locally on your machine or private cloud, restricted to your unique device ID as specified by Digital Assets protection.
                  </p>
               </GlassCard>
               <GlassCard title="Load Balancing" icon={Gauge} color="neon-cyan">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Automatic failover between models. If one endpoint fails, the factory automatically re-queues the generation with the next best available model in your stack.
                  </p>
               </GlassCard>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                <GlassCard title="AI Adaptive Learning: Daily Plan" icon={Bot} color="neon-magenta" className="bg-neon-magenta/[0.02]">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-xs font-bold text-neon-magenta">Strategy: High Volume Divergence</div>
                            <button onClick={fetchDailyPlan} className="text-[10px] bg-white/5 px-2 py-1 rounded-lg hover:bg-white/10 transition-all flex items-center gap-1">
                                <RefreshCw className="size-2.5" /> Refresh Plan
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {['13:45', '18:20', '22:15'].map(t => (
                                <div key={t} className="p-2 border border-white/10 rounded-xl bg-background text-center">
                                    <div className="text-xs font-bold">{t}</div>
                                    <div className="text-[8px] text-muted-foreground uppercase leading-none">Peak</div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                             <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-[10px] font-bold text-white flex items-center justify-between">
                                    <span>The 3D AI Glitch</span>
                                    <span className="text-neon-green text-[8px] uppercase">+40% Retention</span>
                                </div>
                                <p className="text-[9px] text-muted-foreground">Similar styles performed exceptionally well in your tech niche last week.</p>
                             </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard title="Platform Dominance" icon={Layout} color="neon-cyan">
                    <div className="space-y-4">
                        {[
                            { p: 'TikTok', reach: 85, color: 'neon-cyan' },
                            { p: 'YT Shorts', reach: 62, color: 'neon-magenta' },
                            { p: 'Instagram', reach: 45, color: 'neon-purple' },
                        ].map(stat => (
                            <div key={stat.p} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold uppercase">
                                    <span>{stat.p}</span>
                                    <span>{stat.reach}% Reach</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={cn("h-full", `bg-${stat.color}`)} style={{ width: `${stat.reach}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            <GlassCard title="Performance Intelligence" icon={BarChart3} color="neon-green">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Mon', views: 4000, reach: 2400 },
                    { name: 'Tue', views: 3000, reach: 1398 },
                    { name: 'Wed', views: 2000, reach: 9800 },
                    { name: 'Thu', views: 2780, reach: 3908 },
                    { name: 'Fri', views: 1890, reach: 4800 },
                    { name: 'Sat', views: 2390, reach: 3800 },
                    { name: 'Sun', views: 3490, reach: 4300 },
                  ]}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6e70a0' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6e70a0' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="reach" stroke="#7b2fff" fillOpacity={1} fill="rgba(123, 47, 255, 0.05)" />
                    <Area type="monotone" dataKey="views" stroke="#00f0ff" fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Avg Viral Score', value: '8.4/10', color: 'text-neon-cyan' },
                    { label: 'Follower Gain', value: '+14.2k', color: 'text-neon-magenta' },
                    { label: 'Engagement Rate', value: '18.4%', color: 'text-neon-green' },
                    { label: 'Watch Completion', value: '42%', color: 'text-neon-yellow' },
                ].map((stat, i) => (
                    <GlassCard key={i} className="text-center py-6">
                        <div className={cn("text-2xl font-bold mb-1", stat.color)}>{stat.value}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{stat.label}</div>
                    </GlassCard>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <GlassCard title="External API Configuration" icon={Settings} color="neon-orange">
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground mb-4">
                  Add your own API keys to swap internal logic with local Gradio servers or custom endpoints.
                </p>
                <div className="space-y-4">
                  {[
                    { name: 'Kling AI Endpoint', val: 'https://api.kling.ai', status: 'connected' },
                    { name: 'Local Diffusion Worker', val: 'http://localhost:7860', status: 'connected' },
                    { name: 'Grok xAI Key', val: 'xai_********************', status: 'connected' },
                    { name: 'TikTok Session ID', val: 'session_********************', status: 'not_configured' },
                  ].map((api, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[11px] font-bold text-white/70">{api.name}</span>
                        <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full uppercase", api.status === 'connected' ? "bg-neon-green/10 text-neon-green" : "bg-white/5 text-muted-foreground")}>
                            {api.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input 
                            readOnly 
                            value={api.val} 
                            className="flex-1 h-10 px-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-muted-foreground outline-none" 
                        />
                        <button className="h-10 px-4 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] transition-all text-xs font-bold">
                            Update
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-neon-cyan/5 border border-neon-cyan/10">
                        <Info className="size-4 text-neon-cyan" />
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                            <span className="text-neon-cyan font-bold">Pro Tip:</span> To run locally, configure your .env file with your GPU worker endpoints. This allows for zero-cost generation.
                        </p>
                    </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <div className="min-h-screen bg-background">
      <Navbar onViewChange={setView} currentView={view} />
      
      <main className="relative">
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage onLaunch={() => setView('dashboard')} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-12 px-4 bg-[#0a0a1a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <div className="size-6 hexagon bg-linear-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                    <Zap className="size-3 text-white" fill="white" />
                </div>
                <span className="font-bold text-sm tracking-tight text-white">Icon Code Y</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs">
              Next-Gen AI Content Factory & Multi-Channel Social Automation Ecosystem.
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1 font-medium underline">Developed by</p>
            <p className="text-sm font-bold text-white">Eng. Youssef Mohamed El-Sayed</p>
            <p className="text-[10px] text-muted-foreground mt-1">+20 109 455 5299</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors"><Globe className="size-4" /></a>
            <a href="#" className="text-muted-foreground hover:text-neon-magenta transition-colors"><Shield className="size-4" /></a>
            <a href="#" className="text-muted-foreground hover:text-neon-green transition-colors"><Info className="size-4" /></a>
          </div>
        </div>
        <div className="text-center mt-12 text-[10px] text-muted-foreground border-t border-white/5 pt-8">
          © {new Date().getFullYear()} Icon Code Y — 100% Functional AI Orchestrator
        </div>
      </footer>

      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: 'rgba(10, 10, 34, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#e8eaff',
          backdropFilter: 'blur(12px)',
        }
      }} />
    </div>
  );
}
