import mongoose, { Schema, Document, Model } from "mongoose";

// Mongoose provides properties such as the _id in Document, we extend this

interface IFlashCard {
  question: string
  options: {type:[string], default: []}
  answer: string
}

interface ISubjects {
  name: string
  flashCards: IFlashCard[]
}

interface Iuser extends Document{
  userName: string
  password: string
  subjects: ISubjects[]
}

const flashCardSchema = new Schema<IFlashCard> ({
  question: { type: String, required: true },
  options: {type: [String], required: true},
  answer: { type: String, required: true },
})

const subjectSchema = new Schema<ISubjects> ({
  name: {type: String, required: true},
  flashCards: {type: [flashCardSchema], default: []},
})

const userSchema = new Schema<Iuser> ({
  userName: {type: String, required: true},
  password: {type: String, required: true},
  subjects: {type: [subjectSchema], default: []}
})

const User: Model<Iuser> = mongoose.models.User || mongoose.model<Iuser>("User", userSchema);
export default User;