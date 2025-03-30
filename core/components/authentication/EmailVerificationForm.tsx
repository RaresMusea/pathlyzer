"use client";

import { BeatLoader } from 'react-spinners';
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { verifiyEmail } from "@/actions/EmailVerification";
import { AlertType, AuthAlert } from "./Alerts";
import Link from "next/link";

export const EmailVerificationForm = () => {
    const searchParams: ReadonlyURLSearchParams = useSearchParams();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const token: string = searchParams.get("token") || "";


    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("The token is missing!");
        }

        verifiyEmail(token)
            .then((data) => {
                if ('success' in data) {
                    setSuccess(data.success);
                }
                if ('error' in data) {
                    setError(data.error);
                }
            })
            .catch(err => {
                setError(`Something went wrong while attempting to verify your email: ${err}.`);
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        // <CardWrapper headerName="Confirming your email verification"
        //     backButtonHref="/login"
        //     backButtonText="Back to Login">
        //     <div className="flex items-center w-full justify-center">
        //         {
        //             !success && !error && (<BeatLoader />)
        //         }
        //         <FormSuccess message={success} hasCloseButton={false} />
        //         {
        //             !success && 
        //             ( <FormError message={error} hasCloseButton={false} /> )
        //         }
        //     </div>
        // </CardWrapper>


        <div className="flex flex-col gap-6 mt-4">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome!</h1>
                <p className="text-balance text-muted-foreground">
                    Email verification check
                </p>
            </div>
            <div className="grid gap-2">
                <div className="flex items-center w-full justify-center">
                    {
                        !success && !error && (<BeatLoader />)
                    }

                </div>
                <AuthAlert message={success} type={AlertType.SUCCESS} />
                {
                    !success &&
                    (<AuthAlert message={error} type={AlertType.ERROR} />)
                }
            </div>
            <div className="text-center text-sm mb-6">
                <Link href="/login" className="underline underline-offset-4">
                    Back to login
                </Link>
            </div>
            </div>
            );
}