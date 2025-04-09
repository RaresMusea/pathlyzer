import { useState } from "react";
import { cn } from "@/lib/utils";
import { ListProps } from "./list";

export type CardSpreadProps = {
    component: React.ElementType;
    rotationClass: string;
    revealClass: string;
    data: ListProps;
}

export default function CardSpread({ cards }: { cards: CardSpreadProps[] }) {
    const [isExpanded, setExpanded] = useState(false);

    return (
        <div
            className={cn(
                "group relative flex flex-col sm:flex-row md:flex-row min-h-80 min-w-52 items-center transition-all duration-500 ease-in-out",
                {
                    "origin-bottom transition-all duration-500 ease-in-out hover:-rotate-[15deg]":
                        !isExpanded,
                    "gap-3": isExpanded,
                },
            )}
        >
            {cards.map((item, index) => {
                return (
                    <div
                        key={index}
                        onClick={(e) => {
                            setExpanded(!isExpanded);
                            e.preventDefault();
                        }}
                        className={cn(
                            "transition-all duration-500 ease-in-out",
                            {
                                absolute: !isExpanded,
                                "origin-bottom": !isExpanded,
                            },
                            !isExpanded && item.rotationClass,
                            isExpanded && item.revealClass,
                        )}
                    >
                        <item.component title={item.data.title} listData={item.data.listData} />
                    </div>
                );
            })}
        </div>
    );
}