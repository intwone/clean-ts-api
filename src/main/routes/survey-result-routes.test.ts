import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import env from '@/main/config/env';
import { sign } from 'jsonwebtoken';
import { Collection } from 'mongodb';
import request from 'supertest';

let surveyCollection: Collection | undefined;
let accountCollection: Collection | undefined;

const makeFakeSurveyId = async (): Promise<string> => {
  const result = await surveyCollection?.insertOne({
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
  return String(result?.insertedId);
};

const makeFakeAccessToken = async (): Promise<string> => {
  const result = await accountCollection?.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    role: 'user',
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

  describe('PUT /surveys/:surveyId/results', () => {
    it('should return 403 on save survey result without accessToken', async () => {
      await request(app).put('/api/surveys/any_id/results').send({ answer: 'any_answer' }).expect(403);
    });

    it('should return 200 on save survey result with accessToken', async () => {
      const surveyId = await makeFakeSurveyId();
      const accessToken = await makeFakeAccessToken();
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({ answer: 'any_answer1' })
        .expect(200);
    });
  });
});
