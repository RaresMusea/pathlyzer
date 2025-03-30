import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProjectCreator } from "@/context/ProjectCreatorContext"
import { RadioGroup, Radio } from "@heroui/radio";
import { Textarea } from "@heroui/input";

export const ProjectInfoStep = () => {
    const { projectConfig, handleInputChange } = useProjectCreator();

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                    id="project-name"
                    autoComplete="off"
                    placeholder="My Awesome Project"
                    value={projectConfig.name}
                    className="focus:ring-2 focus:ring-blue-500 focus:outline-none focus:shadow-lg"
                    onChange={(e) => handleInputChange("name", e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="project-description">Description (optional)</Label>
                <Textarea isClearable placeholder="My Dream App" className="focus:ring-2 focus:ring-blue-500 focus:outline-none focus:shadow-lg" onChange={(e) => { handleInputChange('description', e.target.value) }} />
            </div>
            <div className="space-y-2">
                <Label>Project Visibility</Label>
                <RadioGroup defaultValue="private" onChange={(e) => handleInputChange('visibility', e.target.value)}>
                    <div className="flex items-center space-x-2">
                        <Radio value="private" id="private" description="Your project can be accessed only by yourself.">Private</Radio>

                    </div>
                    <div className="flex items-center space-x-2">
                        <Radio value="public" id="public" description="Your project is accessed in read-only mode for other users.">Public</Radio>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}
