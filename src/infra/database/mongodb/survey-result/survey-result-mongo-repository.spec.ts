import { AccountModelProtocol } from '@/domain/models/account';
import { SurveyModelProtocol } from '@/domain/models/survey';
import { AddAccountModelProtocol } from '@/domain/usecases/add-account';
import { AddSurveyModelProtocol } from '@/domain/usecases/add-survey';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';

let surveyCollection: Collection | undefined;
let surveyResultCollection: Collection | undefined;
let accountCollection: Collection | undefined;

interface SutProtocol {
  sut: SurveyResultMongoRepository;
}

const makeFakeSurveyData = (): AddSurveyModelProtocol => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer1',
    },
    {
      answer: 'any_answer2',
    },
  ],
  date: new Date(),
});

const makeFakeAccountData = (): AddAccountModelProtocol => ({
  name: 'any_name',
  email: 'any_mail@email.com',
  password: 'any_password',
});

const makeFakeSurvey = async (): Promise<SurveyModelProtocol> => {
  const fakeSurveyData = makeFakeSurveyData();
  const result = await surveyCollection?.insertOne(fakeSurveyData);
  const id = result?.insertedId;
  const survey = await surveyCollection?.findOne({ _id: id });
  return survey as unknown as SurveyModelProtocol;
};

const makeFakeAccount = async (): Promise<AccountModelProtocol> => {
  const fakeAccountData = makeFakeAccountData();
  const result = await accountCollection?.insertOne(fakeAccountData);
  const id = result?.insertedId;
  const account = await accountCollection?.findOne({ _id: id });
  return account as unknown as AccountModelProtocol;
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
      const fakeSurveyData = await makeFakeSurvey();
      const fakeAccountData = await makeFakeAccount();
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
  });
});
