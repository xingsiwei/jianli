"use client"

import { Resume, Skill } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface SkillsFormProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function SkillsForm({ resume, setResume }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    // Check if skill already exists
    if (resume.skills.some(s => s.name.toLowerCase() === newSkill.toLowerCase())) {
        setNewSkill('');
        return;
    }

    const skill: Skill = {
      name: newSkill.trim(),
      level: 'intermediate'
    };

    setResume({
      ...resume,
      skills: [...resume.skills, skill]
    });
    setNewSkill('');
  };

  const removeSkill = (index: number) => {
    setResume({
      ...resume,
      skills: resume.skills.filter((_, i) => i !== index)
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>技能</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            value={newSkill} 
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入技能名称并回车..."
          />
          <Button onClick={addSkill}>
            <Plus className="mr-2 h-4 w-4" /> 添加
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2">
              {skill.name}
              <button 
                onClick={() => removeSkill(index)}
                className="hover:text-destructive focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {resume.skills.length === 0 && (
            <p className="text-muted-foreground text-sm">暂无技能，请添加。</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
