import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IFile, Type } from "@/types/types"
import { Input } from "@/components/ui/input";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React from "react";
import { DirectoryCreationSchema, FileCreationSchema } from "@/schemas/EntityCreationValidation";

export enum ModalType {
    FILE_MANAGER_DELETE,
    FILE_MANAGER_CREATE_FILE,
    FILE_MAANGER_CREATE_DIR
}

interface ModalProps {
    type: Type;
    onClick?: () => void;
    onClose: () => void;
}

interface DeletionModalProps extends ModalProps {
    target: IFile | undefined;
}

interface CreationModalProps extends ModalProps {
    parent: string | undefined;
    handleCreation: (name: string, parent: string, type: Type) => void;
}

export const DeletionModal: React.FC<DeletionModalProps> = ({ target, type, onClick, onClose }) => {
    return (
        <>
            <DialogContent className="border-none shadow-lg">
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    {
                        type === Type.DIRECTORY &&
                        <DialogDescription>
                            This action cannot be undone. Are you sure you want to permanently
                            delete directory <code>{target?.path}</code> along with all of its contents?
                        </DialogDescription>
                    }
                    {
                        type === Type.FILE &&
                        <DialogDescription>
                            This action cannot be undone. Are you sure you want to permanently
                            delete file <code>{target?.path}</code>?
                        </DialogDescription>
                    }
                </DialogHeader>
                <DialogFooter>
                    <Button className="text-white bg-red-500 outline-none border-none hover:bg-red-700" type="submit" onClick={onClick}>Delete {type === Type.FILE ? 'file' : 'directory'}</Button>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </>
    )
}

export const CreationModal: React.FC<CreationModalProps> = ({ handleCreation, parent, type, onClose }) => {
    const entityType: string = type === Type.FILE ? 'file' : 'directory';
    const schema = type === Type.FILE ? FileCreationSchema : DirectoryCreationSchema;

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            newName: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof schema>) => {
        const payload = { ...values, parentDir: parent };
        handleCreation(payload.newName, payload.parentDir!, type);
        onClose();
    };

    return (
        <>
            <Form {...form}>
                <DialogContent className="border-none shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Create a new {entityType}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        A new file will be created under <code>{parent}.</code>
                    </DialogDescription>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="newName" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-normal">
                                    Please specify the new {entityType} name.
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        placeholder={entityType === "file" ? entityType + "Name.extension" : entityType + "Name"}
                                        className="mt-1 border bg-[#c4c4c4] border-gray-500 shadow-sm outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#00084D]"
                                        autoFocus
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter className="mt-3">
                            <Button className="bg-[#00084D] hover:bg-[#1D63ED]" type="submit">Create</Button>
                            <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Form>
        </>
    );
}