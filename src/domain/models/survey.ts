export interface SurveyAnswerModelProtocol {
  image?: string;
  answer: string;
}

export interface SurveyModelProtocol {
  id: string;
  question: string;
  answers: SurveyAnswerModelProtocol[];
  date: Date;
}
