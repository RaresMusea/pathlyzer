"use client";

export const AdminUnitBanner = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className="w-full rounded-xl p-5 dark:text-white flex items-center shadow-xl justify-between transition-colors bg-[var(--pathlyzer-table-border)] text-white">
            <div className="space-y-2.5">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-md">{description}</p>
            </div>
        </div>
    )
}