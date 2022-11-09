import { DbLoadSurveys } from '../../../../../data/usecases/load-surveys/db-load-surveys';
import { LoadSurveysProtocol } from '../../../../../domain/usecases/load-surveys';
import { SurveyMongoRepository } from '../../../../../infra/database/mongodb/survey/survey-mongo-repository';

export const makeDbLoadSurveys = (): LoadSurveysProtocol => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
};
