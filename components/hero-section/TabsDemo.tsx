"use client";
 
import Image from "next/image";
import { Tabs } from "../ui/tabs";
import { CodeBlockDemo } from "./CodeBlockDemo";
import { cCodeSnippet, cppCodeSnippet, cSharpCodeSnippet, javaCodeSnippet, pythonScript, typeScriptCodeSnippet } from "@/lib/CodeSnippets";
import "@/app/globals.css";
 
export function TabsDemo() {
  const tabs = [
    {
      title: "Python",
      value: "python",
      content: (
        <div className="w-50 scrollbar-hide overflow-scroll relative h-[35rem] rounded-2xl p-2 shadow-md text-xl md:text-4xl font-bold text-white bg-[#1D63ED] dark:bg-[#00084D]">
            <CodeBlockDemo programmingLanguage="python" code={pythonScript} fileName="server.py" />
        </div>
      ),
    },
    {
      title: "Java",
      value: "java",
      content: (
        <div className="w-50 scrollbar-hide overflow-scroll relative h-[35rem] rounded-2xl p-2 text-xl md:text-4xl font-bold text-white bg-[#1D63ED] dark:bg-[#00084D]">
          <CodeBlockDemo programmingLanguage="java" code={javaCodeSnippet} fileName="WebServer.java" />
        </div>
      ),
    },
    {
      title: "C#",
      value: "c-sharp",
      content: (
        <div className="w-50 overflow-scroll scrollbar-hide relative h-[35rem] rounded-2xl p-2 text-xl md:text-4xl font-bold text-white bg-[#1D63ED] dark:bg-[#00084D]">
          <CodeBlockDemo programmingLanguage="csharp" code={cSharpCodeSnippet} fileName="SimpleWebServer.cs" />
        </div>
      ),
    },
    {
      title: "TypeScript",
      value: "typescript",
      content: (
        <div className="w-50 overflow-scroll scrollbar-hide relative h-[35rem] rounded-2xl p-2 text-xl md:text-4xl font-bold text-white bg-[#1D63ED] dark:bg-[#00084D]">
          <CodeBlockDemo programmingLanguage="typescript" code={typeScriptCodeSnippet} fileName="server.ts" />
        </div>
      ),
    },
    {
      title: "C",
      value: "c",
      content: (
        <div className="w-50 overflow-scroll scrollbar-hide relative h-[35rem] rounded-2xl p-2 text-xl md:text-4xl font-bold text-white bg-[#1D63ED] dark:bg-[#00084D]">
            <CodeBlockDemo programmingLanguage="c" code={cCodeSnippet} fileName="server.c" />
        </div>
      ),
    },
    {
        title: "C++",
        value: "cpp",
        content: (
            <div className="w-50 overflow-scroll scrollbar-hide relative h-[35rem] rounded-2xl p-2 text-xl md:text-4xl font-bold text-white bg-[#1D63ED] dark:bg-[#00084D]">
            <CodeBlockDemo programmingLanguage="cpp" code={cppCodeSnippet} fileName="server.cpp" />
        </div>
        )
    }
  ];
 
  return (
    <div className="h-[40rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-3xl mx-auto w-full items-start justify-start my-20">
      <Tabs tabs={tabs} />
    </div>
  );
}
 
const DummyContent = () => {
  return (
    <Image
      src="/linear.webp"
      alt="dummy image"
      width="1000"
      height="1000"
      className="object-cover object-left-top h-[60%] md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};