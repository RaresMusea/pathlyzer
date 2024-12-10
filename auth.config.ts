import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import bcrypt from "bcryptjs";
import { LoginSchema } from "./schemas/AuthValidation"
import { getUserByEmail } from "./persistency/data/User";
 
export default { providers: [Credentials({
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