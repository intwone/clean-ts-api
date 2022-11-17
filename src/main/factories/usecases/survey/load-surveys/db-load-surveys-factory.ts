import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys';
import { LoadSurveysProtocol } from '@/domain/usecases/survey/load-surveys';
import { SurveyMongoRepository } from '@/infra/database/mongodb/survey/survey-mongo-repository';

export const makeDbLoadSurveys = (): LoadSurveysProtocol => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
};
