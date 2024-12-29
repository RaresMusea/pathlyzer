import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import React from "react";

interface OtpInputProps {
    maxLength: number;
    pattern: string;
    useSeparators: boolean;
}

export const OtpInput = ({ maxLength, pattern, useSeparators }: OtpInputProps) => {
    return (
        <InputOTP maxLength={maxLength} pattern={pattern}>
            <InputOTPGroup>
                {Array.from({ length: maxLength }).map((_, index) => (
                    <React.Fragment key={index}>
                        <InputOTPSlot index={index} />
                        {useSeparators && index < maxLength - 1 && <InputOTPSeparator />}
                    </React.Fragment>
                ))}
            </InputOTPGroup>
        </InputOTP>
    );
};