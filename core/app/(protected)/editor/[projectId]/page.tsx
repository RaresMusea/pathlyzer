import { EditorComponentWrapper } from "@/components/code-editor/EditorComponentWrapper";

async function CodeEditorPage({ params }: {
    params: Promise<{ projectId: string }>
}) {

    const projectId: string = decodeURIComponent((await params).projectId);

    return (
        <EditorComponentWrapper projectId={projectId}/>
    )
}

export default CodeEditorPage;