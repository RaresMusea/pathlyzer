"use client";

import { useEvaluation } from "@/hooks/useEvaluation";
import { SingleChoiceQuestionDto } from "@/types/types";

export const SingleChoiceQuestionEditor = ({question, onChange}: {question: SingleChoiceQuestionDto, onChange: (question: SingleChoiceQuestionDto) => void }) => {
    const { addAnswerChoice } = useEvaluation();

    return (
        <div></div>
    )
}