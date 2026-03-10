import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return Response.json({ error: "Missing DEEPSEEK_API_KEY" }, { status: 500 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { resume, jobDescription } = (body ?? {}) as {
      resume?: unknown;
      jobDescription?: unknown;
    };

    if (!resume || !jobDescription) {
      return Response.json(
        { error: "Missing resume or jobDescription" },
        { status: 400 }
      );
    }

    const deepseek = createOpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: process.env.DEEPSEEK_API_KEY,
      compatibility: "compatible",
      name: "deepseek",
    });

    const result = await generateObject({
      model: deepseek("deepseek-chat"),
      mode: "json",
      experimental_repairText: async ({ text }) => {
        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");
        if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
          return null;
        }
        return text.slice(firstBrace, lastBrace + 1).trim();
      },
      schema: z.object({
        optimized: z.object({
          basics: z.object({
            summary: z.string().describe('针对JD优化的个人总结'),
          }),
          work: z.array(z.object({
            id: z.string(),
            highlights: z.array(z.string()).describe('针对JD优化的工作亮点'),
          })),
          skills: z.array(z.object({
            name: z.string(),
            level: z.string().optional(),
            keywords: z.array(z.string()).optional()
          })).describe('针对JD优化的技能列表'),
        }),
        atsReport: z.object({
          score: z.coerce.number().describe('ATS评分 (0-100)'),
          keywordCoverage: z.coerce.number().describe('关键词覆盖率 (%)'),
          matchedKeywords: z.array(z.string()).describe('已匹配关键词'),
          missingKeywords: z.array(z.string()).describe('缺失关键词'),
          suggestions: z.array(z.string()).describe('改进建议'),
        }),
        reasoning: z.string().describe('优化理由和策略说明'),
      }),
      prompt: `
      Role: Expert Resume Optimizer.
      Task: Optimize the provided resume for the specific job description (JD).
      Output: Return ONLY valid JSON that matches the schema. Do not add any extra text.
      
      Resume:
      ${JSON.stringify(resume)}
      
      Job Description:
      ${jobDescription}
      
      Instructions:
      1. Analyze the JD for keywords, skills, and requirements.
      2. Rewrite the resume summary to align with the JD.
      3. Rewrite work experience highlights to emphasize relevant achievements and skills using action verbs and metrics. MATCH THE ID of work experience.
      4. Reorder or select skills that are most relevant.
      5. Calculate an ATS score based on keyword matching.
      6. Provide reasoning for the changes.
      `,
    });

    return Response.json({
        original: resume,
        jdAnalysis: { title: 'JD Analysis (Placeholder)' }, // Placeholder
        ...result.object,
    });
  } catch (error) {
    console.error("Resume Optimization Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
