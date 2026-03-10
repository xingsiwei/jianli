export interface Basics {
  name: string;
  email: string;
  phone: string;
  summary: string;
  location?: {
    city: string;
    country: string;
  };
  profiles?: Array<{
    network: string;
    url: string;
  }>;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  keywords?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  url?: string;
}

export interface Resume {
  basics: Basics;
  work: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

export interface JDAnalysis {
  title: string;
  department?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: string;
  educationRequirement?: string;
  responsibilities: string[];
  keyAchievements: string[];
  companyCulture: string;
  atsKeywords: string[];
  softSkills: string[];
  industry?: string;
}

export interface OptimizationResult {
  original: Resume;

  optimized: {
    basics: {
      summary: string;
    };
    work: Array<{
      id: string;
      highlights: string[];
    }>;
    skills: Skill[];
  };

  jdAnalysis: JDAnalysis;

  atsReport: {
    score: number;
    keywordCoverage: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
  };

  reasoning: string;
}
