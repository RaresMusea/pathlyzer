import { ChangePasswordForm } from "@/components/authentication/ChangePasswordForm";
import { Suspense } from "react";

const ChangePasswordPage = () => {
    return (
        <Suspense>
            <ChangePasswordForm />
        </Suspense>
    );
};

export default ChangePasswordPage;