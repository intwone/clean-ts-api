import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/survey-results/save-survey-result/db-load-surveys';
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory';
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller';
import { ControllerProtocol } from '@/presentation/protocols';

export const makeSaveSurveyResultController = (): ControllerProtocol => {
  const loadSurveyById = makeDbLoadSurveyById();
  const saveSurveyResult = makeDbSaveSurveyResult();
  const saveSurveyResultController = new SaveSurveyResultController(loadSurveyById, saveSurveyResult);
  return makeLogControllerDecorator(saveSurveyResultController);
};
