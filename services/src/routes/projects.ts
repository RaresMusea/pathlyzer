import { Router, Request, Response } from "express";
import { copyS3Folder, folderExists, getFolderDetails, projectNameExists } from "../aws/aws";
import { validateProjectCreation, ValidationResult } from "../validation/validators";
import { getProjectType } from "../utils/projectTypeRetriever";
import { logger } from "../logging/logger";
import cuid from "cuid";

const router = Router();

router.head('/', async (request: Request, response: Response) => {
    const key = request.query.q as string;
    const tokens = key.split('/');
    const userId = tokens[1];
    const projectId = tokens[2];

    try {
        if (await projectNameExists(`${tokens[0]}/${userId}/`, projectId)) {
            return response.status(200).end();
        }
        return response.status(404).end();
    } catch (error) {
        console.log("Entered catch block");
        logger.error(`An error occurred while ettempting to verify the existence of the project.\n${error}}`);
        return response.status(500).json({ message: `An error occurred while ettempting to verify the existence of the project.\n${error}` });
    }
});

router.get("/", async (request: Request, response: Response) => {
    const key = request.query.q as string;
    const token = request.headers['x-api-key'] as string;
    const expectedToken: string = process.env.CLIENT_TOKEN as string;
    
    if (!token || expectedToken !== token) {
        logger.error(`Unauthorized access attempt with key: ${token || 'no key'}.`);
        return response.status(401).json({ message: 'Unauthorized!' });
    }

    if (typeof key !== "string") {
        return response.status(400).json({ error: "Invalid key parameter" });
    }

    const projects = await getFolderDetails(key);

    if (!projects) {
        return response.status(404).json({ message: "No projects found!" });
    }

    return response.status(200).json(projects);
});

router.post('/', async (request: Request, response: Response) => {
    const expectedKey: string = process.env.CLIENT_TOKEN as string;
    const key = request.headers['x-api-key'] as string;

    if (!key || key !== expectedKey) {
        logger.error(`Unauthorized access attempt with key: ${key || 'no key'}.`);
        return response.status(401).json({ message: 'Unauthorized!' });
    }

    const { projectName, template, framework, description, ownerId } = request.body;

    if (!ownerId) {
        return response.status(400).json({ message: 'Missing project owner!' });
    }

    const validationResult: ValidationResult = validateProjectCreation({ projectName, template, framework: framework, description });

    if (!validationResult.isValid) {
        logger.error(`Project creation failed.\nReason: ${validationResult.message}`);
        return response.status(400).json({ message: validationResult.message });
    }

    const projectType: string | undefined = getProjectType(template, framework);

    if (!projectType || !(await folderExists(`base/${template}/${projectType}`))) {
        return response.status(404).json({ message: `The pair ${template} - ${framework ?? 'no framework'} could not be found!` });
    }

    const projectId: string = cuid();

    try {
        await copyS3Folder(`base/${template}/${projectType}`, `code/${ownerId}/${projectId}/${projectName}`);
    } catch (error) {
        logger.error(`Failed to copy project files.\nReason: ${error}`);
        return response.status(500).json({ message: 'An error has occurred while attempting to copy the project files. Please try again.' });
    }

    return response.status(201).json({ projectPath: `code/${ownerId}/${projectId}/${projectName}`, projectId });
});

export default router;