import logo5 from "@/resources/logos/5.svg";
import logo6 from "@/resources/logos/6.svg";
import logo2 from "@/resources/logos/2.svg";
import logo1 from "@/resources/logos/1.svg";
import logo3 from "@/resources/logos/3.svg";
import logo4 from "@/resources/logos/4.svg";
import logo7 from "@/resources/logos/7.svg";
import javaIcon from '@/resources/languages/java-icon.svg'
import javascriptIcon from "@/resources/languages/javascript-logo.svg";
import blankIconDark from '@/resources/languages/blank-icon.svg'
import blankIconLight from '@/resources/languages/blank-icon-light.svg'
import springIcon from '@/resources/languages/spring-icon.svg'
import cppIcon from '@/resources/languages/cpp-logo.svg'
import csharpIcon from "@/resources/languages/csharp-logo.svg";
import typescriptIcon from '@/resources/languages/typescript-logo.svg';
import nextjsIcon from '@/resources/languages/nextjs-logo.svg';
import reactIcon from '@/resources/languages/react-logo.svg';
import jsonIcon from '@/resources/languages/json-logo.svg';
import xmlIcon from '@/resources/languages/xml-logo.svg';
import cIcon from '@/resources/languages/c-logo.svg';
import pythonIcon from "@/resources/languages/python-logo.svg";

export const navLogoDark: string = logo5;
export const navLogoLight: string = logo6;
export const logoDetailedDark: string = logo2;
export const logoDetailedLight: string = logo1;

export const logoDashboardLight: string = logo3;
export const logoDashboardDark: string = logo4;

const logoMinimal = logo7;

export const javaLogo: string = javaIcon;
export const javascriptLogo: string = javascriptIcon; 
export const csharpLogo: string = csharpIcon;
export const blankLogo: string = blankIconDark;
export const blankLogoLight: string = blankIconLight;
export const springLogo: string = springIcon;
export const cppLogo: string = cppIcon;
export const typescriptLogo: string = typescriptIcon;
export const nextJsLogo: string = nextjsIcon;
export const reactLogo: string = reactIcon;
export const jsonLogo: string = jsonIcon;
export const xmlLogo: string = xmlIcon;
export const cLogo: string = cIcon;
export const pythonLogo: string = pythonIcon;

export const getAppNavLogo = (theme: string): string => {
    switch (theme) {
        case "dark":
            return navLogoDark;
        case "light":
            return navLogoLight;
        default:
            return navLogoLight;
    }
}

export const getMinimalLogo = (): string => {
    return logoMinimal;
}

export const getDashboardLogo = (theme: string): string => {
    switch (theme) {
        case "dark":
            return logoDashboardDark;
        case "light":
            return logoDashboardLight;
        default:
            return logoDashboardLight;
    }
}

export const getLogoBasedOnTech = (template: string, theme: string): string => {
    switch (template) {
        case "Java":
            return javaLogo;
        case "C++":
            return cppLogo;
        case "Typescript":
            return typescriptLogo;
        case "Spring":
            return springLogo;
        case "Next.js":
            return nextJsLogo;
        case "React":
            return typescriptLogo;
        case 'C':
            return cLogo;
        case "C++":
            return cppLogo;
        case "C#":
            return csharpLogo;
        case 'Python':
            return pythonLogo;
        case 'Javascript':
            return javascriptLogo;
        case 'React':
        case 'React JSX':
        case 'React TSX':
            return reactLogo;
        case 'JSON':
            return jsonLogo;
        case 'XML':
            return xmlLogo;
        default:
            return (theme === 'dark' ? blankIconLight : blankLogo);
    }
}