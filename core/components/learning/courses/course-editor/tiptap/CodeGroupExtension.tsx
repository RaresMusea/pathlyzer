import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { CodeGroup } from './CodeGroup'

export const CodeGroupExtension = Node.create({
    name: 'codeGroup',
    group: 'block',
    content: 'codeBlock*',
    atom: false,

    parseHTML() {
        return [{ tag: 'div[data-code-tabs]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-code-tabs': 'true' }), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(CodeGroup, {as: 'div'});
    },
})