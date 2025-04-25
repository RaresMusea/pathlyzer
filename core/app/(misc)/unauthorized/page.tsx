import { AnimatedShield } from "@/components/misc/unauthorized/AnimatedShield";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedAccessPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background/60 font-nunito">
            <div className="mx-auto max-w-md text-center">
                <div className="mb-4 flex justify-center">
                    <AnimatedShield />
                </div>
                <h1 className="mb-2 text-3xl font-bold text-red-600">Unauthorized Access</h1>
                <p className="mb-6 text-gray-600">
                    You do not have the necessary permission to access this page. This area is reserved for administrators.
                </p>
                <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                    <Link href="/">Back home</Link>
                </Button>
            </div>
        </div>
    )
}