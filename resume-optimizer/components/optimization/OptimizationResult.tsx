"use client"

import { OptimizationResult, Resume } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, Loader2 } from "lucide-react";

interface OptimizationResultProps {
  optimizationResult: OptimizationResult | null;
  isOptimizing: boolean;
  onOptimize: () => void;
  canOptimize: boolean;
  error?: string | null;
}

export function OptimizationResultComponent({ optimizationResult, isOptimizing, onOptimize, canOptimize, error }: OptimizationResultProps) {
    if (!optimizationResult && !isOptimizing) {
        return (
             <div className="flex flex-col items-center justify-center h-full space-y-4">
                <p className="text-muted-foreground">请先完善简历并完成职位分析，然后点击下方按钮开始优化。</p>
                <Button onClick={onOptimize} disabled={!canOptimize}>
                    开始优化简历
                </Button>
                {error && <div className="text-sm text-destructive">{error}</div>}
            </div>
        )
    }

    if (isOptimizing) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>AI正在优化您的简历，请稍候...</p>
            </div>
        )
    }

    if (!optimizationResult) return null;

    const { optimized, atsReport, reasoning } = optimizationResult;
    const optimizedResume: Resume = {
        ...optimizationResult.original,
        basics: {
            ...optimizationResult.original.basics,
            summary: optimized.basics.summary
        },
        work: optimizationResult.original.work.map(w => {
            const optW = optimized.work.find(ow => ow.id === w.id);
            return optW ? { ...w, highlights: optW.highlights } : w;
        }),
        skills: optimized.skills
    };

  return (
    <div className="space-y-4 h-full">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">优化结果</h2>
            <div className="flex gap-2">
                <Button variant="default">
                    <Save className="mr-2 h-4 w-4" /> 保存版本
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>优化控制面板</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <h4 className="font-semibold">ATS评分</h4>
                        <div className="flex items-center gap-2">
                             <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${atsReport.score}%` }} />
                             </div>
                             <span className="text-sm font-bold">{atsReport.score}分</span>
                        </div>
                        <p className="text-xs text-muted-foreground">关键词覆盖率: {atsReport.keywordCoverage}%</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold">匹配关键词</h4>
                         <div className="flex flex-wrap gap-1">
                            {atsReport.matchedKeywords.map((kw, i) => (
                                <Badge key={i} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">{kw}</Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold">缺失关键词</h4>
                         <div className="flex flex-wrap gap-1">
                            {atsReport.missingKeywords.map((kw, i) => (
                                <Badge key={i} variant="outline" className="border-red-200 text-red-800">{kw}</Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                         <h4 className="font-semibold">优化理由</h4>
                         <p className="text-sm text-muted-foreground">{reasoning}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-2 bg-slate-50">
                <CardContent className="p-8 min-h-[600px] bg-white shadow-sm m-4 rounded-sm">
                    <div className="space-y-6">
                        <div className="text-center space-y-2 border-b pb-4">
                            <h1 className="text-2xl font-bold">{optimizedResume.basics.name}</h1>
                            <p className="text-sm text-muted-foreground">
                                {optimizedResume.basics.email} | {optimizedResume.basics.phone} | {optimizedResume.basics.location?.city}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold border-b pb-1 uppercase text-sm">个人总结</h3>
                            <p className="text-sm leading-relaxed">{optimizedResume.basics.summary}</p>
                        </div>

                         <div className="space-y-4">
                            <h3 className="font-bold border-b pb-1 uppercase text-sm">工作经历</h3>
                            {optimizedResume.work.map((work) => (
                                <div key={work.id} className="space-y-1">
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="font-bold text-sm">{work.company}</h4>
                                        <span className="text-xs text-muted-foreground">{work.startDate} - {work.endDate}</span>
                                    </div>
                                    <p className="text-sm font-medium italic">{work.position}</p>
                                    <ul className="list-disc pl-5 text-sm space-y-1">
                                        {work.highlights.map((h, i) => (
                                            <li key={i}>{h}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                         <div className="space-y-4">
                            <h3 className="font-bold border-b pb-1 uppercase text-sm">技能</h3>
                            <div className="flex flex-wrap gap-2">
                                {optimizedResume.skills.map((skill, i) => (
                                    <span key={i} className="text-sm bg-slate-100 px-2 py-1 rounded">{skill.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
