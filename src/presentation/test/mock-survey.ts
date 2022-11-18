import { SurveyModelProtocol } from '@/domain/models/survey';
import { mockSurveyModel, mockSurveyModels } from '@/domain/test';
import { AddSurveyParamsProtocol, AddSurveyProtocol } from '@/domain/usecases/survey/add-survey';
import { LoadSurveyByIdProtocol } from '@/domain/usecases/survey/load-survey-by-id';
import { LoadSurveysProtocol } from '@/domain/usecases/survey/load-surveys';

export const mockAddSurvey = (): AddSurveyProtocol => {
  class AddSurveyStub implements AddSurveyProtocol {
    async add(data: AddSurveyParamsProtocol): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }
  const addSurveyStub = new AddSurveyStub();
  return addSurveyStub;
};

export const mockLoadSurveys = (): LoadSurveysProtocol => {
  class LoadSurveysStub implements LoadSurveysProtocol {
    async load(): Promise<SurveyModelProtocol[]> {
      const fakeSurvey = mockSurveyModels();
      return new Promise(resolve => resolve(fakeSurvey));
    }
  }
  const loadSurveysStub = new LoadSurveysStub();
  return loadSurveysStub;
};

export const mockLoadMakeSurveyById = (): LoadSurveyByIdProtocol => {
  class LoadSurveyByIdStub implements LoadSurveyByIdProtocol {
    async loadById(id: string): Promise<SurveyModelProtocol> {
      const fakeSurvey = mockSurveyModel();
      return new Promise(resolve => resolve(fakeSurvey));
    }
  }
  const loadSurveyByIdStub = new LoadSurveyByIdStub();
  return loadSurveyByIdStub;
};
