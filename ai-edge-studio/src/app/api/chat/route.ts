import { NextRequest } from 'next/server';
import { addMessage, createConversation, getMessages } from '@/lib/conversations';
import { streamChat } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, message, config } = body;

    if (!message) {
      return Response.json({ error: 'message required' }, { status: 400 });
    }

    const cId = conversationId || createConversation().id;
    const llmConfig = config || {
      endpoint: process.env.LLM_ENDPOINT || 'http://localhost:8080',
      model: process.env.LLM_MODEL || 'gemma-2-2b-it',
      temperature: 0.7,
      max_tokens: 2048,
    };

    // Save user message
    addMessage(cId, 'user', message);

    // Auto-title from first message if untitled
    if (!conversationId) {
      const { updateConversationTitle } = await import('@/lib/conversations');
      const title = message.slice(0, 80) + (message.length > 80 ? '...' : '');
      updateConversationTitle(cId, title);
    }

    // Stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ conversationId: cId })}\n\n`)
          );

          for await (const chunk of streamChat(cId, message, llmConfig)) {
            fullResponse += chunk;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ token: chunk })}\n\n`)
            );
          }

          // Save assistant message
          addMessage(cId, 'assistant', fullResponse);

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err: any) {
          // Save partial response if any
          if (fullResponse) {
            addMessage(cId, 'assistant', fullResponse);
          }
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: err.message })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
