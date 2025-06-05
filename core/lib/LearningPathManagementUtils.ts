import { QuizType } from "@prisma/client";

export const xpRewards: number[] = [5, 10, 20, 25, 50, 75, 100];

type CodeFillProgrammingLanguage = {
    label: string,
    value: string
}

export const availableCodeFillProgrammingLanguages: CodeFillProgrammingLanguage[] = [
    {
        label: 'C',
        value: 'c',
    },
    {
        label: 'C++',
        value: 'cpp',
    },
    {
        label: 'C#',
        value: 'csharp'
    },
    {
        label: 'Java',
        value: 'java'
    },
    {
        label: 'XML',
        value: 'xml',
    },
    {
        label: 'JSON',
        value: 'json',
    },
    {
        label: 'Python',
        value: 'py',
    },
    {
        label: 'Javascript',
        value: 'js'
    },
    {
        label: 'Typescript',
        value: 'ts'
    },
    {
        label: 'React JSX',
        value: 'jsx'
    },
    {
        label: 'React TSX',
        value: 'tsx',
    },
]

export const getCodeFillLangLabelBasedOnValue = (value: string): string => {
    return availableCodeFillProgrammingLanguages.find(p => p.value === value)?.label || '';
}

export const getFormattedType = (quizType: QuizType): string => {
    return (quizType === QuizType.LESSON_QUIZ) ? 'Lesson quiz' : 'Exam';
}
