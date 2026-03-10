"use client"

import { Resume } from "@/types/resume";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicsForm } from "./BasicsForm";
import { WorkExperienceForm } from "./WorkExperienceForm";
import { EducationForm } from "./EducationForm";
import { SkillsForm } from "./SkillsForm";

interface ResumeEditorProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function ResumeEditor({ resume, setResume }: ResumeEditorProps) {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">我的简历</h2>
      </div>
      
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basics">基本信息</TabsTrigger>
          <TabsTrigger value="work">工作经历</TabsTrigger>
          <TabsTrigger value="education">教育背景</TabsTrigger>
          <TabsTrigger value="skills">技能</TabsTrigger>
        </TabsList>
        <TabsContent value="basics" className="mt-4">
          <BasicsForm resume={resume} setResume={setResume} />
        </TabsContent>
        <TabsContent value="work" className="mt-4">
          <WorkExperienceForm resume={resume} setResume={setResume} />
        </TabsContent>
        <TabsContent value="education" className="mt-4">
          <EducationForm resume={resume} setResume={setResume} />
        </TabsContent>
        <TabsContent value="skills" className="mt-4">
          <SkillsForm resume={resume} setResume={setResume} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
