
import { getIconForFile} from 'vscode-icons-js'

export const getIcon = async (fileName: string): Promise<string> => {
    const fileIcon = getIconForFile(fileName);

    return `https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/${fileIcon}`          
};