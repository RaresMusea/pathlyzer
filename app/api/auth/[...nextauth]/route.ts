import { NextApiHandler } from 'next';
import NextAuth from "next-auth";
import {authOptions} from "@/auth"

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export { authHandler as GET, authHandler as POST };