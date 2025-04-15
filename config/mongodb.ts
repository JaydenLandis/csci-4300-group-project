import 'dotenv/config';
import mongoose from "mongoose";

const connectMongoDB = async () => {
 try {
   const uri = process.env.MONGODB_URI;
   console.log(uri)
   if (!uri) {
     throw new Error("MONGODB_URI is not defined in environment variables.");
   }
   await mongoose.connect(uri);
   console.log("Connected to MongoDB.");
 } catch (error) {
   console.log("Error connecting to MongoDB:", (error as Error).message);
 }
};

export default connectMongoDB;

