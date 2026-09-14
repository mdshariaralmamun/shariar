import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import type { ChatCompletionChunk } from 'openai/resources';
import type { Stream } from 'openai/streaming';

// Google AI Studio (Gemini)
export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// OpenRouter (Free models)
export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
    'X-Title': 'Portfolio AI Assistant',
  },
});

// Free models available on OpenRouter
export const FREE_MODELS = {
  // NVIDIA Nemotron
  nemotron: 'nvidia/nemotron-3-ultra-550b-a55b:free',

  // Google Gemma
  gemma4_31b: 'google/gemma-4-31b:free',
  gemma4_26b: 'google/gemma-4-26b-a4b:free',

  // Liquid AI
  lfm2_5_2_6b: 'liquid/lfm2.5-2.6b:free',

  // Nex AGI
  nex_n2_5_pro: 'nex-agi/nex-n2.5-pro:free',
  nex_n2_5_mini: 'nex-agi/nex-n2.5-mini:free',

  // Router (auto-selects free model)
  free_router: 'openrouter/free',
} as const;

export type FreeModel = (typeof FREE_MODELS)[keyof typeof FREE_MODELS];

// Chat with AI
export async function chatWithAI(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  options?: {
    model?: FreeModel;
    temperature?: number;
    maxTokens?: number;
    stream?: false;
  }
): Promise<string>;
export async function chatWithAI(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  options: {
    model?: FreeModel;
    temperature?: number;
    maxTokens?: number;
    stream: true;
  }
): Promise<Stream<ChatCompletionChunk>>;
export async function chatWithAI(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  options: {
    model?: FreeModel;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  } = {}
): Promise<string | Stream<ChatCompletionChunk>> {
  const {
    model = FREE_MODELS.nemotron,
    temperature = 0.7,
    maxTokens = 2048,
    stream = false,
  } = options;

  try {
    if (stream) {
      const streamCompletion = await openrouter.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });
      return streamCompletion;
    }

    const completion = await openrouter.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('AI Chat Error:', error);
    throw new Error('Failed to get AI response');
  }
}

// Generate portfolio content with AI
export async function generateProjectDescription(
  projectTitle: string,
  category: string,
  keyPoints: string[]
): Promise<string> {
  const prompt = `Write a compelling project description for a portfolio website.

Project: ${projectTitle}
Category: ${category}
Key Points:
${keyPoints.map((p) => `- ${p}`).join('\n')}

Write a professional, technical description (150-300 words) suitable for a gas piping design engineer specializing in laboratories and semiconductor sector. Highlight:
- Technical complexity
- Industry standards compliance (ASME B31.3, SEMI, etc.)
- Problem-solving approach
- Results achieved

Tone: Professional, authoritative, yet accessible.`;

  return chatWithAI([
    { role: 'system', content: 'You are an expert technical writer for engineering portfolios.' },
    { role: 'user', content: prompt },
  ], { temperature: 0.5, maxTokens: 1000 });
}

// Generate blog post from project
export async function generateBlogPost(
  projectTitle: string,
  projectDescription: string,
  category: string
): Promise<{ title: string; excerpt: string; content: string; tags: string[] }> {
  const prompt = `Create a technical blog post based on this portfolio project.

Project: ${projectTitle}
Description: ${projectDescription}
Category: ${category}

Generate:
1. An engaging title (SEO-friendly)
2. A compelling excerpt (150-200 chars)
3. Full blog content (800-1500 words) with sections:
   - Introduction
   - Technical Challenges
   - Solution Approach
   - Implementation Details
   - Results & Lessons Learned
4. 5-8 relevant tags

Format as JSON with keys: title, excerpt, content, tags`;

  const response = await chatWithAI([
    { role: 'system', content: 'You are a technical blog writer for engineering professionals. Always respond with valid JSON.' },
    { role: 'user', content: prompt },
  ], { temperature: 0.6, maxTokens: 3000 });

  try {
    return JSON.parse(response);
  } catch {
    // Fallback if JSON parsing fails
    return {
      title: projectTitle,
      excerpt: truncate(projectDescription, 200),
      content: projectDescription,
      tags: [category, 'engineering', 'portfolio'],
    };
  }
}

// AI Chat Assistant for portfolio visitors
export async function portfolioChatAssistant(
  userMessage: string,
  context: {
    userName?: string;
    userRole?: string;
    currentPage?: string;
    portfolioData?: any;
  } = {}
): Promise<string> {
  const systemPrompt = `You are an AI assistant for ${context.portfolioData?.siteName || 'Shariar'} - a gas piping design engineer's portfolio website.

About the portfolio owner:
- Name: ${context.portfolioData?.ownerName || 'Mohammed Mamun'}
- Role: Gas Piping Design Engineer
- Specialization: Laboratories & Semiconductor sector
- Expertise: Design coordination, Research laboratory equipment assessment
- Domain: UHP gas systems, cleanroom design, equipment validation

Current context:
- Visitor page: ${context.currentPage || 'unknown'}
- Visitor name: ${context.userName || 'Guest'}

Guidelines:
- Be helpful, professional, and knowledgeable about gas piping, cleanrooms, semiconductor manufacturing
- Answer questions about projects, expertise, services
- Can discuss: ASME B31.3, SEMI standards, UHP gas delivery, cleanroom classifications, equipment qualification (IQ/OQ/PQ)
- If asked about hiring/contact, direct to contact form or LinkedIn
- Keep responses concise but informative
- Use technical terminology appropriately`;

  return chatWithAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ], { model: FREE_MODELS.nemotron, temperature: 0.7, maxTokens: 1500 });
}

// Import truncate from utils
function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}