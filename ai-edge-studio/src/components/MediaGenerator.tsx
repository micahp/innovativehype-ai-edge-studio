'use client';

import { useState } from 'react';

interface Generation {
  id: string;
  prompt: string;
  model: string;
  type: string;
  status: string;
  result_url: string | null;
  error: string | null;
  created_at: string;
}

export default function MediaGenerator() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('flux-schnell');
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [error, setError] = useState('');

  const models = [
    { key: 'flux-schnell', label: 'FLUX.1 Schnell (fast)' },
    { key: 'flux-dev', label: 'FLUX.1 Dev (quality)' },
    { key: 'sd-xl', label: 'Stable Diffusion XL' },
    { key: 'sd-3.5', label: 'Stable Diffusion 3.5' },
  ];

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), model }),
      });

      const data = await res.json();

      if (data.error && !data.result_url) {
        setError(data.error);
      }

      setGenerations((prev) => [data, ...prev]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setGenerations(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Media Generation</h2>
          <p className="text-gray-400">
            Generate images using HuggingFace models. Set <code className="text-studio-400">HF_TOKEN</code> for access.
          </p>
        </div>

        {/* Generator */}
        <div className="card mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="input-field"
              >
                {models.map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={generate} disabled={loading || !prompt.trim()} className="btn-primary">
                {loading ? 'Generating...' : 'Generate Image'}
              </button>
              <button
                onClick={loadHistory}
                className="px-4 py-2 rounded-lg border border-studio-700 text-gray-300 hover:bg-studio-900 transition-colors"
              >
                Load History
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          {generations.map((gen) => (
            <div key={gen.id} className="card">
              {gen.status === 'done' && gen.result_url ? (
                <img
                  src={gen.result_url}
                  alt={gen.prompt}
                  className="w-full rounded-lg mb-3"
                />
              ) : gen.status === 'error' ? (
                <div className="aspect-square bg-red-900/20 rounded-lg mb-3 flex items-center justify-center text-red-400 text-sm p-4">
                  {gen.error || 'Generation failed'}
                </div>
              ) : (
                <div className="aspect-square bg-studio-900 rounded-lg mb-3 flex items-center justify-center">
                  <div className="typing-dot" />
                  <div className="typing-dot mx-1" />
                  <div className="typing-dot" />
                </div>
              )}
              <p className="text-sm text-gray-300 line-clamp-2">{gen.prompt}</p>
              <p className="text-xs text-gray-500 mt-1">{gen.model.split('/').pop()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
