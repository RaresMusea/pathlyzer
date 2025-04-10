import { ProjectCreationDto } from "@/types/types";

export type ValidationResult = {
    isValid: boolean;
    errors: string[];
};

export const validateProjectCreation = (payload: ProjectCreationDto): ValidationResult => {
    
}