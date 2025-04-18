import { NextRequest, NextResponse } from 'next/server';
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';

export async function POST(request: NextRequest) {
 
  const apiKey = process.env.GEN_AI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEN_AI_API_KEY');
  }
  const ai = new GoogleGenAI({ apiKey });

  // Parse data
  const form = await request.formData();
  const setId = form.get('setId');
  const imageFiles = form.getAll('images') as File[];

  if (typeof setId !== 'string' || imageFiles.length === 0) {
    return NextResponse.json(
      { error: 'Please include setId and at least one image.' },
      { status: 400 }
    );
  }

  // Step 1: Upload images and extract text
  const ocrTexts: string[] = [];
  for (const file of imageFiles) {
    // Upload the file to Google GenAI
    const uploadRes = await ai.files.upload({
      file,
      config: { mimeType: file.type },
    });

    // Extract text via the vision model
    const visionRes = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: createUserContent([
        createPartFromUri(uploadRes.uri!, uploadRes.mimeType!),
        'Extract all readable text from this image.',
      ]),
    });

    ocrTexts.push(visionRes.text ?? '');
  }

  // — Step 2: Prompt for flashcards
  const schemaDef = `
const flashcardSchema = new Schema<IFlashcard>({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
});
  `.trim();

  const flashPrompt = `
Using the Mongoose schema below, generate flashcards ONLY for the most impactful concepts.
Return ONLY a JSON array matching the schema with "question" and "answer" fields.

${schemaDef}

Text content:
${ocrTexts.join('\n\n')}
  `.trim();

  // Step 3: Generate flashcards
  const flashRes = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: createUserContent([flashPrompt]),
  });

  // Step 4: Strip code fences & parse JSON
  const raw = (flashRes.text || '').trim();
  const jsonText = raw
    .replace(/^```(?:json)?\s*/, '')
    .replace(/```$/, '')
    .trim();

  let flashcards;
  try {
    flashcards = JSON.parse(jsonText);
  } catch {
    return NextResponse.json(
      {
        setId,
        error: 'Failed to parse JSON from AI response.',
        raw,
      },
      { status: 502 }
    );
  }

  // — Final response
  return NextResponse.json({ setId, flashcards });
}
