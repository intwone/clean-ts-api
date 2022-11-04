import { Collection } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper';
import app from '../config/app';

let surveyCollection: Collection | undefined;

describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    it('should return 204 on add survey success', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'any_image1',
              answer: 'any_answer1',
            },
            {
              answer: 'any_answer2',
            },
          ],
        })
        .expect(204);
    });
  });
});
