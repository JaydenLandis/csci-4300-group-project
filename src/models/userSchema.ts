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
  image_url: string
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
  image_url: {type: String, required: true}
})

const userSchema = new Schema<Iuser> ({
  userName: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  subjects: {type: [subjectSchema], default: []}
})

const User: Model<Iuser> = mongoose.models.User || mongoose.model<Iuser>("User", userSchema);
export default User;


/* 
Example:

{
  "userName": "Jayden",
  "password": "jayden_is_the_best",
  "subjects": [
    {
      "name": "History",
      "flashCards": [
        {
          "question": "Who was the first president of the United States?",
          "options": ["George Washington", "John Adams", "Thomas Jefferson"],
          "answer": "George Washington"
        }
      ],
      "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKyQLk2MtbGJNwxf9PORQjkUxeGyYBfDb1Bg&s"
    }
  ]
}


*/