import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

interface AnalyzeRequestBody {
  imageBase64?: string;
  mimeType?: string;
  localAssetPath?: string;
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function resolveSafeLocalImage(assetPath: string): { buffer: Buffer; mimeType: string } {
  const normalized = path.posix.normalize(assetPath);
  const publicPrefix = '/assets/aistudio/';
  const srcPrefix = '/src/assets/images/';

  let diskPath: string | null = null;
  if (normalized.startsWith(publicPrefix)) {
    diskPath = path.join(__dirname, 'public', normalized);
  } else if (normalized.startsWith(srcPrefix)) {
    diskPath = path.join(__dirname, normalized);
  }

  if (!diskPath || !fs.existsSync(diskPath)) {
    throw new Error('Requested studio image file could not be located.');
  }

  const ext = path.extname(diskPath).toLowerCase();
  const mimeType =
    ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';

  return {
    buffer: fs.readFileSync(diskPath),
    mimeType,
  };
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '16mb' }));

  app.post('/api/analyze-tattoo', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as AnalyzeRequestBody;
      let base64Data = '';
      let mimeType = 'image/jpeg';

      if (body.localAssetPath) {
        const localFile = resolveSafeLocalImage(body.localAssetPath);
        base64Data = localFile.buffer.toString('base64');
        mimeType = localFile.mimeType;
      } else if (body.imageBase64 && body.mimeType) {
        const cleanMime = body.mimeType.toLowerCase();
        if (!ALLOWED_MIME_TYPES.has(cleanMime)) {
          res.status(400).json({
            error: 'Unsupported image format. Please upload a JPG, PNG, or WEBP image.',
          });
          return;
        }
        base64Data = body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
        mimeType = cleanMime === 'image/jpg' ? 'image/jpeg' : cleanMime;
      } else {
        res.status(400).json({
          error: 'An image file or valid studio asset path is required for Vision AI analysis.',
        });
        return;
      }

      if (!base64Data || base64Data.length < 32) {
        res.status(400).json({ error: 'Image data is empty or corrupted.' });
        return;
      }

      const ai = getGeminiClient();

      const promptText =
        'Analyze this tattoo or body piercing photograph for a luxury tattoo studio portfolio (T-REX TATTOOS & PIERCING). Identify the artistic style, subject matter, body placement, ink/jewelry details, and generate an editorial title, a concise 2-sentence studio caption, and 5 descriptive tags.';

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            { text: promptText },
          ],
        },
        config: {
          systemInstruction:
            'You are a senior tattoo curator and master piercing specialist at T-REX TATTOOS & PIERCING. Provide accurate, refined, domain-authentic artistic analysis. Never invent fake studio claims; describe only what is visible in the photograph.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'Evocative 3 to 5 word editorial title for the tattoo or piercing piece.',
              },
              style: {
                type: Type.STRING,
                description:
                  'Primary style category, e.g. Micro-Realism, Black & Grey, Fine Line, Neo-Traditional, Blackwork, or Body Piercing.',
              },
              placement: {
                type: Type.STRING,
                description: 'Detected anatomical placement (e.g., Inner Wrist, Forearm, Upper Back, Ear Helix & Lobe).',
              },
              caption: {
                type: Type.STRING,
                description:
                  'Two crisp editorial sentences describing the visual subject, shading/linework technique, and composition.',
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '4 to 6 concise descriptive tags (1-3 words each).',
              },
              inkPalette: {
                type: Type.STRING,
                description: 'Concise ink tone or jewelry material observation (e.g. Monochrome Black & Grey Wash).',
              },
              estimatedSession: {
                type: Type.STRING,
                description: 'Typical studio session estimate (e.g. 2 – 3 Hours or 20 Mins · Sterile Procedure).',
              },
            },
            required: [
              'title',
              'style',
              'placement',
              'caption',
              'tags',
              'inkPalette',
              'estimatedSession',
            ],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({
          error: 'Vision AI returned an empty response. Please try another photo.',
        });
        return;
      }

      const parsed = JSON.parse(rawText);
      res.json({ analysis: parsed });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected Vision AI analysis failure.';
      console.error('Vision AI analysis error:', message);
      const statusCode =
        message.includes('GEMINI_API_KEY') ? 500 : 502;
      res.status(statusCode).json({ error: message });
    }
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`T-REX TATTOOS & PIERCING server listening on http://localhost:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
