import { LoadSurveysRepositoryProtocol } from '@/data/protocols/database/survey/load-survey-repository';
import {
  AddSurveyModelProtocol,
  AddSurveyRepositoryProtocol,
} from '@/data/usecases/add-survey/db-add-survey-protocols';
import { LoadSurveyByIdRepositoryProtocol } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols';
import { SurveyModelProtocol } from '@/domain/models/survey';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { map } from './surveys-mapper';

export class SurveyMongoRepository
  implements AddSurveyRepositoryProtocol, LoadSurveysRepositoryProtocol, LoadSurveyByIdRepositoryProtocol
{
  async add(surveyData: AddSurveyModelProtocol): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection?.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModelProtocol[]> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection?.find().toArray();
    return map(surveys);
  }

  async loadById(id: string): Promise<SurveyModelProtocol> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    const survey = await surveyCollection?.findOne({ _id: id });
    return map(survey);
  }
}
