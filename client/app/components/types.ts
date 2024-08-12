// types.ts
export interface SurveyResult {
  votes: number[];
}

export interface SurveyData {
  id: number;
  question: string;
  description: string;
  options: string[];
}