import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadSurveys } from '@/main/factories/usecases/survey/load-surveys/db-load-surveys';
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller';
import { ControllerProtocol } from '@/presentation/protocols';

export const makeLoadSurveysController = (): ControllerProtocol => {
  const loadSurveys = makeDbLoadSurveys();
  const loadSurveysController = new LoadSurveysController(loadSurveys);
  return makeLogControllerDecorator(loadSurveysController);
};
