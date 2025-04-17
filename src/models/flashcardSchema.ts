import mongoose, { Schema, Document, Model } from "mongoose";

// Represents a single flashcard
export interface IFlashcard extends Document {
  question: string;
  answer: string;
}

// Create the flashcard schema
const flashcardSchema = new Schema<IFlashcard>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

// Use "Flashcard" as the model name
const Flashcard: Model<IFlashcard> =
  mongoose.models.Flashcard || mongoose.model<IFlashcard>("Flashcard", flashcardSchema);

export default Flashcard;
