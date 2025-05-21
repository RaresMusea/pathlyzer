import { db } from "@/persistency/Db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { isValidSession } from "@/security/Security";
import { CodeSectionDto } from "@/types/types";
import { redirect } from "next/navigation";
import { cache } from "react"

const maskCodeForClient = (originalCode: string): string => {
  return originalCode.replace(/~~.*?~~/g, '__');
}

export const getClientCodeSection = cache(async (questionId: string): Promise<CodeSectionDto | null> => {
    if (!await isValidSession()) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    const result = await db.codeSection.findFirst({
        where: { questionId: questionId.trim() },
        select: { id: true, code: true, language: true }
    });

    if (!result) return null;

    return {
        ...result,
        code: maskCodeForClient(result.code),
        language: result.language ?? undefined
    };
});
