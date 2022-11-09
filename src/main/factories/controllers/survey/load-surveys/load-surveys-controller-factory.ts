import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller';
import { ControllerProtocol } from '../../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory';
import { makeDbLoadSurveys } from '../../../usecases/survey/load-surveys/db-load-surveys';

export const makeLoadSurveysController = (): ControllerProtocol => {
  const loadSurveys = makeDbLoadSurveys();
  const loadSurveysController = new LoadSurveysController(loadSurveys);
  return makeLogControllerDecorator(loadSurveysController);
};
