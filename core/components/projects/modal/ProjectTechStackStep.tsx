import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProjectCreator } from "@/context/ProjectCreatorContext"
import { blankLogo, getLogoBasedOnTech } from "@/exporters/LogoExporter"
import { useTheme } from "next-themes"
import Image from "next/image"


export const ProjectTechStackStep = () => {
    const { projectTemplates, frameworks, projectConfig, handleInputChange, getSelectedTemplate, getSelectedFramework } = useProjectCreator();
    const theme: string | undefined = useTheme().theme;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="language">Project Template</Label>
                <Select
                    value={projectConfig.template}
                    onValueChange={(value) => handleInputChange("language", value)}
                >
                    <SelectTrigger className="w-full">
                        <div className="flex items-center">
                            {projectConfig.template ? (
                                <>
                                    <div className="w-6 h-6 mr-2 relative">
                                        <Image
                                            src={getLogoBasedOnTech(getSelectedTemplate()?.label || '', theme || 'light')}
                                            alt={getSelectedTemplate()?.label || "Language"}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <span>{getSelectedTemplate()?.label}</span>
                                </>
                            ) : (
                                <span className="text-gray-500">Select a project template</span>
                            )}
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {projectTemplates.map((template) => (
                            <SelectItem key={template.value} value={template.label} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition">
                                <div className="flex items-center">
                                    <div className="w-6 h-6 mr-2 relative">
                                        <Image
                                            src={getLogoBasedOnTech(template.label, theme || 'light')}
                                            alt={template.label}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    {template.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {projectConfig.template && projectConfig.template !== 'Empty Project' && frameworks[projectConfig.template as keyof typeof frameworks] !== undefined && (
                <div className="space-y-2">
                    <Label htmlFor="framework">Framework</Label>
                    <Select
                        value={projectConfig.framework}
                        onValueChange={(value) => handleInputChange("framework", value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a framework">
                                {projectConfig.framework && (
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 mr-2 relative">
                                            <Image
                                                src={getLogoBasedOnTech(getSelectedFramework()?.logo || blankLogo, theme || 'light')}
                                                alt={getSelectedFramework()?.label || ""}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        {getSelectedFramework()?.label}
                                    </div>
                                )}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {(frameworks[projectConfig.template as keyof typeof frameworks] || []).map(
                                (framework) => (
                                    <SelectItem key={framework.value} value={framework.label} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition">
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 mr-2 relative">
                                                <Image
                                                    src={getLogoBasedOnTech(framework?.logo || blankLogo, theme || 'light')}
                                                    alt={framework?.label || ''}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            {framework.label}
                                        </div>
                                    </SelectItem>
                                ),
                            )}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {projectConfig.template && (
                <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg border">
                            <div className="flex items-center mb-3">
                                <div className="w-10 h-10 mr-3 relative">
                                    <Image
                                        src={getLogoBasedOnTech(getSelectedTemplate()?.logo || blankLogo, theme || 'light')}
                                        alt={getSelectedTemplate()?.label || ''}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Template</p>
                                    <h3 className="font-medium">{getSelectedTemplate()?.label}</h3>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {getSelectedTemplate()?.description}
                            </p>
                        </div>

                        {projectConfig.framework && (
                            <div className="bg-muted/50 p-4 rounded-lg border">
                                <div className="flex items-center mb-3">
                                    <div className="w-10 h-10 mr-3 relative">
                                        <Image
                                            src={getLogoBasedOnTech(getSelectedFramework()?.logo || blankLogo, theme || 'light')}
                                            alt={getSelectedFramework()?.label || ""}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Framework</p>
                                        <h3 className="font-medium">{getSelectedFramework()?.label}</h3>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {getSelectedFramework()?.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}   
