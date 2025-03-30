import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const EmailVerificationLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-center w-full xl-w-[60%">
            <div className="flex w-full xl:w-[60%] h-auto items-center justify-center font-nunito">
                <div className={cn("flex flex-col w-full sm:w-5/12 md:w-5/12 lg:w-9/12 xl:w-8/12")}>
                    <Card className="overflow-hidden w-full">
                        <CardContent className={`p-3`}>
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationLayout;