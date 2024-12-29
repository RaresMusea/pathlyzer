import { Header } from "./Header";
import { BackButton } from "./BackButton";
import errorImage from "@/resources/error.svg"
import Image from "next/image";

import {
    Card,
    CardFooter,
    CardHeader
} from '@/components/ui/card';

export const ErrorCard = () => {
    return (
        <Card className="w-[700px] shadow-md ">
            <CardHeader>
                <Header headerTitle="Something went wrong while trying to sign you in!"></Header>
                <div className="flex items-center justify-center gap-5">
                    <Image src={errorImage} alt="Error image" width={400} height={400} />
                </div>
            </CardHeader>
            <CardFooter>
                <BackButton backButtonText="Back to Login page" backButtonHref="/login" />
            </CardFooter>
        </Card>
    );
}
