import {
  AddSurveyModelProtocol,
  AddSurveyRepositoryProtocol,
} from '../../../../data/usecases/add-survey/db-add-survey-protocols';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyMongoRepository implements AddSurveyRepositoryProtocol {
  async add(surveyData: AddSurveyModelProtocol): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection?.insertOne(surveyData);
  }
}
