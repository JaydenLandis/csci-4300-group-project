
import { NextResponse } from 'next/server';
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';
import connectMongoDB from '../config/mongodb';
import FlashcardSet from '../src/models/flashcardSetSchema';

/**
 * Upload & extract text form images
 */
export async function extractTextFromImages(
  ai: GoogleGenAI,
  imageFiles: File[]
): Promise<string> {
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

  return ocrTexts.join('\n');
}

/**
 * Prompt, generate flashcards, parse JSON, save to MongoDB.
 * Returns a NextResponse.
 */
export async function handleFlashcards(
  ai: GoogleGenAI,
  setId: string,
  combinedText: string
): Promise<NextResponse> {
  // system prompt
  const prompt = `
Return ONLY a JSON array like:
[{ "question": "…", "answer": "…" }]

Be sure to only include the most important topics.
Act as a UGA student in your selection.

Text:
${combinedText}
  `

  // call AI
  const flashRes = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: createUserContent([prompt]),
  });

  // parse JSON
  const raw = (flashRes.text || '');
  const jsonText = raw.replace(/^```(?:json)?\s*/, '').replace(/```$/, '');
  let flashcards: { question: string; answer: string }[];

  try {
    flashcards = JSON.parse(jsonText);
  } catch {
    return NextResponse.json(
      { setId, error: 'Failed to parse JSON from AI response.', raw },
      { status: 502 }
    );
  }

  // save to Mongo
  try {
    await connectMongoDB();
    const updated = await FlashcardSet.findByIdAndUpdate(
      setId,
      { $push: { flashcards: { $each: flashcards } } },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json(
        { setId, error: 'Flashcard set not found.' },
        { status: 404 }
      );
    }
    return NextResponse.json({ setId, flashcards, saved: true });
  } catch (err) {
    return NextResponse.json(
      { setId, error: 'Database error', details: (err as Error).message },
      { status: 500 }
    );
  }
}
