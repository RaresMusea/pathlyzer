import { QuestionType } from "@prisma/client"
import { CheckCircle, CheckSquare, Code, FileText } from "lucide-react"

export const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
        case QuestionType.SINGLE:
            return <CheckCircle className="h-4 w-4 mr-2" />
        case QuestionType.MULTIPLE:
            return <CheckSquare className="h-4 w-4 mr-2" />
        case QuestionType.CODE_FILL:
            return <Code className="h-4 w-4 mr-2" />
        default:
            return <FileText className="h-4 w-4 mr-2" />
    }
}

export const getQuestionTypeLabel = (type: QuestionType): string => {
    switch (type) {
        case QuestionType.SINGLE:
            return 'Single choice';
        case QuestionType.MULTIPLE:
            return 'Multiple choice';
        case QuestionType.CODE_FILL:
            return 'Code fill';
        default:
            return 'Unknown';
    }
}