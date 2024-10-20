"use server";

import { RegisterSchema } from '@/schemas/AuthValidation';
import * as z from 'zod'
import bcrypt from "bcrypt"
import { db } from '@/persistency/Db';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid fields!"
        };
    }

    const { email, password, name } = validatedFields.data;
    const hashedPass = await bcrypt.hash(password, 10);

    const existingUser = await db.user.findUnique({
        where: {
            email,
        }
    })

    if (existingUser) {
        return { error: "The provided email address is already associated to another account!" }
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPass
        }
    })

    //TODO: Sent verification token via email

    return {
        success: "User created successfully!"
    }
}