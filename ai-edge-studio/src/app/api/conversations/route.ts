import { NextRequest } from 'next/server';
import {
  listConversations,
  getConversation,
  getMessages,
  deleteConversation,
  updateConversationTitle,
} from '@/lib/conversations';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const conv = getConversation(id);
      if (!conv) return Response.json({ error: 'Not found' }, { status: 404 });
      const messages = getMessages(id);
      return Response.json({ ...conv, messages });
    }

    const conversations = listConversations();
    return Response.json(conversations);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, title } = await req.json();
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });
    updateConversationTitle(id, title);
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });
    deleteConversation(id);
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
