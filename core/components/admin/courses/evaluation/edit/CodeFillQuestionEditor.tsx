"use client";

import { CodeFillQuestionDto } from "@/types/types";
import { QuestionEditorFormGeneric } from "./QuestionEditorFormGeneric";
import { CodeCompletionEditor } from "./CodeCompletionEditor";

export const CodeFillQuestionEditor = ({ question }: { question: CodeFillQuestionDto }) => {
    return (
        <div className="space-y-6">
            <QuestionEditorFormGeneric question={question} />
            <CodeCompletionEditor question={question} />
        </div>
    )
}