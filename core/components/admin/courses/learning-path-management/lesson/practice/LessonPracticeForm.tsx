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
import { BookOpen, Check, Clock, Edit, Eye, MoveDown, MoveUp, Plus, Save, Trash2 } from "lucide-react";

type LessonPracticeFormProps = {
    practiceDto?: LessonPracticeDto | null;
    lessonName: string;
};

export const LessonPracticeForm = (props: LessonPracticeFormProps) => {
    const {
        form,
        activeTab,
        addItem,
        deleteItem,
        isPending,
        isEditing,
        moveItemDown,
        moveItemUp,
        cancelSelection,
        setActiveTab,
        updatePracticeItem,
        startEditing,
        practiceItems,
        currentEditableItem,
    } = useLessonPractice(props.practiceDto);

    const totalDuration = practiceItems.reduce((sum, section) => sum + section.duration, 0)
    const formattedTotalDuration = `${Math.floor(totalDuration / 60)}:${(totalDuration % 60).toString().padStart(2, "0")}`

    return (
        <>
            <div className="flex justify-between items-center ml-3">
                <h1 className="text-3xl font-bold">
                    Lesson {props.lessonName} - Practice Mode Manager
                </h1>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Total duration: {formattedTotalDuration}</span>
                    <Button onClick={() => { }} className="bg-[var(--pathlyzer)] hover:bg-[var(--pathlyzer-table-border)] text-semibold text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-6xl w-full px-4 mt-6">
                <TabsList className="grid grid-cols-2 gap-2 mb-6">
                    <TabsTrigger value="edit">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </TabsTrigger>
                    <TabsTrigger value="preview">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="max-w-6xl w-full mx-auto px-4 space-y-6">
                    <div className="mx-auto w-full max-w-4xl grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Practice mode cards</h2>
                                <Button onClick={addItem} size="sm" variant="outline">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add practice card
                                </Button>
                            </div>

                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                                {practiceItems.map((item, index) => (
                                    <Card
                                        key={item.id}
                                        className={`${currentEditableItem?.id === item.id ? "border-[var(--pathlyzer-table-border)] ring-1 ring-[var(--pathlyzer-table-border)]" : ""}`}
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
                                                    onClick={() => { moveItemUp(index) }}
                                                    disabled={index === 0}
                                                >
                                                    <MoveUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => { moveItemDown(index) }}
                                                    disabled={index === practiceItems.length - 1}
                                                >
                                                    <MoveDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex space-x-1">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { startEditing(item) }}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                    onClick={() => deleteItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}

                                {practiceItems.length === 0 && (
                                    <div className="text-center p-4 border border-dashed rounded-lg">
                                        <p className="text-gray-500">
                                            No practice items added. Add new practice items
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
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
                                                <CardTitle>Edit practice item</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <Form {...form}>
                                                    <form>
                                                        <div className="mt-3">
                                                            <FormField control={form.control} name="title" render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Practice item title</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            onChange={(e) => {
                                                                                field.onChange(e);

                                                                                if (currentEditableItem) {
                                                                                    updatePracticeItem(currentEditableItem.id, { title: e.target.value });
                                                                                }
                                                                            }}
                                                                            placeholder="Provide a title for this practice element"
                                                                            type="text"
                                                                            maxLength={100}
                                                                            disabled={isPending}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )} />
                                                        </div>

                                                        <div className="mt-3">
                                                            <FormField control={form.control} name="content" render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Practice item content</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea
                                                                            {...field}
                                                                            onChange={(e) => {
                                                                                field.onChange(e);

                                                                                if (currentEditableItem) {
                                                                                    updatePracticeItem(currentEditableItem.id, { content: e.target.value });
                                                                                }
                                                                            }}
                                                                            placeholder="Provide content for this practice element"
                                                                            maxLength={1000}
                                                                            disabled={isPending}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )} />
                                                        </div>

                                                        <div className="mt-3">
                                                            <FormField control={form.control} name="duration" render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Practice item duration (seconds)</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            placeholder="Specify the duration of this element in seconds"
                                                                            type="number"
                                                                            onChange={(e) => {
                                                                                field.onChange(e);

                                                                                if (currentEditableItem) {
                                                                                    updatePracticeItem(currentEditableItem.id, { duration: parseInt(e.target.value) });
                                                                                }
                                                                            }}
                                                                            min={10}
                                                                            max={30}
                                                                            disabled={isPending}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )} />
                                                        </div>
                                                    </form>
                                                </Form>
                                            </CardContent>
                                            <CardFooter className="flex justify-between">
                                                <Button variant="outline" onClick={cancelSelection}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={cancelSelection}>
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
                                            <h3 className="text-lg font-medium text-gray-700 mb-2">
                                                Practice editor
                                            </h3>
                                            <p className="text-gray-500">
                                                Select an existing section or add a new one from the left panel.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="preview">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Lesson Practice Preview</span>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>Total duration: {formattedTotalDuration}</span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {practiceItems.length > 0 ? (
                                    practiceItems.map((item, index) => (
                                        <div key={item.id} className="border rounded-lg p-6">
                                            <div className="flex items-center mb-4">
                                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                                    <BookOpen className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
                                                    <p className="text-sm text-gray-500">
                                                        Item {index + 1} out of {practiceItems.length} • {Math.floor(item.duration / 60)}:
                                                        {(item.duration % 60).toString().padStart(2, "0")}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="prose prose-lg max-w-none">
                                                <p className="text-gray-700 leading-relaxed text-lg">{item.content}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center p-12">
                                        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-700 mb-2">No practice cards available</h3>
                                        <p className="text-gray-500 mb-4">Add practice cards in order to view their previews.</p>
                                        <Button onClick={() => setActiveTab("edit")}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Back to editor
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    );
};
