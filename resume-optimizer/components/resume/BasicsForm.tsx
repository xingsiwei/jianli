"use client"

import { Resume } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BasicsFormProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function BasicsForm({ resume, setResume }: BasicsFormProps) {
  const handleChange = (field: string, value: string) => {
    setResume({
      ...resume,
      basics: {
        ...resume.basics,
        [field]: value
      }
    });
  };

  const handleLocationChange = (field: string, value: string) => {
    setResume({
      ...resume,
      basics: {
        ...resume.basics,
        location: {
          ...resume.basics.location || { city: '', country: '' },
          [field]: value
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>基本信息</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名 *</Label>
            <Input 
              id="name" 
              value={resume.basics.name} 
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="请输入您的姓名"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱 *</Label>
            <Input 
              id="email" 
              type="email"
              value={resume.basics.email} 
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="example@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">电话</Label>
            <Input 
              id="phone" 
              value={resume.basics.phone} 
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="请输入电话号码"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">城市</Label>
            <Input 
              id="city" 
              value={resume.basics.location?.city || ''} 
              onChange={(e) => handleLocationChange('city', e.target.value)}
              placeholder="例如：北京"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">个人总结</Label>
          <Textarea 
            id="summary" 
            value={resume.basics.summary} 
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="简要介绍您的职业背景和核心优势..."
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
