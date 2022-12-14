import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbAddSurvey } from '@/main/factories/usecases/survey/add-survey/db-add-survey-factory';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller';
import { ControllerProtocol } from '@/presentation/protocols';
import { makeAddSurveyValidation } from './add-survey-validation-factory';

export const makeAddSurveyController = (): ControllerProtocol => {
  const addSurveyValidation = makeAddSurveyValidation();
  const addSurvey = makeDbAddSurvey();
  const addSurveyController = new AddSurveyController(addSurveyValidation, addSurvey);
  return makeLogControllerDecorator(addSurveyController);
};
