import CardSpread, { CardSpreadProps } from "../ui/card-spread";
import List, { ListProps } from "../ui/list";


function Card({ title, listData }: ListProps) {
    return (
        <List
            title={title}
            listData={listData}
        />
    );
}

const cards: CardSpreadProps[] = [
    {
        component: Card,
        data: {
            title: "Structured learning", listData: [
                {
                    entry: "Start with beginner-friendly courses.",
                    checked: true
                },
                {
                    entry: "Progress through milestones with interactive quizzes.",
                    checked: true
                },
                {
                    entry: "Learn at your own pace with guided paths.",
                    checked: true
                }
            ]
        },
        rotationClass: "",
        revealClass: "-rotate-[2deg]",
    },
    {
        component: Card,
        data: {
            title: "Rewarding experience", listData: [
                {
                    entry: "Complete lessons to unlock new rewards.",
                    checked: true,
                },
                {
                    entry: "Progress through paths by achieving milestones.",
                    checked: true,
                },
                {
                    entry: "Stay motivated as each step brings you closer to mastery.",
                    checked: true,
                },
            ]
        },
        rotationClass: "group-hover:rotate-[15deg]",
        revealClass: "rotate-[3deg] translate-y-2",
    },
    {
        component: Card,
        data: {
            title: "Integrated Code Editor", listData: [
                {
                    entry: "Write and run code in the browser.",
                    checked: true,
                },
                {
                    entry: "Access a fully featured editor for real-time practice.",
                    checked: true,
                },
                {
                    entry: "No installations needed — just start coding.",
                    checked: true,
                },
                {
                    entry: "Real time persistency of your code snippets.",
                    checked: true,
                },
            ]
        },
        rotationClass: "group-hover:rotate-[30deg]",
        revealClass: "-rotate-[2deg] translate-x-1",
    },
    {
        component: Card,
        data: {
            title: "Competitive environment", listData: [
                {
                    entry: "Compete with peers and track your rank.",
                    checked: true,
                },
                {
                    entry: "Earn points for completing lessons and quizzes.",
                    checked: true,
                },
                {
                    entry: "Challenge yourself to reach the top and showcase your skills.",
                    checked: true,
                },
            ]
        },
        rotationClass: "group-hover:rotate-[45deg]",
        revealClass: "rotate-[2deg]",
    },
];

export const SpreadableCards = () => {
    return (
        <CardSpread cards={cards} />
    );
};