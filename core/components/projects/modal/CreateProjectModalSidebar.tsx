import { useProjectCreator } from "@/context/ProjectCreatorContext"
import { Check } from "lucide-react";

export const CreateProjectModalSidebar = () => {
    const { steps, currentStep } = useProjectCreator();

    return (
        <div className="w-[200px] bg-gray-100 border-r dark:bg-[#17191E] text-white">
            <div className="p-6">
                <h3 className="font-semibold mb-4 dark:text-white text-black">Create Project</h3>
                <div className="space-y-4">
                    {steps.map((item) => (
                        <div
                            key={item.index}
                            className={`flex items-center p-2 rounded-md ${currentStep === item.index ? "bg-primary/10 text-primary" : "text-muted-foreground"
                                }`}>
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs ${currentStep > item.index
                                    ? "bg-primary text-primary-foreground"
                                    : currentStep === item.index
                                        ? "border-2 border-primary text-primary"
                                        : "border border-muted-foreground text-muted-foreground"
                                    }`}
                            >
                                {currentStep > item.index ? <Check className="h-3 w-3" /> : item.index}
                            </div>
                            <span className="text-sm">{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}