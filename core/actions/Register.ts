"use server";

import { RegisterSchema } from '@/schemas/AuthValidation';
import * as z from 'zod'
import bcrypt from "bcryptjs"
import { db } from '@/persistency/Db';
import { getUserByEmail } from '@/persistency/data/User';
import { generateEmailVerifToken } from '@/lib/TokenGenerator';
import { sendVerificationEmail } from '@/lib/Email';
import { User } from '@prisma/client';
import { createUserStats } from '@/app/service/user/userStatsService';

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

    const createdUser: User | null = await db.user.create({
        data: {
            name,
            username,
            email,
            password: hashedPass
        }
    });
    const errorMsg: string = 'The user already exists!';

    if (createdUser && createdUser.id) {
        try {
            await createUserStats(createdUser.id);
        } catch (error) {
            return { error: errorMsg };
        }
    }
    else {
        return { error: errorMsg };
    }

    const verificationToken = await generateEmailVerifToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token, name);

    return {
        success: `A verification email was successfully sent to ${email}!`
    }
}