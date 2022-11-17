import { AccountModelProtocol } from '@/domain/models/account';
import { SurveyModelProtocol } from '@/domain/models/survey';
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';

let surveyCollection: Collection | undefined;
let surveyResultCollection: Collection | undefined;
let accountCollection: Collection | undefined;

interface SutProtocol {
  sut: SurveyResultMongoRepository;
}

const mockSurvey = async (): Promise<SurveyModelProtocol> => {
  const fakeSurveyData = mockAddSurveyParams();
  const result = await surveyCollection?.insertOne(fakeSurveyData);
  const id = result?.insertedId;
  const survey = await surveyCollection?.findOne({ _id: id });
  return MongoHelper.map(survey);
};

const mockAccount = async (): Promise<AccountModelProtocol> => {
  const fakeAccountData = mockAddAccountParams();
  const result = await accountCollection?.insertOne(fakeAccountData);
  const id = result?.insertedId;
  const account = await accountCollection?.findOne({ _id: id });
  return MongoHelper.map(account);
};

const makeSut = (): SutProtocol => {
  const sut = new SurveyResultMongoRepository();
  return {
    sut,
  };
};

describe('Survey Mongo Repository', () => {
  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection?.deleteMany({});
    surveyResultCollection = MongoHelper.getCollection('survey-results');
    await accountCollection?.deleteMany({});
    accountCollection = MongoHelper.getCollection('accounts');
    await surveyCollection?.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('save()', () => {
    it('should add a survey result if its new', async () => {
      const { sut } = makeSut();
      const fakeSurveyData = await mockSurvey();
      const fakeAccountData = await mockAccount();
      const surveyResult = await sut.save({
        surveyId: fakeSurveyData.id,
        accountId: fakeAccountData.id,
        answer: fakeSurveyData.answers[0].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe(fakeSurveyData.answers[0].answer);
    });

    it('should update survey result if its not new', async () => {
      const { sut } = makeSut();
      const fakeSurveyData = await mockSurvey();
      const fakeAccountData = await mockAccount();
      const result = await surveyResultCollection?.insertOne({
        surveyId: fakeSurveyData.id,
        accountId: fakeAccountData.id,
        answer: fakeSurveyData.answers[0].answer,
        date: new Date(),
      });
      const surveyResult = await sut.save({
        surveyId: fakeSurveyData.id,
        accountId: fakeAccountData.id,
        answer: fakeSurveyData.answers[1].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toEqual(result?.insertedId);
      expect(surveyResult.answer).toBe(fakeSurveyData.answers[1].answer);
    });
  });
});
