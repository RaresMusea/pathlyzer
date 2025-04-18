export const getLanguageByAbbr = (langAbbr: string): string =>{
    switch(langAbbr){
        case 'java':
            return 'Java';
        case 'c++':
            return 'C++';
        case 'python':
            return 'Python';
        case 'css':
            return 'CSS';
        case 'javascript':
            return 'Javascript';
        case 'typescript':
            return 'Typescript';
        case 'tsx':
            return 'TSX';
        case 'jsx':
            return 'JSX';
        case 'html':
            return 'HTML';
        case 'py':
            return 'Python';
        default:
            return 'Unknown';
    }
}