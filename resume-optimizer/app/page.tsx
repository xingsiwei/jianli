"use client"

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { JDAnalysisComponent } from "@/components/jd/JDAnalysis";
import { OptimizationResultComponent } from "@/components/optimization/OptimizationResult";
import { useResume } from "@/hooks/useResume";
import { JDAnalysis, OptimizationResult } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Home() {
  const { resume, setResume } = useResume();
  const [jdAnalysis, setJdAnalysis] = useState<JDAnalysis | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeError, setOptimizeError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("resume");

  const handleOptimize = async () => {
    if (!jdAnalysis) return;
    
    setIsOptimizing(true);
    setOptimizeError(null);
    setActiveTab("result");
    
    try {
      // Construct a summary string from JDAnalysis since we don't have the raw text here
      const jdString = `
      Title: ${jdAnalysis.title}
      Skills: ${jdAnalysis.requiredSkills.join(', ')}
      Responsibilities: ${jdAnalysis.responsibilities.join('\n')}
      Experience Level: ${jdAnalysis.experienceLevel}
      `;

       const optimizeResponse = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            resume, 
            jobDescription: jdString
        }),
      });


      if (!optimizeResponse.ok) {
        const contentType = optimizeResponse.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const data = await optimizeResponse.json();
          setOptimizeError(data?.error ?? "优化失败");
        } else {
          const text = await optimizeResponse.text();
          setOptimizeError(text || "优化失败");
        }
        return;
      }

      const data = await optimizeResponse.json();
      setOptimizationResult(data);
    } catch (error) {
      console.error('Error optimizing resume:', error);
      setOptimizeError("优化失败");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 flex items-center justify-between px-4">
            <div className="flex items-center gap-2 font-bold text-xl">
                <span>📄 简历优化助手</span>
            </div>
            <div className="flex gap-2">
                 <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> 导出PDF
                </Button>
            </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 h-[calc(100vh-73px)]">
         <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="flex justify-center mb-6">
                 <TabsList className="grid w-[400px] grid-cols-3">
                    <TabsTrigger value="resume">我的简历</TabsTrigger>
                    <TabsTrigger value="jd">职位分析</TabsTrigger>
                    <TabsTrigger value="result">优化结果</TabsTrigger>
                </TabsList>
            </div>
           
            <div className="flex-1 overflow-auto">
                 <TabsContent value="resume" className="h-full m-0">
                    <ResumeEditor resume={resume} setResume={setResume} />
                </TabsContent>
                <TabsContent value="jd" className="h-full m-0">
                    <JDAnalysisComponent jdAnalysis={jdAnalysis} setJdAnalysis={setJdAnalysis} />
                </TabsContent>
                <TabsContent value="result" className="h-full m-0">
                    <OptimizationResultComponent 
                        optimizationResult={optimizationResult} 
                        isOptimizing={isOptimizing}
                        onOptimize={handleOptimize}
                        canOptimize={!!jdAnalysis}
                        error={optimizeError}
                    />
                </TabsContent>
            </div>
         </Tabs>
      </main>
    </div>
  );
}
