import { SurveyAnswerModelProtocol } from '../models/survey';

export interface AddSurveyModelProtocol {
  question: string;
  answers: SurveyAnswerModelProtocol[];
  date: Date;
}

export interface AddSurveyProtocol {
  add: (data: AddSurveyModelProtocol) => Promise<void>;
}
