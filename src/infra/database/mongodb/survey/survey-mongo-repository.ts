import { LoadSurveysRepositoryProtocol } from '@/data/protocols/database/survey/load-survey-repository';
import {
  AddSurveyParamsProtocol,
  AddSurveyRepositoryProtocol,
} from '@/data/usecases/survey/add-survey/db-add-survey-protocols';
import { LoadSurveyByIdRepositoryProtocol } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols';
import { SurveyModelProtocol } from '@/domain/models/survey';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { ObjectId } from 'mongodb';

export class SurveyMongoRepository
  implements AddSurveyRepositoryProtocol, LoadSurveysRepositoryProtocol, LoadSurveyByIdRepositoryProtocol
{
  async add(surveyData: AddSurveyParamsProtocol): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection?.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModelProtocol[]> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection?.find().toArray();
    return MongoHelper.map(surveys);
  }

  async loadById(id: string): Promise<SurveyModelProtocol> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    const survey = await surveyCollection?.findOne({ _id: new ObjectId(id) });
    return MongoHelper.map(survey);
  }
}
