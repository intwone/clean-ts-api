export interface SurveyAnswerProtocol {
  image: string;
  answer: string;
}

export interface AddSurveyModelProtocol {
  question: string;
  answers: SurveyAnswerProtocol[];
}

export interface AddSurveyProtocol {
  add: (data: AddSurveyModelProtocol) => Promise<void>;
}
