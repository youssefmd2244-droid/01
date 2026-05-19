import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Lazy initialization of Gemini
let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAI;
}

// Memory 'DB' for simulation
const generations: any[] = [];
const socialAccounts: any[] = [
  { id: '1', platform: 'tiktok', accountName: 'AlphaContent_AI', isConnected: true, followers: 12400, views: 85200, engagement: '8.4%', postsPerDay: 3, autoPost: true },
  { id: '2', platform: 'instagram', accountName: 'AlphaContent_Official', isConnected: true, followers: 4500, views: 12100, engagement: '12.1%', postsPerDay: 2, autoPost: true },
  { id: '3', platform: 'youtube', accountName: 'Alpha_Shorts', isConnected: true, followers: 980, views: 245000, engagement: '4.2%', postsPerDay: 1, autoPost: false }
];
const scheduledPosts: any[] = [];
const customApis: any[] = [
  { id: 'internal-1', name: 'Original 3D Engine', url: 'https://api.iconcodey.ai/v2', apiKey: 'sk-direct-****************', type: 'video', status: 'active' }
];

// API: Detailed platform list
const PLATFORM_CONFIGS = [
  { id: 'tiktok', name: 'TikTok', icon: '🎵', aspect: '9:16', peakTimes: ['10:00', '19:00', '22:00'] },
  { id: 'instagram', name: 'Instagram', icon: '📸', aspect: '9:16', peakTimes: ['07:00', '12:00', '17:00', '21:00'] },
  { id: 'facebook', name: 'Facebook', icon: '📘', aspect: '16:9', peakTimes: ['09:00', '13:00', '16:00'] },
  { id: 'youtube', name: 'YouTube', icon: '▶️', aspect: '16:9', peakTimes: ['14:00', '17:00', '20:00'] },
  { id: 'youtube-shorts', name: 'Shorts', icon: '🎬', aspect: '9:16', peakTimes: ['12:00', '17:00', '21:00'] },
  { id: 'x', name: 'X', icon: '𝕏', aspect: '16:9', peakTimes: ['08:00', '12:00', '17:00'] },
  { id: 'snapchat', name: 'Snapchat', icon: '👻', aspect: '9:16', peakTimes: ['10:00', '13:00', '20:00'] },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', aspect: '1:1', peakTimes: ['09:00', '14:00', '19:00'] },
  { id: 'telegram', name: 'Telegram', icon: '✈️', aspect: '1:1', peakTimes: ['10:00', '15:00', '21:00'] }
];

// API: Audit Content (Analyzing existing links)
app.post("/api/ai/audit", async (req, res) => {
  try {
    const { url } = req.body;
    const ai = getGenAI();
    
    // In a real production app, we would scrape or use platform APIs to get video metadata
    // Here we use Gemini to "simulate" looking at the content data based on valid provided URLs
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Audit this social media content link: "${url}". 
      Critique it for virality based on common patterns.
      Identify:
      1. Potential errors in hook (first 3 seconds).
      2. Quality of description and current hashtags.
      3. Retention killers (boring spots).
      4. Actionable fixes.
      Return as JSON with: { score, problems: [], improvements: [] }
      Output in Arabic as requested by user.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json({ success: true, report: JSON.parse(response.text || "{}") });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Daily Content Recommendation (Learning System)
app.get("/api/ai/daily-plan", async (req, res) => {
  // Simulator for systematic learning
  const plan = {
    date: new Date().toISOString().split('T')[0],
    strategy: "High Volume Diversification",
    targetPlatform: "TikTok",
    recommendedTimes: ["13:45", "18:20", "22:15"],
    suggestions: [
      { title: "The 3D AI Glitch", reason: "Similar styles got +40% retention last week", type: "3D Cartoon" },
      { title: "Behind the Scenes AI", reason: "High engagement on transparency content", type: "Cinematic" }
    ]
  };
  res.json({ success: true, plan });
});

// API: Custom API Management
app.get("/api/admin/apis", (req, res) => {
  res.json({ success: true, apis: customApis });
});

app.post("/api/admin/apis", (req, res) => {
  const { name, url, apiKey, type } = req.body;
  const newApi = {
    id: Math.random().toString(36).substring(7),
    name,
    url,
    apiKey,
    type,
    status: 'active'
  };
  customApis.push(newApi);
  res.json({ success: true, api: newApi });
});

app.delete("/api/admin/apis/:id", (req, res) => {
  const index = customApis.findIndex(x => x.id === req.params.id);
  if (index > -1) {
    customApis.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: "Not found" });
  }
});

// API: AI content strategy & analysis
app.post("/api/ai/strategy", async (req, res) => {
  try {
    const { niche, style } = req.body;
    const ai = getGenAI();
    
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Generate a viral content plan for the niche: "${niche}" with style: "${style}". 
      Return a JSON array of 5 unique video ideas. 
      Each item should have: title, prompt (for text-to-video), caption (viral hook), hashtags (array).
      Target audience: Social media users looking for high-retention content.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              prompt: { type: Type.STRING },
              caption: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "prompt", "caption", "hashtags"]
          }
        }
      }
    });

    res.json({ success: true, ideas: JSON.parse(response.text || "[]") });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Generate Content (Queuing simulation)
