import { NextResponse, NextRequest } from 'next/server';
import { GoogleGenAI, createUserContent } from '@google/genai';

export async function POST(request: NextRequest) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEN_AI_API_KEY! });

  const form = await request.formData();
  const setId = form.get('setId');
  const images = form.getAll('images') as File[];

  if (!setId || images.length === 0) {
    return NextResponse.json(
      { error: 'Please include setId and at least one image.' },
      { status: 400 }
    );
  }

  // OCR Images
  async function fileToBase64(file: File) {
    const buf = new Uint8Array(await file.arrayBuffer());
    let str = '';
    for (let i = 0; i < buf.length; i += 0x8000) {
      str += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    }
    return btoa(str);
  }

  const texts = await Promise.all(
    images.map(async (file) => {
      const base64 = await fileToBase64(file);
      const contents = createUserContent([
        { inlineData: { data: base64, mimeType: file.type } },
        'Extract all readable text from this image.',
      ]);
      const visionRes = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents,
      });
      return visionRes.text;
    })
  );

  // Generate flashcards
  const schemaDef = `
const flashcardSchema = new Schema<IFlashcard>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});
  `.trim();

  const flashPrompt = `
Using the Mongoose schema below, generate flashcards ONLY for the most impactful concepts.
Return ONLY a JSON array of objects matching this schema with "question" and "answer" fields.

${schemaDef}

Text content:
${texts.join('\n\n')}
  `.trim();

  const flashContents = createUserContent([flashPrompt]);
  const flashRes = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: flashContents,
  });

  // parsing:
  let raw = (flashRes.text || "").trim();
  const fenceRegex = /^```(?:json)?\s*([\s\S]*?)```$/i;
  const match = raw.match(fenceRegex);
  const jsonText = match ? match[1].trim() : raw;

  let flashcards;
  try {
    flashcards = JSON.parse(jsonText);
  } catch (err) {
    return NextResponse.json(
      {
        setId,
        error: 'Failed to parse JSON after stripping fences',
        output: raw,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ setId, flashcards });
}