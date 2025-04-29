import { LoginForm } from "@/components/authentication/LoginForm";
import { Suspense } from "react";

const LoginPage = () => {

    return (
        <Suspense>
            <LoginForm />
        </Suspense>

    );
}

export default LoginPage;