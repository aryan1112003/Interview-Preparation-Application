export type JobRole = 'tech' | 'non-tech';
export type QuestionCategory = 'technical' | 'behavioral' | 'hr';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type Seniority = 'entry' | 'mid' | 'senior';

export interface InterviewSettings {
  jobTitle: string;
  jobRole: JobRole;
  categories: QuestionCategory[];
  difficultyLevel: DifficultyLevel;
  seniority: Seniority;
  skills: string[];
}

export interface Question {
  question: string;
  modelAnswer?: string;
  userAnswer?: string;
}