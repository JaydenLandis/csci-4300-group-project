import { authConfig } from "@/auth.config";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/userSchema";

export const{
    handlers: {GET, POST},
    auth,
    signIn,
    signOut,
} = NextAuth ({
    ...authConfig,
    providers: [
        CredentialsProvider({
           credentials: {
            email: {},
            password: {}
           },
            async authorize(credentials) {
                if (!credentials) return null;

                try {
                const user = await User.findOne({email: credentials.email}).lean();

                    if(user) {
                        const isMatch = await bcrypt.compare(
                            credentials.password,
                            user.password
                        );

                        if(isMatch) {
                            return {
                                id: user._id.toString(),
                                name: user.username,
                         };
                        } else {
                            console.log("Email or Password is not correct");
                            return null;
                        }
                    } else {
                        console.log("User not found");
                        return null
                    }
                } catch (e: any) {
                    console.log("An error occurred: ", e);
                    return null;
                }
            } 
        })
    ]
});