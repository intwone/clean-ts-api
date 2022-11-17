import { mockAddSurveyParams } from '@/domain/test';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { Collection, ObjectId } from 'mongodb';
import { SurveyMongoRepository } from './survey-mongo-repository';

interface SutProtocol {
  sut: SurveyMongoRepository;
}

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

  describe('add()', () => {
    it('should add a survey on success', async () => {
      const { sut } = makeSut();
      const fakeSurveyData = mockAddSurveyParams();
      await sut.add(fakeSurveyData);
      const survey = await surveyCollection?.findOne({ question: 'any_question' });

      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    it('should load all a survey on success', async () => {
      const fakeSurvey = mockAddSurveyParams();
      await surveyCollection?.insertMany([fakeSurvey, { ...fakeSurvey, _id: new ObjectId(4294967295) }]);
      const { sut } = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(2);
      expect(surveys[0].question).toBe('any_question');
    });

    it('should load empty list', async () => {
      const { sut } = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    it('should load survey by id on success', async () => {
      const fakeSurvey = mockAddSurveyParams();
      const result = await surveyCollection?.insertOne(fakeSurvey);
      const id = result?.insertedId as unknown as string;
      const { sut } = makeSut();
      const survey = await sut.loadById(id);

      expect(survey).toBeTruthy();
      expect(survey.id).toBeTruthy();
    });
  });
});
