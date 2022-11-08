import { DbAddSurvey } from '../../../../../data/usecases/add-survey/db-add-survey';
import { AddSurveyProtocol } from '../../../../../domain/usecases/add-survey';
import { SurveyMongoRepository } from '../../../../../infra/database/mongodb/survey/survey-mongo-repository';

export const makeDbAddSurvey = (): AddSurveyProtocol => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
