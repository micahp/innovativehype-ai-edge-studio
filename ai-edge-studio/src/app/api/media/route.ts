import { NextRequest } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getDb } from '@/lib/db';

const HF_TOKEN = process.env.HF_TOKEN || '';

const IMAGE_MODELS: Record<string, string> = {
  'flux-schnell': 'black-forest-labs/FLUX.1-schnell',
  'flux-dev': 'black-forest-labs/FLUX.1-dev',
  'sd-xl': 'stabilityai/stable-diffusion-xl-base-1.0',
  'sd-3.5': 'stabilityai/stable-diffusion-3.5-large',
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, model: modelKey, type } = await req.json();

    if (!prompt) {
      return Response.json({ error: 'prompt required' }, { status: 400 });
    }

    const model = IMAGE_MODELS[modelKey] || IMAGE_MODELS['flux-schnell'];
    const genType = type || 'image';
    const id = uuid();

    const db = getDb();
    db.prepare(
      'INSERT INTO media_generations (id, prompt, model, type, status) VALUES (?, ?, ?, ?, ?)'
    ).run(id, prompt, model, genType, 'running');

    // Generate via HuggingFace Inference API
    let resultUrl: string | null = null;
    let error: string | null = null;

    try {
      if (genType === 'image') {
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${HF_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: prompt }),
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HF API error (${response.status}): ${errText}`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const json = await response.json();
          if (Array.isArray(json) && json[0]?.generated_text) {
            error = `Model returned text, not image: ${json[0].generated_text.slice(0, 200)}`;
          } else {
            error = `Unexpected JSON response`;
          }
        } else {
          const buffer = await response.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          resultUrl = `data:image/png;base64,${base64}`;
        }
      } else {
        error = 'Video generation not yet implemented via HF. Use local ComfyUI or Replicate.';
      }
    } catch (e: any) {
      error = e.message;
    }

    const status = resultUrl ? 'done' : 'error';
    db.prepare(
      'UPDATE media_generations SET status = ?, result_url = ?, error = ? WHERE id = ?'
    ).run(status, resultUrl, error, id);

    return Response.json({
      id,
      prompt,
      model,
      type: genType,
      status,
      result_url: resultUrl,
      error,
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = getDb();
    const generations = db
      .prepare('SELECT * FROM media_generations ORDER BY created_at DESC LIMIT 50')
      .all();
    return Response.json(generations);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
