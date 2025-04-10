"use client";
import { ProjectInfoStep } from "@/components/projects/modal/ProjectInfoStep";
import { ProjectTechStackStep } from "@/components/projects/modal/ProjectTechStackStep";
import { Project, ProjectCreationDto, ProjectCreationPayload } from "@/types/types";
import { blankLogo, cppLogo, javaLogo, nextJsLogo, springLogo, typescriptLogo } from "@/exporters/LogoExporter";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ProjectCreatorContextProps {
    open: boolean;
    currentStep: number;
    steps: Step[];
    direction: Direction;
    progress: number;
    loadingDetails: string;
    projectConfig: ProjectConfig;
    projectTemplates: ProjectTemplate[];
    frameworks: Frameworks;
    creating: boolean;
    loadingStep: string;
    showProgressWizard: boolean;
    creationComplete: boolean;
    setDirection: (newDiection: Direction) => void;
    setOpen: (newState: boolean) => void;
    setCurrentStep: (newStep: number) => void;
    setProgress: (newProgress: number) => void;
    setProjectConfig: (newProjConfig: ProjectConfig) => void;
    setCreating: (state: boolean) => void;
    renderCustomCreationStep: () => ReactNode;
    handleInputChange: (field: string, value: string) => void;
    getSelectedTemplate: () => ProjectTemplate | undefined;
    getSelectedFramework: () => Framework | undefined;
    nextStep: () => void;
    setLoadingStep: (loadingStep: string) => void;
    setLoadingDetails: (loadingDetails: string) => void;
    previousStep: () => void;
    handleClose: () => void;
    handleProjectCreation: () => Promise<void>;
    abortCreation: () => void;
}

enum Direction {
    FORWARDS,
    BACKWARDS,
}

interface Describable {
    description: string;
}

interface Step extends Describable {
    index: number,
    title: string,
};

interface ProjectTemplate extends Describable {
    value: string,
    label: string,
    logo: string
}

export interface Framework extends Describable {
    value: string;
    label: string;
    logo: string;
}

export interface Frameworks {
    [language: string]: Framework[];
}

interface ProjectConfig {
    name: string,
    description?: string,
    template: string;
    framework?: string;
    os?: string,
    dependencies: string[];
    visibility: string;
}

const ProjectCreatorContext = createContext<ProjectCreatorContextProps | undefined>(undefined);

