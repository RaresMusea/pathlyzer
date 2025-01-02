import { AuthImageLogo } from "@/components/authentication/AuthImageLogo";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="flex h-[700px] items-center justify-center">
                <div className={cn("flex flex-col gap-2 sm:w-9/12 md:w-9/12 lg:w-9/12 xl:w-7/12")}>
                    <Card className="overflow-hidden w-full">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            {children}
                            <AuthImageLogo />
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="text-balance my-10 text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </>
    );
}

export default AuthenticationLayout;