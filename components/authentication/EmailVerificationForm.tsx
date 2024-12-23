"use client";

import { CardWrapper } from "../CardWrapper";
import { FormSuccess } from "../FormSuccess";
import { FormError } from "../FormError";
import { BeatLoader } from 'react-spinners';
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { verifiyEmail } from "@/actions/EmailVerification";

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
        <CardWrapper headerName="Confirming your email verification"
            backButtonHref="/login"
            backButtonText="Back to Login">
            <div className="flex items-center w-full justify-center">
                {
                    !success && !error && (<BeatLoader />)
                }
                <FormSuccess message={success} hasCloseButton={false} />
                {
                    !success && 
                    ( <FormError message={error} hasCloseButton={false} /> )
                }
            </div>
        </CardWrapper>
    )
}