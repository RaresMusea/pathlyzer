"use client";

import { createContext, useContext, useState } from "react";

type EditingQuestionContextType = {
    editingQuestionIndex: number | null;
    setEditingQuestionIndex: (index: number | null) => void;
};

const EditingQuestionContext = createContext<EditingQuestionContextType | undefined>(undefined);

export const EditingQuestionProvider = ({ children }: { children: React.ReactNode }) => {
    const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

    return (
        <EditingQuestionContext.Provider value={{ editingQuestionIndex, setEditingQuestionIndex }}>
            {children}
        </EditingQuestionContext.Provider>
    );
};

export const useEditingQuestion = () => {
    const context = useContext(EditingQuestionContext);
    
    if (!context) throw new Error("useEditingQuestion() must be used within an EditingQuestionProvider");
    return context;
};
