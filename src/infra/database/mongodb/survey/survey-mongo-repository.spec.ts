import { Collection } from 'mongodb';
import { AddSurveyModelProtocol } from '../../../../domain/usecases/add-survey';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo-repository';

interface SutProtocol {
  sut: SurveyMongoRepository;
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

const makeSut = (): SutProtocol => {
  const sut = new SurveyMongoRepository();
  return {
    sut,
  };
};

let surveyCollection: Collection | undefined;

describe('Survey Mongo Repository', () => {
  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection?.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('add(', () => {
    it('should add a survey on success', async () => {
      const { sut } = makeSut();
      const fakeSurveyData = makeFakeSurveyData();
      await sut.add(fakeSurveyData);
      const survey = await surveyCollection?.findOne({ question: 'any_question' });

      expect(survey).toBeTruthy();
    });
  });
});
