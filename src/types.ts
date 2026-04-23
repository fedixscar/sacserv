export interface SurveyAnswers {
  name: string;
  email: string;
  q1: string | null;
  q2: string[];
  q3: string | null;
  q4: string | null;
  q5: string[];
  q6: string[];
  q7: string | null;
  rating: number;
  comment: string;
}

export const initialAnswers: SurveyAnswers = {
  name: '',
  email: '',
  q1: null,
  q2: [],
  q3: null,
  q4: null,
  q5: [],
  q6: [],
  q7: null,
  rating: 0,
  comment: '',
};

export type Step =
  | 'intro'
  | 'user-info'
  | 'q1' | 'location-map' | 'q2'
  | 'matching-explain'
  | 'q3' | 'q4' | 'q5' | 'q6' | 'q7'
  | 'rating'
  | 'comment'
  | 'merci';

export const STEPS: Step[] = [
  'intro',
  'user-info',
  'q1', 'location-map', 'q2',
  'matching-explain',
  'q3', 'q4', 'q5', 'q6', 'q7',
  'rating',
  'comment',
  'merci',
];

export const QUESTION_NUMBER: Record<string, number> = {
  q1: 1, q2: 2, q3: 3, q4: 4, q5: 5, q6: 6, q7: 7,
};
