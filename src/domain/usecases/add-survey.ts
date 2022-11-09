export interface SurveyAnswerProtocol {
  image?: string;
  answer: string;
}

export interface AddSurveyModelProtocol {
  question: string;
  answers: SurveyAnswerProtocol[];
  date: Date;
}

export interface AddSurveyProtocol {
  add: (data: AddSurveyModelProtocol) => Promise<void>;
}
