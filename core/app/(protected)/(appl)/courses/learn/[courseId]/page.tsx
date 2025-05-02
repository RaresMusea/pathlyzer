import { getUnits } from "@/app/service/learning/units/unitsService";
import { Unit } from "@/components/learning/courses/unit/Unit";
import { PageTransition } from "@/components/misc/animations/PageTransition";

export default async function CoursePathPage({ params, }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const units = await getUnits(courseId);

    return (
        <PageTransition>
            <div>
                {units.map((unit) => (
                    <div key={unit.id} className="mb-10">
                        <Unit unit={unit}/>
                    </div>
                ))}
            </div>
        </PageTransition>
    );
}