"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useLessonPractice } from "@/hooks/useLessonPractice";
import { LessonPracticeDto } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Check, Edit, Eye, MoveDown, MoveUp, Plus, Trash2 } from "lucide-react";

type LessonPracticeFormProps = {
    practiceDto?: LessonPracticeDto | null;
    lessonName: string;
};

export const LessonPracticeForm = (props: LessonPracticeFormProps) => {
    const { form, activeTab, isPending, isEditing, setActiveTab, practiceItems, currentEditableItem } = useLessonPractice(props.practiceDto);

    return (
        <>
            <div className="flex items-center justify-between ml-3">
                <h1 className="text-3xl font-bold">Lesson {props.lessonName} - Practice Mode Manager</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto w-[60%] mt-6">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="editor">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </TabsTrigger>
                    <TabsTrigger value="preview">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Secțiuni</h2>
                                <Button onClick={() => { }} size="sm" variant="outline">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add practice card
                                </Button>
                            </div>

                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                                {practiceItems.map((item, index) => (
                                    <Card
                                        key={item.id}
                                        className={`${currentEditableItem?.id === item.id ? "border-blue-500 ring-1 ring-blue-500" : ""}`}
                                    >
                                        <CardHeader className="p-3">
                                            <CardTitle className="text-sm font-medium flex justify-between items-center">
                                                <span className="truncate">{item.title}</span>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, "0")}
                                                </span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardFooter className="p-3 pt-0 flex justify-between">
                                            <div className="flex space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => { }}
                                                    disabled={index === 0}
                                                >
                                                    <MoveUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => { }}
                                                    disabled={index === practiceItems.length - 1}
                                                >
                                                    <MoveDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex space-x-1">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { }}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                    onClick={() => { }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}

                                {practiceItems.length === 0 && (
                                    <div className="text-center p-4 border border-dashed rounded-lg">
                                        <p className="text-gray-500">No practice items added. Add new practice items</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <AnimatePresence mode="wait">
                                {isEditing && currentEditableItem ? (
                                    <motion.div
                                        key="editor"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Edit section</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <Form  {...form}>
                                                    <form>
                                                        <div className="space-y-2">
                                                            <FormField control={form.control} name="title" render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Practice item title</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            placeholder="Provide a title for this practice element"
                                                                            type="text"
                                                                            maxLength={100}
                                                                            disabled={isPending}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage></FormMessage>
                                                                </FormItem>
                                                            )} />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <FormField control={form.control} name="content" render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Practice item content</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea
                                                                            {...field}
                                                                            placeholder="Provide content for this practice element"
                                                                            maxLength={1000}
                                                                            disabled={isPending}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage></FormMessage>
                                                                </FormItem>
                                                            )} />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <FormField control={form.control} name="title" render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Practice item duration (seconds)</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            placeholder="Specify the duration of this element in seconds"
                                                                            type="number"
                                                                            min={10}
                                                                            max={30}
                                                                            disabled={isPending}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage></FormMessage>
                                                                </FormItem>
                                                            )} />
                                                        </div>
                                                    </form>
                                                </Form>
                                            </CardContent>
                                            <CardFooter className="flex justify-between">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                    }}
                                                >
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Save section
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="placeholder"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full flex items-center justify-center"
                                    >
                                        <div className="text-center p-8">
                                            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-700 mb-2">Practice editor</h3>
                                            <p className="text-gray-500 mb-4">Select an existing section or add a new one.</p>
                                            <Button onClick={() => { }}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add a a new practice item
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    )
}