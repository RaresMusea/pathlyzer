import LoadingScreen from "@/app/(protected)/(appl)/projects/loading";
import { ResetPasswordForm } from "@/components/authentication/ResetPasswordForm";
import { Suspense } from "react";

const ResetPasswordPage = () => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <ResetPasswordForm />
        </Suspense>
    );
};

export default ResetPasswordPage;