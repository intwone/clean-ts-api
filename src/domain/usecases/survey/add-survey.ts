import { SurveyAnswerModelProtocol } from '@/domain/models/survey';

export interface AddSurveyParamsProtocol {
  question: string;
  answers: SurveyAnswerModelProtocol[];
  date: Date;
}

export interface AddSurveyProtocol {
  add: (data: AddSurveyParamsProtocol) => Promise<void>;
}
