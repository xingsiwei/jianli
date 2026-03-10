"use client"

import { useState } from "react";
import { JDAnalysis } from "@/types/resume";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface JDAnalysisProps {
  jdAnalysis: JDAnalysis | null;
  setJdAnalysis: (analysis: JDAnalysis) => void;
}

export function JDAnalysisComponent({ jdAnalysis, setJdAnalysis }: JDAnalysisProps) {
  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-jd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription: jdText }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const data = await response.json();
          setError(data?.error ?? "分析失败");
        } else {
          const text = await response.text();
          setError(text || "分析失败");
        }
        return;
      }

      const data = await response.json();
      setJdAnalysis(data);
    } catch (error) {
      console.error('Error analyzing JD:', error);
      setError("分析失败");
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const exampleJDs = [
    { label: "产品经理", text: "负责产品规划、需求分析..." },
    { label: "前端开发", text: "熟练掌握React, TypeScript..." },
  ];

  return (
    <div className="space-y-4 h-full">
        <h2 className="text-2xl font-bold tracking-tight">职位分析</h2>
        
        <Card>
            <CardContent className="pt-6 space-y-4">
                <Textarea 
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="请粘贴职位描述内容..."
                    className="min-h-[200px]"
                />
                
                <div className="flex gap-2">
                    {exampleJDs.map((ex, i) => (
                        <Button 
                            key={i} 
                            variant="outline" 
                            size="sm"
                            onClick={() => setJdText(ex.text)}
                        >
                            {ex.label}
                        </Button>
                    ))}
                </div>

                <Button onClick={handleAnalyze} disabled={isLoading || !jdText.trim()} className="w-full">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            分析中...
                        </>
                    ) : (
                        "开始分析"
                    )}
                </Button>

                {error && (
                    <div className="text-sm text-destructive">
                        {error}
                    </div>
                )}
            </CardContent>
        </Card>

        {jdAnalysis && (
            <Card>
                <CardHeader>
                    <CardTitle>分析结果：{jdAnalysis.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-semibold">核心技能</h4>
                            <div className="flex flex-wrap gap-1">
                                {jdAnalysis.requiredSkills.map((skill, i) => (
                                    <Badge key={i} variant="default">{skill}</Badge>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold">经验要求</h4>
                            <p className="text-sm">{jdAnalysis.experienceLevel}</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold">ATS关键词</h4>
                             <div className="flex flex-wrap gap-1">
                                {jdAnalysis.atsKeywords.map((kw, i) => (
                                    <Badge key={i} variant="outline">{kw}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-semibold">职责描述</h4>
                        <ul className="list-disc pl-5 text-sm">
                            {jdAnalysis.responsibilities.map((res, i) => (
                                <li key={i}>{res}</li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
