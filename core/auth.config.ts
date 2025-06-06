import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import bcrypt from "bcryptjs";
import { LoginSchema } from "./schemas/AuthValidation"
import { getUserByEmail } from "./persistency/data/User";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
 
export default { providers: [
    Google ({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
        clientId: process.env.GH_CLIENT_ID,
        clientSecret: process.env.GH_CLIENT_SECRET,
    }),
    Credentials({
    async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
            const {email, password} = validatedFields.data;
            const user = await getUserByEmail(email);
            
            if (!user || !user.password) { 
               return null; 
            }

            const passwordsMatch: boolean = await bcrypt.compare(password, user.password);
            
            if (passwordsMatch) {
                return user;
            }
        }
        return null;
    }
})] } satisfies NextAuthConfig