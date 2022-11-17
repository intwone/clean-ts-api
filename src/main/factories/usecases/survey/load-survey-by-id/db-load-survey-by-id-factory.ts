import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id';
import { LoadSurveyByIdProtocol } from '@/domain/usecases/survey/load-survey-by-id';
import { SurveyMongoRepository } from '@/infra/database/mongodb/survey/survey-mongo-repository';

export const makeDbLoadSurveyById = (): LoadSurveyByIdProtocol => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyById(surveyMongoRepository);
};
