import { mockAddSurveyParams } from '@/domain/test';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import env from '@/main/config/env';
import { sign } from 'jsonwebtoken';
import { Collection } from 'mongodb';
import request from 'supertest';

let surveyCollection: Collection | undefined;
let accountCollection: Collection | undefined;

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
      const fakeSurvey = mockAddSurveyParams();
      await request(app).post('/api/surveys').send(fakeSurvey).expect(403);
    });

    it('should return 204 on add survey with valid accessToken', async () => {
      const fakeSurvey = mockAddSurveyParams();
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
