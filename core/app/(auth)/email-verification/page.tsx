import LoadingScreen from "@/app/(protected)/(appl)/projects/loading";
import { EmailVerificationForm } from "@/components/authentication/EmailVerificationForm";
import { Suspense } from "react";

const EmailVerificationPage = () => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <EmailVerificationForm />
        </Suspense>
    );
}

export default EmailVerificationPage;