export const ProjectCreatorProvider: React.FC<{ children: React.ReactNode, existingProjects: Project[] | null, userId: string }> = ({ children, existingProjects, userId }) => {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [direction, setDirection] = useState<Direction>(Direction.BACKWARDS);
    const [creating, setCreating] = useState<boolean>(false);
    const [loadingStep, setLoadingStep] = useState<string>("");
    const [loadingDetails, setLoadingDetails] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);
    const [showProgressWizard, setshowProgressWizard] = useState<boolean>(false);
    const [creationComplete, setCreationComplete] = useState<boolean>(false);

    const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
        name: "",
        description: '',
        template: "",
        framework: "none",
        os: "",
        dependencies: [],
        visibility: 'private'
    })

    const steps: Step[] = [
        { index: 1, title: 'Project Info', description: 'Enter basic information about your new project.' },
        { index: 2, title: 'Tech stack', description: 'Choose the tech stack that will be used by your project.' },
        // { index: 3, title: 'Environment', description: 'Select the environmental settings.' },
        // { index: 4, title: 'Dependencies', description: 'Choose the project dependencies.' }
    ];

    const projectTemplates: ProjectTemplate[] = [
        { value: 'blank', label: 'Empty Project', logo: blankLogo, description: 'A blank template with no dependencies, providing a clean slate for any type of development.' },
        { value: 'java', label: 'Java', logo: javaLogo, description: 'A class-based, cross-platform object-oriented language.' },
        { value: 'cpp', label: "C++", logo: cppLogo, description: 'A high-performance, cross-platform object-oriented language with low-level memory control and multi-paradigm support.' },
        { value: 'typescript', label: 'Typescript', logo: typescriptLogo, description: 'TypeScript is a superset of JavaScript that adds static typing, improving code safety and scalability. It’s widely used for web and backend development.' }
    ];

    const frameworks: Frameworks = {
        Java: [
            { value: "spring", label: "Spring", logo: springLogo, description: 'A powerful, modular framework for building enterprise-grade Java applications with dependency injection and built-in support for web services, security, and data access.' },
            { value: "none", label: "No framework", logo: '', description: 'A raw development setup without any framework, offering complete control over architecture and implementation.' },
        ],
        Typescript: [
            { value: "nextjs", label: 'Next.js', logo: nextJsLogo, description: 'Next.js is a React framework for building fast, scalable web applications with features like server-side rendering, static generation, and API routes.' }
        ]
    };

    const renderCustomCreationStep = (): ReactNode => {
        switch (currentStep) {
            case 1: return <ProjectInfoStep />
            case 2: return <ProjectTechStackStep />
        }
    }

    const handleInputChange = useCallback((field: string, value: string) => {
        if (field === "language") {
            setProjectConfig({
                ...projectConfig,
                template: value,
                framework: "",
            })
        } else {
            setProjectConfig({
                ...projectConfig,
                [field]: value,
            })
        }
    }, [projectConfig]);

    const getSelectedTemplate = useCallback((): ProjectTemplate | undefined => {
        return projectTemplates.find((template) => template.label === projectConfig.template);
    }, [projectConfig]);

    const getSelectedFramework = useCallback((): Framework | undefined => {
        if (!projectConfig.template || !projectConfig.framework) return undefined;
        const availableFrameworks = frameworks[projectConfig.template as keyof typeof frameworks] || []

        return availableFrameworks.find((fw) => fw.label === projectConfig.framework)
    }, [projectConfig]);

    const nextStep = useCallback(() => {
        if (currentStep === 1 && !projectConfig.name) {
            toast.error('The name of your project cannot be empty!');
            return;
        }

        if (currentStep === 1 && existingProjects?.some(project => project.name === projectConfig.name)) {
            toast.error('A project with this name already exists!');
            return;
        }

        if (currentStep === 2 && !projectConfig.template) {
            toast.error('Before continuing, please select a project template.')
            return;
        }

        setDirection(Direction.BACKWARDS);
        setCurrentStep(currentStep + 1);
    }, [projectConfig.name, projectConfig.template, currentStep]);

    const previousStep = useCallback(() => {
        setDirection(Direction.FORWARDS);
        setCurrentStep(currentStep - 1);
    }, [currentStep]);

    const handleClose = useCallback(() => {
        setOpen(false);
        setCurrentStep(1);
        setProjectConfig({
            name: "",
            template: "",
            framework: "none",
            os: "",
            dependencies: ["react-router", "axios"],
            visibility: 'private',
        });
    }, []);

    const handleProjectCreation = async () => {
        try {
            resetStateBeforeCreation();
            const projectData: ProjectCreationPayload = getProjectPayload();
            console.log("USER ID", userId);

            await projectExists(projectData.projectName, userId);

            const { data } = await createProjectRequest(projectData, userId);

            await saveProject({ projectData, projectId: data.projectId, projectPath: data.projectPath, ownerId: userId });

            await simulateWorkspaceCreation();
            await finalizeProjectSetup(data.projectPath);

        } catch (error: any) {
            console.error(error);
            handleCreationErrors(error);
        }
    }

    const getProjectPayload = (): ProjectCreationPayload => ({
        projectName: projectConfig.name,
        description: projectConfig.description || null,
        template: projectConfig.template,
        framework: projectConfig.framework || null,
        visibility: projectConfig.visibility
    });

    const createProjectRequest = async (projectData: ProjectCreationPayload, ownerId: string) => {
        return axios.post(`http://localhost:3000/api/proxy/project`, { ...projectData, ownerId });
    }

    const saveProject = async (projectData: ProjectCreationDto) => {
        setProgress(40);
        setLoadingStep('Saving project...');

        const response = await axios.post(`http://localhost:3000/api/editor/project`, projectData);

        if (response.status === 201) {
            setProgress(55);
            setLoadingStep('Project saved successfully!');
            setLoadingDetails('Finalizing setup...');
            return;
        }
    }

    const projectExists = async (projectName: string, userId: string) => {
        setProgress(20);
        setLoadingStep('Performing pre-requisites...');
        setLoadingStep('Checking whether the project already exists...');

        try {
            const response = await axios.head(`http://localhost:3000/api/proxy/project?q=code/${userId}/${projectName}`);
            console.log("RESPONSE", response);

            if (response.status === 200) {
                setLoadingStep("An error occurred while creating your project");
                setLoadingDetails(`A project with the same name (${projectName}) already exists!`);
                return;
            }
        } catch (error) {
            if (error.status !== 404) {
                setLoadingStep("An error occurred while checking the project.");
                setLoadingDetails("Could not verify project existence.");
            }
            return;
        }
    }

    const simulateWorkspaceCreation = async () => {
        setProgress((prevProg) => prevProg + 15);
        setLoadingStep('Creating workspace...');
        setLoadingDetails('Almost done');

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    useEffect(() => {
        console.log(projectConfig);
    }, [projectConfig]);

    const finalizeProjectSetup = async (result: string) => {
        const encodedProjectId: string = encodeURIComponent(result);
        console.warn(result);

        setProgress(100);
        setLoadingStep("Project created successfully!");
        setLoadingDetails("Redirecting to project dashboard...");
        setCreationComplete(true);

        setTimeout(() => {
            setshowProgressWizard(false);
            setCreating(false);
            router.refresh();
            router.push(`/editor/${encodedProjectId}`);
        }, 600);
    }

    const handleCreationErrors = (error: any) => {
        setLoadingStep("An error occurred while creating your project");
        setLoadingDetails(error.response.data as string);
        console.error(error);
    }

    const abortCreation = () => {
        setshowProgressWizard(false);
        setCreationComplete(false);
        setCreating(true);
        setProgress(0);
        setCurrentStep(1);
        setLoadingStep('Creating a new project');
        setLoadingDetails('Checking parameters...');
    }

    const resetProjectConfig = () => {
        setProjectConfig({
            name: "",
            description: '',
            template: "",
            framework: "none",
            os: "",
            dependencies: [],
            visibility: 'private'
        })
    }

    const resetStateBeforeCreation = () => {
        setOpen(false);
        setshowProgressWizard(true);
        setCreationComplete(false);
        setCreating(true);
        setProgress(0);
        setLoadingStep('Creating a new project');
        setLoadingDetails('Checking parameters...');
    }

    return (
        <ProjectCreatorContext.Provider value={{
            open,
            currentStep,
            loadingDetails,
            steps,
            progress,
            direction,
            creating,
            loadingStep,
            projectConfig,
            projectTemplates,
            showProgressWizard,
            frameworks,
            creationComplete,
            setOpen,
            setCurrentStep,
            setDirection,
            setProjectConfig,
            renderCustomCreationStep,
            handleInputChange,
            getSelectedTemplate,
            setCreating,
            setLoadingStep,
            setLoadingDetails,
            getSelectedFramework,
            nextStep,
            previousStep,
            setProgress,
            handleClose,
            handleProjectCreation,
            abortCreation
        }}>
            {children}
        </ProjectCreatorContext.Provider>
    )
}

export const useProjectCreator = () => {
    const context = useContext(ProjectCreatorContext);

    if (!context) {
        throw new Error("useProjectCreator() must be used within a ProjectCreatorProvider!");
    }

    return context;
};