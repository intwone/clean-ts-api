import { AddSurveyRepositoryProtocol } from '@/data/protocols/database/survey/add-survey-repository';
import { LoadSurveyByIdRepositoryProtocol } from '@/data/protocols/database/survey/load-survey-by-id-repository';
import { LoadSurveysRepositoryProtocol } from '@/data/protocols/database/survey/load-survey-repository';
import { SurveyModelProtocol } from '@/domain/models/survey';
import { mockSurveyModel, mockSurveyModels } from '@/domain/test';
import { AddSurveyParamsProtocol } from '@/domain/usecases/survey/add-survey';

export const mockAddSurveyRepository = (): AddSurveyRepositoryProtocol => {
  class AddSurveyRepositoryStub implements AddSurveyRepositoryProtocol {
    async add(surveyData: AddSurveyParamsProtocol): Promise<void> {
      return Promise.resolve();
    }
  }
  const addSurveyRepositoryStub = new AddSurveyRepositoryStub();
  return addSurveyRepositoryStub;
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepositoryProtocol => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepositoryProtocol {
    async loadById(id: string): Promise<SurveyModelProtocol> {
      const fakeSurvey = mockSurveyModel();
      return Promise.resolve(fakeSurvey);
    }
  }
  const loadSurveysRepositoryStub = new LoadSurveyByIdRepositoryStub();
  return loadSurveysRepositoryStub;
};

export const mockLoadSurveysRepository = (): LoadSurveysRepositoryProtocol => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepositoryProtocol {
    async loadAll(): Promise<SurveyModelProtocol[]> {
      const fakeSurveys = mockSurveyModels();
      return Promise.resolve(fakeSurveys);
    }
  }
  const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub();
  return loadSurveysRepositoryStub;
};
