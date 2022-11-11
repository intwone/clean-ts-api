import { sign } from 'jsonwebtoken';
import { Collection } from 'mongodb';
import request from 'supertest';
import { AddSurveyModelProtocol } from '../../domain/usecases/add-survey';
import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper';
import app from '../config/app';
import env from '../config/env';

let surveyCollection: Collection | undefined;
let accountCollection: Collection | undefined;

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

const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection?.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    role: 'admin',
  });
  const id = result?.insertedId;
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection?.updateOne({ _id: id }, { $set: { accessToken } });
  return accessToken;
};

describe('Survey Routes', () => {
  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection?.deleteMany({});
    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection?.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('POST /surveys', () => {
    it('should return 403 on add survey without accessToken', async () => {
      const fakeSurvey = makeFakeSurveyData();
      await request(app).post('/api/surveys').send(fakeSurvey).expect(403);
    });

    it('should return 204 on add survey with valid accessToken', async () => {
      const fakeSurvey = makeFakeSurveyData();
      const accessToken = await makeAccessToken();
      await request(app).post('/api/surveys').set('x-access-token', accessToken).send(fakeSurvey).expect(204);
    });
  });

  describe('GET /surveys', () => {
    it('should return 403 on load surveys without accessToken', async () => {
      await request(app).get('/api/surveys').expect(403);
    });

    it('should return 204 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app).get('/api/surveys').set('x-access-token', accessToken).expect(204);
    });
  });
});
