import { auth } from "@/auth";
import { LoadingSpinner } from "@/components/misc/animations/LoadingSpinner";
import { redirect } from "next/navigation";

export default async function ManageCoursesPage() {
    const session = await auth();

    if (session?.user.role !== "ADMINISTRATOR") {
        redirect("/unauthorized")
    };

    return (
       <div></div> 
    )
}

function LoadingTableSkeleton() {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-muted-foreground">Se încarcă cursurile...</p>
      </div>
    )
  }