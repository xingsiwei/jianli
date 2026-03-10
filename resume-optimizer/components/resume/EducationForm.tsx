"use client"

import { Resume, Education } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface EducationFormProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function EducationForm({ resume, setResume }: EducationFormProps) {
  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      institution: '',
      area: '',
      studyType: '',
      startDate: '',
      endDate: ''
    };
    setResume({
      ...resume,
      education: [...resume.education, newEdu]
    });
  };

  const removeEducation = (id: string) => {
    setResume({
      ...resume,
      education: resume.education.filter(e => e.id !== id)
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResume({
      ...resume,
      education: resume.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  return (
    <div className="space-y-4">
      {resume.education.map((edu) => (
        <Card key={edu.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              {edu.institution || '新教育经历'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>学校名称</Label>
                <Input 
                  value={edu.institution} 
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="学校名称"
                />
              </div>
              <div className="space-y-2">
                <Label>专业</Label>
                <Input 
                  value={edu.area} 
                  onChange={(e) => updateEducation(edu.id, 'area', e.target.value)}
                  placeholder="专业名称"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>学历</Label>
                <Input 
                  value={edu.studyType} 
                  onChange={(e) => updateEducation(edu.id, 'studyType', e.target.value)}
                  placeholder="本科/硕士/博士"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>开始时间</Label>
                    <Input 
                      value={edu.startDate} 
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      placeholder="YYYY-MM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>结束时间</Label>
                    <Input 
                      value={edu.endDate} 
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      placeholder="YYYY-MM"
                    />
                  </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addEducation} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> 添加教育经历
      </Button>
    </div>
  );
}
