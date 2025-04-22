import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, createUserContent } from '@google/genai';
import { extractTextFromImages } from '../../../../services/flashcards';

/**
 * This endpoint accepts an image, extracts its text, 
 * and generates flashcards based on the extracted content.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.GEN_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing GEN_AI_API_KEY' },
      { status: 500 }
    );
  }
  const ai = new GoogleGenAI({ apiKey });

  // parse image files and check for valid input
  const form = await request.formData();
  const imageFiles = form.getAll('images') as File[];
  if (imageFiles.length === 0) {
    return NextResponse.json(
      { error: 'Please include at least one image under the `images` field.' },
      { status: 400 }
    );
  }

  // extract text from each image
  const combinedText = await extractTextFromImages(ai, imageFiles);

  // prompt for flashcards
  const prompt = `
Return ONLY a JSON array like:
  [{ "question": "…", "answer": "…" }]

Be sure to include only the most important topics,
and format exactly as JSON.

Text:
${combinedText}
  `

  // generate flashcards
  const flashRes = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: createUserContent([prompt]),
  });

  // parse and fromat response 
  const raw = flashRes.text ?? '';
  const jsonText = raw
    .replace(/^```(?:json)?\s*/, '')
    .replace(/```$/, '')
    .trim();

  let flashcards: { question: string; answer: string }[];
  try {
    flashcards = JSON.parse(jsonText);
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Failed to parse JSON from AI response.',
        raw,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ flashcards }, { status: 200 });
}
