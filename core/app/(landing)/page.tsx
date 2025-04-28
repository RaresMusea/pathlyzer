import { auth } from "@/auth";
import { Homepage } from "@/components/hero-section/Homepage";

export default async function Home() {
  const session = await auth();

  return (
    <Homepage session={session}/>
  );
}