app.post("/api/ai/generate", async (req, res) => {
  try {
    const { prompt, type, model, aspectRatio, style } = req.body;
    
    // Simulate generation job
    const newGen = {
      id: Math.random().toString(36).substring(7),
      prompt,
      type,
      model,
      aspectRatio,
      style,
      status: 'queued',
      createdAt: Date.now(),
      progress: 0
    };
    
    generations.unshift(newGen);

    // Background "process" simulation
    setTimeout(() => {
      const g = generations.find(x => x.id === newGen.id);
      if (g) {
        g.status = 'generating';
        g.progress = 30;
      }
    }, 2000);

    setTimeout(() => {
      const g = generations.find(x => x.id === newGen.id);
      if (g) {
        g.status = 'done';
        g.progress = 100;
        // In a real app, this would be the actual output URL from SORA/KLING etc
        g.resultUrl = type === 'text-to-video' 
          ? 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' 
          : `https://picsum.photos/seed/${newGen.id}/1024/1024`;
      }
    }, 15000);

    res.json({ success: true, generation: newGen });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/ai/generations", (req, res) => {
  res.json({ success: true, generations });
});

// API: Social Media Mock
app.get("/api/social/accounts", (req, res) => {
  res.json({ success: true, accounts: socialAccounts });
});

app.post("/api/social/accounts", (req, res) => {
  const { platform, accountName } = req.body;
  const newAccount = {
    id: Math.random().toString(36).substring(7),
    platform,
    accountName,
    isConnected: true,
    postsPerDay: 10,
    autoPost: true
  };
  socialAccounts.push(newAccount);
  res.json({ success: true, account: newAccount });
});

app.post("/api/social/schedule", (req, res) => {
  const { generationId, platform, scheduledAt, caption, hashtags } = req.body;
  const newPost = {
    id: Math.random().toString(36).substring(7),
    generationId,
    platform,
    scheduledAt,
    caption,
    hashtags,
    status: 'scheduled'
  };
  scheduledPosts.push(newPost);
  res.json({ success: true, post: newPost });
});

app.get("/api/social/scheduled", (req, res) => {
  res.json({ success: true, scheduled: scheduledPosts });
});

// API: Viral Content Analysis (Hashtags, Hooks, Trend alignment)
app.post("/api/ai/viral-analysis", async (req, res) => {
  try {
    const { prompt, region = "Arabic" } = req.body;
    const ai = getGenAI();
    
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Perform a viral analysis for a video with this prompt: "${prompt}". 
      Target Region: ${region}.
      Provide:
      1. A viral "hook" for the first 3 seconds (in Arabic).
      2. 10 trending hashtags optimized for TikTok and Instagram Explore pages in the Middle East.
      3. An engagement-focused caption.
      Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            caption: { type: Type.STRING }
          },
          required: ["hook", "hashtags", "caption"]
        }
      }
    });

    res.json({ success: true, analysis: JSON.parse(response.text || "{}") });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: List Platforms & Optimal Times
app.get("/api/social/trends", (req, res) => {
  res.json({
    success: true,
    platforms: [
      { id: 'tiktok', peakHours: ['10:00', '19:00', '22:00'], trendingNiches: ['Tech', 'Comedy', 'Challenges'] },
      { id: 'instagram', peakHours: ['07:00', '12:00', '17:00', '21:00'], trendingNiches: ['Lifestyle', 'Travel', 'Art'] },
      { id: 'youtube', peakHours: ['14:00', '20:00'], trendingNiches: ['Edu', 'Reviews', 'Documentaries'] }
    ]
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
