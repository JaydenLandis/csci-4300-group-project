import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';


/**
 * Upload & extract text form images
 */
export async function extractTextFromImages(
  ai: GoogleGenAI,
  imageFiles: File[]
): Promise<string> {
  const ocrTexts: string[] = [];

  // Upload each file to google gemini
  for (const file of imageFiles) {
    const uploadRes = await ai.files.upload({
      file,
      config: { mimeType: file.type },
    });
    // Call Ai model to extract text from uploaded images
    const visionRes = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: createUserContent([
        createPartFromUri(uploadRes.uri!, uploadRes.mimeType!),
        'Extract all readable text from this image.',
      ]),
    });

    // save extracted text or empty string 
    ocrTexts.push(visionRes.text ?? '');
  }

  // combine all texts into single string 
  return ocrTexts.join('\n');
}
