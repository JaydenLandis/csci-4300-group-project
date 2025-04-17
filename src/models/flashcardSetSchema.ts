import mongoose, { Schema, Document, Model } from 'mongoose';
import { IFlashcard } from './flashcardSchema';

// Define the flashcard schema inline or import it
const flashcardSchema = new Schema<IFlashcard>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

export interface IFlashcardSet extends Document {
  flashcards: IFlashcard[];
  setName: string;
}

export const flashcardSetSchema = new Schema<IFlashcardSet>({
  flashcards: { type: [flashcardSchema], default: [] },
  setName: { type: String, required: true },
});



const FlashcardSet: Model<IFlashcardSet> =
  mongoose.models.FlashcardSet || mongoose.model<IFlashcardSet>('FlashcardSet', flashcardSetSchema);

export default FlashcardSet;
