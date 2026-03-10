"use client"

import { Resume, WorkExperience } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface WorkExperienceFormProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function WorkExperienceForm({ resume, setResume }: WorkExperienceFormProps) {
  const addExperience = () => {
    const newWork: WorkExperience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      highlights: ['']
    };
    setResume({
      ...resume,
      work: [...resume.work, newWork]
    });
  };

  const removeExperience = (id: string) => {
    setResume({
      ...resume,
      work: resume.work.filter(w => w.id !== id)
    });
  };

  const updateExperience = <K extends keyof WorkExperience>(id: string, field: K, value: WorkExperience[K]) => {
    setResume({
      ...resume,
      work: resume.work.map(w => w.id === id ? { ...w, [field]: value } : w)
    });
  };
  
  const updateHighlight = (workId: string, index: number, value: string) => {
     setResume({
      ...resume,
      work: resume.work.map(w => {
          if (w.id !== workId) return w;
          const newHighlights = [...w.highlights];
          newHighlights[index] = value;
          return { ...w, highlights: newHighlights };
      })
    });
  }

  const addHighlight = (workId: string) => {
      setResume({
      ...resume,
      work: resume.work.map(w => {
          if (w.id !== workId) return w;
          return { ...w, highlights: [...w.highlights, ''] };
      })
    });
  }

  const removeHighlight = (workId: string, index: number) => {
      setResume({
      ...resume,
      work: resume.work.map(w => {
          if (w.id !== workId) return w;
          return { ...w, highlights: w.highlights.filter((_, i) => i !== index) };
      })
    });
  }

  return (
    <div className="space-y-4">
      {resume.work.map((work) => (
        <Card key={work.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              {work.company || '新工作经历'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => removeExperience(work.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>公司名称</Label>
                <Input 
                  value={work.company} 
                  onChange={(e) => updateExperience(work.id, 'company', e.target.value)}
                  placeholder="公司名称"
                />
              </div>
              <div className="space-y-2">
                <Label>职位</Label>
                <Input 
                  value={work.position} 
                  onChange={(e) => updateExperience(work.id, 'position', e.target.value)}
                  placeholder="职位名称"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>开始时间</Label>
                <Input 
                  value={work.startDate} 
                  onChange={(e) => updateExperience(work.id, 'startDate', e.target.value)}
                  placeholder="YYYY-MM"
                />
              </div>
              <div className="space-y-2">
                <Label>结束时间</Label>
                <Input 
                  value={work.endDate} 
                  onChange={(e) => updateExperience(work.id, 'endDate', e.target.value)}
                  placeholder="YYYY-MM (或至今)"
                />
              </div>
            </div>
            
             <div className="space-y-2">
                <Label>职责亮点</Label>
                {work.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                        <Input 
                            value={highlight}
                            onChange={(e) => updateHighlight(work.id, index, e.target.value)}
                            placeholder="描述您的主要职责和成就..."
                        />
                         <Button variant="ghost" size="icon" onClick={() => removeHighlight(work.id, index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addHighlight(work.id)} className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" /> 添加职责
                </Button>
             </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addExperience} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> 添加工作经历
      </Button>
    </div>
  );
}
