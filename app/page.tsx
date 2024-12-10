import Image from "next/image";
import image from "@/resources/security.svg"
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@/components/authentication/SignUpButton";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() {
  return (
    <main className="flex h-full flex-col align-center justify-center">
      <h1 className={cn("text-center font-extrabold text-6xl drop-shadow-md", font.className)}>Authenticator</h1>
      <div className="flex flex-col align-center justify-center mt-10">
        <Image src={image} alt="Opening image" width={400} height={400} className="m-auto" />
      </div>
      <div className="w-[50%] mx-auto text-center mt-6">
        <SignUpButton mode={"redirect"}>
          <Button size="lg" className="drop-shadow-md">
            Sign In
          </Button>
        </SignUpButton>
      </div>
    </main>
  );
}