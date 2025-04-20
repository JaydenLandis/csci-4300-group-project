import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { handleFlashcards } from '../../../../services/flashcards';

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEN_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing GEN_AI_API_KEY' }, { status: 500 });
  }
  const ai = new GoogleGenAI({ apiKey });

  // Parse as form-data 
  const form = await request.formData();
  const setId = form.get('setId');
  const text = form.get('text');

  if (typeof setId !== 'string' || !setId.trim()) {
    return NextResponse.json(
      { error: 'Please include setId' },
      { status: 400 }
    );
  }
  if (typeof text !== 'string' || !text.trim()) {
    return NextResponse.json(
      { setId, error: 'Please include valid text.' },
      { status: 400 }
    );
  }
  // generate & save flashcards
  return handleFlashcards(ai, setId, text.trim());
}