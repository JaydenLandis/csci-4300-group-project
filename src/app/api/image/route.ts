import { NextRequest, NextResponse } from 'next/server';
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';
import connectMongoDB from '../../../../config/mongodb';
import FlashcardSet from "../../../models/flashcardSetSchema";

export async function POST(request: NextRequest) {
  // Parse data
  const apiKey = process.env.GEN_AI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEN_AI_API_KEY');
  }
  const ai = new GoogleGenAI({ apiKey });

  // Step 1: Parse form data
  const form = await request.formData();
  const setId = form.get('setId');
  const imageFiles = form.getAll('images') as File[];

  if (typeof setId !== 'string' || imageFiles.length === 0) {
    return NextResponse.json(
      { error: 'Please include setId and at least one image.' },
      { status: 400 }
    );
  }

  // Step 2: Upload images and extract text
  const ocrTexts: string[] = [];
  for (const file of imageFiles) {
    const uploadRes = await ai.files.upload({
      file,
      config: { mimeType: file.type },
    });

    const visionRes = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: createUserContent([
        createPartFromUri(uploadRes.uri!, uploadRes.mimeType!),
        'Extract all readable text from this image.',
      ]),
    });

    ocrTexts.push(visionRes.text ?? '');
  }

  // Step 3: Prompt for flashcards
  const flashPrompt = `
Return ONLY a JSON array like:
[{ "question": "…", "answer": "…" }]

Be sure to only include the most important topics. 
Act as a UGA student in your selection.

Text:
${ocrTexts.join('\n\n')}
  `.trim();

  // Step 4: Generate flashcards
  const flashRes = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: createUserContent([flashPrompt]),
  });

  // Step 5: Parse JSON
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

  // Step 6: Insert flashcards into MongoDB
  try {
    await connectMongoDB();

    const updatedSet = await FlashcardSet.findByIdAndUpdate(
      setId,
      { $push: { flashcards: { $each: flashcards } } }, // append the new cards
      { new: true, runValidators: true }
    );

    if (!updatedSet) {
      return NextResponse.json(
        { setId, error: 'Flashcard set not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ setId, flashcards, saved: true });
  } catch (err) {
    return NextResponse.json(
      {
        setId,
        error: 'Database error',
        details: (err as Error).message,
      },
      { status: 500 }
    );
  }
}