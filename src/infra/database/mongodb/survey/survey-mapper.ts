import { SurveyModelProtocol } from '../../../../domain/models/survey';

export const map = (surveys: any): SurveyModelProtocol[] => {
  if (!surveys) return [];
  const mappedSurveys = surveys.map((survey: any) => {
    const { _id, ...surveysWithoutId } = survey;
    return { ...surveysWithoutId, id: _id };
  });
  return mappedSurveys;
};
