"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEditingQuestion } from "@/context/EditingQuestionContext";
import { useEvaluation } from "@/hooks/useEvaluation";
import { CodeFillQuestionDto } from "@/types/types";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

export const CodeCompletionEditor = ({ question }: { question: CodeFillQuestionDto }) => {
    const { form, updateQuestion } = useEvaluation();
    const { editingQuestionIndex } = useEditingQuestion();
    const [codeSnippet, setCodeSnippet] = useState<string>(question.codeSection.code);

    useEffect(() => {
        if (editingQuestionIndex === null) return;

        const matches = [...codeSnippet.matchAll(/~~(.*?)~~/g)].map(m => m[1]);

        form.setValue(`quiz.questions.${editingQuestionIndex}.codeSection.correct`, matches, { shouldValidate: true });
    }, [codeSnippet, editingQuestionIndex, form]);

    if (editingQuestionIndex === null) {
        return null;
    }

    const handleCodeChange = (value: string) => {
        setCodeSnippet(value);
        updateQuestion(editingQuestionIndex, { ...question, codeSection: { ...question.codeSection, code: value } });
    }

    const renderPreview = () => {
        if (!codeSnippet) return null;

        const parts = codeSnippet.split(/(~~.*?~~)/g);

        return (
            <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm border">
                {parts.map((part, index) => {
                    if (part.startsWith('~~') && part.endsWith('~~')) {
                        const content = part.substring(2, part.length - 2);

                        return (
                            <span key={index} className="bg-primary/10 text-primary border border-dashed border-primary/40 rounded px-1 mx-0.5">
                                {content}
                            </span>
                        );
                    }
                    return <span key={index}>{part}</span>;
                })}
            </pre>
        )
    }

    return (
        <div className="space-y-2">
            <FormField control={form.control} name={`quiz.questions.${editingQuestionIndex}.codeSection.code`} render={({ field }) => (
                <FormItem>
                    <FormLabel htmlFor="code-snippet">Code snippet</FormLabel>
                    <FormControl>
                        <Textarea
                            id="code-snippet"
                            {...field}
                            placeholder={`Enter a valid code snippet where the code blanks will be marked by ~~ ~~.`}
                            onChange={(e) => { handleCodeChange(e.target.value) }}
                            className="font-mono text-sm min-h-[200px]"
                        />
                    </FormControl>
                    <FormMessage></FormMessage>
                </FormItem>
            )} />

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5" />
                <p>
                    Use double tilde <code className="bg-muted px-1 rounded">{"~~...~~"}</code> to mark code portions will need to get filled in.
                    For example: <code className="bg-muted px-1 rounded">const x = {"~~5 + 5~~"}</code>
                </p>
            </div>

            <div className="space-y-2">
                <Label>Preview</Label>
                {renderPreview()}
            </div>
        </div>
    )
}