import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

/*
This endpoint takes text and uses google gemini to create falshcards based on the text

Returns a list of falshcards
*/
export async function POST(request: NextRequest) {
  const apiKey = process.env.GEN_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing GEN_AI_API_KEY' }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey });
  const form = await request.formData();
  const text = form.get('text');

  // Check that a valid string is passed to the endpoint
  if (typeof text !== 'string' || !text.trim()) {
    return NextResponse.json(
      { error: 'Please include valid text.' },
      { status: 400 }
    );
  }

  // Build the prompt to ask for correct format and provide text
  const prompt = `
Return ONLY a JSON array like:
[{ "question": "…", "answer": "…" }]

Be sure to only include the most important topics.
Act as a UGA student in your selection.

Text:
${text}
  `;

  // Call the AI with the prompt
  let aiResponse;
  try {
    aiResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [prompt],
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'AI service error', details: (err as Error).message },
      { status: 502 }
    );
  }

  // Parse JSON and format
  const raw = aiResponse.text || '';
  const jsonText = raw.replace(/^```(?:json)?\s*/, '').replace(/```$/, '').trim();

  let flashcards: { question: string; answer: string }[];
  try {
    flashcards = JSON.parse(jsonText);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to parse JSON from AI response.', raw },
      { status: 502 }
    );
  }

  return NextResponse.json({ flashcards });
}
