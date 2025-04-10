import { Button } from "@/components/ui/button"
import { Code, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateProject } from "@/components/projects/CreateProject";
import { ProjectCreatorProvider } from "@/context/ProjectCreatorContext";
import { Project } from "@/types/types";
import { getProjects } from "@/app/service/project/projectService";
import ErrorPage from "./error";
import Link from "next/link";
import { auth } from "@/auth";
import NotFound from "@/components/projects/NotFound";


export default async function Projects() {
    const session = await auth();
    const projects: Project[] | null = await getProjects(`code/${session?.user.id}/`);

    console.log(projects);
    if (projects === null) {
        return <ErrorPage />
    }

    if (projects.length === 0) {
        return <NotFound userFirstName={session?.user.name || ''} userId={session?.user.id || ''} />
    }

    return (
        <div className='container mx-auto py-6 pt-6'>
            <div className='flex items-center justify-between mb-6'>
                <h1 className="text-4xl">Projects</h1>
                <ProjectCreatorProvider existingProjects={projects} userId={session?.user.id || ''}>
                    <CreateProject />
                </ProjectCreatorProvider>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects && projects.map((project: Project) => (
                    <Card key={project.name}>
                        <CardHeader>
                            <CardTitle>{project.name}</CardTitle>
                            <CardDescription>Last edited: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(project.lastModified))}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <Code className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground"></span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm">
                                <Link href={`/editor/${encodeURIComponent(project.path)}`}>Open</Link>
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}