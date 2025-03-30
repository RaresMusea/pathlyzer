"use clinet";

import { BackButton } from "./authentication/BackButton";
import { Header } from "./authentication/Header";
import { SocialAuthMethods } from "./authentication/SocialAuthMethods";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface CardWrapperProps {
    children: React.ReactNode;
    headerName: string;
    backButtonText: string;
    backButtonHref: string;
    socialOptionsEnabled?: boolean;
}

export const CardWrapper = ({
    children,
    headerName,
    backButtonText,
    backButtonHref,
    socialOptionsEnabled
}: CardWrapperProps) => {
    return (
        <Card className="w-[500px] shadow-md">
            <CardHeader>
                <Header headerTitle={headerName}></Header>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {socialOptionsEnabled && (
                <CardFooter>
                    <SocialAuthMethods />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton backButtonText={backButtonText} backButtonHref={backButtonHref} />
            </CardFooter>
        </Card>
    );
}