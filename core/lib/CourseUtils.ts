import { CourseDifficulty } from '@prisma/client'

export const getDifficultyLabel = (difficulty: CourseDifficulty): string => {
    switch (difficulty) {
        case 'BEGINNER':
            return 'Beginner'
        case 'INTERMEDIATE':
            return 'Intermediate'
        case 'ADVANCED':
            return 'Advanced'
        default:
            return 'Unknown'
    }
};

export const getDifficultyColorStyles = (difficulty: CourseDifficulty): string => {
    switch (difficulty) {
        case 'BEGINNER':
            return 'bg-green-100 text-green-800 hover:bg-green-100'
        case 'INTERMEDIATE':
            return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
        case 'ADVANCED':
            return 'bg-red-100 text-red-800 hover:bg-red-100'
        default:
            return ''
    }
};