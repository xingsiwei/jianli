import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return Response.json(
        { error: "Missing DEEPSEEK_API_KEY" },
        { status: 500 }
      );
    }

    const { jobDescription } = await req.json();

    if (!jobDescription) {
      return Response.json({ error: "Missing jobDescription" }, { status: 400 });
    }

    const deepseek = createOpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: process.env.DEEPSEEK_API_KEY,
      compatibility: "compatible",
      name: "deepseek",
    });

    const result = await generateObject({
      model: deepseek("deepseek-chat"),
      schema: z.object({
        title: z.string().describe('职位名称'),
        department: z.string().optional().describe('所属部门'),
        requiredSkills: z.array(z.string()).describe('必需技能'),
        preferredSkills: z.array(z.string()).describe('加分技能'),
        experienceLevel: z.string().describe('经验要求'),
        educationRequirement: z.string().optional().describe('学历要求'),
        responsibilities: z.array(z.string()).describe('职责描述'),
        keyAchievements: z.array(z.string()).describe('期望成就类型'),
        companyCulture: z.string().describe('公司文化'),
        atsKeywords: z.array(z.string()).describe('ATS关键词'),
        softSkills: z.array(z.string()).describe('软技能'),
        industry: z.string().optional().describe('行业'),
      }),
      prompt: `Analyze the following job description and extract key information:
      ${jobDescription}`,
    });

    return Response.json(result.object);
  } catch (error) {
    console.error("JD Analysis Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
