import { LoadSurveysRepositoryProtocol } from '@/data/protocols/database/survey/load-survey-repository';
import {
  AddSurveyModelProtocol,
  AddSurveyRepositoryProtocol,
} from '@/data/usecases/add-survey/db-add-survey-protocols';
import { SurveyModelProtocol } from '@/domain/models/survey';
import { MongoHelper } from '../helpers/mongo-helper';
import { map } from './survey-mapper';

export class SurveyMongoRepository implements AddSurveyRepositoryProtocol, LoadSurveysRepositoryProtocol {
  async add(surveyData: AddSurveyModelProtocol): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection?.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModelProtocol[]> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection?.find().toArray();
    return map(surveys);
  }
}
