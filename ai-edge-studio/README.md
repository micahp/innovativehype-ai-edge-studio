# AI Edge Studio

Local AI workspace — chat with local LLMs, save conversations, generate media.

Built as a focused local AI studio inspired by LobeChat (chat UI + conversation history) and Open-Generative-AI (media generation).

## Features

1. **Chat with local LLMs** — Uses llama.cpp server with OpenAI-compatible API. Supports any GGUF model (Gemma, Llama, Mistral, etc.)
2. **Persistent conversations** — All chats saved to SQLite with full message history
3. **Media generation** — Generate images via HuggingFace Inference API (FLUX, Stable Diffusion, SDXL)

## Quick Start

### 1. Start llama.cpp server
```bash
# Download a model
curl -L -o models/gemma-2-2b-it-Q4_K_M.gguf \
  https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/resolve/main/gemma-2-2b-it-Q4_K_M.gguf

# Start server
llama-server -m models/gemma-2-2b-it-Q4_K_M.gguf --port 8080
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Install & run
```bash
npm install
npm run dev
```

Open http://localhost:3000

### For media generation
Set `HF_TOKEN` in `.env` to your HuggingFace token from https://huggingface.co/settings/tokens

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TailwindCSS, ReactMarkdown
- **Backend**: Next.js API Routes, Server-Sent Events (streaming)
- **Database**: SQLite (better-sqlite3) — conversations + messages
- **LLM**: llama.cpp server (OpenAI-compatible `/v1/chat/completions`)
- **Media**: HuggingFace Inference API (FLUX.1, SDXL, SD 3.5)

## Architecture

```
ai-edge-studio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts         # Streaming chat with local LLM
│   │   │   ├── conversations/route.ts # CRUD for conversations + messages
│   │   │   └── media/route.ts        # Image generation via HF API
│   │   ├── chat/page.tsx             # Main chat page
│   │   ├── conversations/page.tsx    # History browser
│   │   ├── media/page.tsx            # Media generation page
│   │   ├── layout.tsx                # Root layout with sidebar
│   │   └── page.tsx                  # Redirect to /chat
│   ├── components/
│   │   ├── ChatInterface.tsx         # Chat message list + input
│   │   ├── ConversationList.tsx      # Conversation list component
│   │   ├── MediaGenerator.tsx        # Image generation UI
│   │   └── Sidebar.tsx               # Navigation sidebar
│   └── lib/
│       ├── db.ts                     # SQLite connection + schema
│       ├── conversations.ts          # Conversation CRUD helpers
│       ├── llm.ts                    # llama.cpp streaming client
│       └── types.ts                  # TypeScript interfaces
├── data/                             # SQLite database (auto-created)
├── package.json
├── next.config.js
├── tailwind.config.ts
└── .env.example
```

## Reference Repos

- [LobeChat](https://github.com/lobehub/lobe-chat) (77K stars) — Chat UI with local LLM support
- [Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) (13K stars) — 200+ media models, image/video generation
