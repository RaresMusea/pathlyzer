"use server";

import { RegisterSchema } from '@/schemas/AuthValidation';
import * as z from 'zod'
import bcrypt from "bcryptjs"
import { db } from '@/persistency/Db';
import { getUserByEmail } from '@/persistency/data/User';
import { generateEmailVerifToken } from '@/lib/TokenGenerator';
import { sendVerificationEmail } from '@/lib/Email';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid fields!"
        };
    }

    const { email, password, name, username } = validatedFields.data;
    const hashedPass = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "The provided email address is already associated to another account!" }
    }

    await db.user.create({
        data: {
            name,
            username,
            email,
            password: hashedPass
        }
    })

    const verificationToken = await generateEmailVerifToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token, name);

    return {
        success: `A verification email was successfully sent to ${email}!`
    }
}