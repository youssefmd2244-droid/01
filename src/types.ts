export type GenerationStatus = 'queued' | 'generating' | 'done' | 'failed';

export interface Generation {
  id: string;
  prompt: string;
  type: 'text-to-video' | 'text-to-image';
  model: string;
  aspectRatio?: string;
  style?: string;
  status: GenerationStatus;
  progress: number;
  createdAt: number;
  resultUrl?: string;
  error?: string;
}

export interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
  isConnected: boolean;
  postsPerDay: number;
  autoPost: boolean;
  profileUrl?: string;
  followers?: number;
  views?: number;
  engagement?: string;
  alerts?: string[];
}

export interface AuditReport {
  score: number;
  problems: string[];
  improvements: string[];
}

export interface DailyPlan {
  date: string;
  strategy: string;
  targetPlatform: string;
  recommendedTimes: string[];
  suggestions: {
    title: string;
    reason: string;
    type: string;
  }[];
}

export interface ScheduledPost {
  id: string;
  generationId: string;
  platform: string;
  scheduledAt: number;
  caption: string;
  hashtags: string[];
  status: 'scheduled' | 'posted' | 'failed';
  mediaUrl?: string;
}

export interface AIStrategyResult {
  title: string;
  prompt: string;
  caption: string;
  hashtags: string[];
}

export interface CustomAPI {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  type: 'video' | 'image';
  status: 'active' | 'error';
}
