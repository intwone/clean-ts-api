import { SurveyModelProtocol } from '@/domain/models/survey';
import { AddSurveyParamsProtocol } from '@/domain/usecases/survey/add-survey';

export const mockSurveyModel = (): SurveyModelProtocol => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

export const mockSurveyModels = (): SurveyModelProtocol[] => {
  return [mockSurveyModel(), mockSurveyModel()];
};

export const mockAddSurveyParams = (): AddSurveyParamsProtocol => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
    {
      answer: 'any_answer2',
    },
  ],
  date: new Date(),
});
