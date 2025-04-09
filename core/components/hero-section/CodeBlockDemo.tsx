"use client";
 
import React from "react";
 
import { CodeBlock } from "@/components/ui/code-block";
 
interface CodeBlockProps {
    programmingLanguage: string;
    code: string;
    fileName: string;
}

export function CodeBlockDemo({programmingLanguage, code, fileName}: CodeBlockProps) { 
  return (
    <div className="max-w-3xl mx-auto w-full">
      <CodeBlock
        language={programmingLanguage}
        filename={fileName}
        code={code}
      />
    </div>
  );
}