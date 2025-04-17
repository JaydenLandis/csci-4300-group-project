import mongoose, { Schema, Document, Model } from "mongoose";
import { flashcardSetSchema, IFlashcardSet } from "./flashcardSetSchema";
import FlashcardSet from "./flashcardSetSchema";

// Mongoose provides properties such as the _id in Document, we extend this


interface IUser extends Document {
  username: string;
  password: string;
  flashcardSets: mongoose.Types.ObjectId[]; // reference
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  flashcardSets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FlashcardSet' }],
});


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;