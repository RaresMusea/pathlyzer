import logo5 from "@/resources/logos/5.svg";
import logo6 from "@/resources/logos/6.svg";
import logo2 from "@/resources/logos/2.svg";
import logo1 from "@/resources/logos/1.svg";
import logo3 from "@/resources/logos/3.svg";
import logo7 from "@/resources/logos/7.svg";
import javaIcon from '@/resources/languages/java-icon.svg'
import blankIconDark from '@/resources/languages/blank-icon.svg'
import blankIconLight from '@/resources/languages/blank-icon-light.svg'
import springIcon from '@/resources/languages/spring-icon.svg'
import cppIcon from '@/resources/languages/cpp-logo.svg'
import typescriptIcon from '@/resources/languages/typescript-logo.svg';
import nextjsIcon from '@/resources/languages/nextjs-logo.svg';

export const navLogoDark: string = logo5;
export const navLogoLight: string = logo6;
export const logoDetailedDark: string = logo2;
export const logoDetailedLight: string = logo1;

const logoMinimal = logo7;

export const javaLogo: string = javaIcon;
export const blankLogo: string = blankIconDark;
export const blankLogoLight: string = blankIconLight;
export const springLogo: string = springIcon;
export const cppLogo: string = cppIcon;
export const typescriptLogo: string = typescriptIcon;
export const nextJsLogo: string = nextjsIcon;

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
        default:
            return (theme === 'dark' ? blankIconLight : blankLogo);
    }
}