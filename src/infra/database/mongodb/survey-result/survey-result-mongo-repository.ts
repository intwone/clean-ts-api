import {
  SaveSurveyResultParamsProtocol,
  SaveSurveyResultRepositoryProtocol,
  SurveyResultModelProtocol,
} from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';

export class SurveyResultMongoRepository implements SaveSurveyResultRepositoryProtocol {
  async save(data: SaveSurveyResultParamsProtocol): Promise<SurveyResultModelProtocol> {
    const surveyResultCollection = MongoHelper.getCollection('survey-results');
    const result = await surveyResultCollection?.findOneAndUpdate(
      {
        surveyId: data.surveyId,
        accountId: data.accountId,
      },
      {
        $set: {
          answer: data.answer,
          date: data.date,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      },
    );
    return MongoHelper.map(result?.value);
  }
}
