import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import { hash } from 'bcrypt';
import { Collection } from 'mongodb';
import request from 'supertest';

let accountCollection: Collection | undefined;

describe('Login Routes', () => {
  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection?.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('POST /signup', () => {
    it('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@gmail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password',
        })
        .expect(200);
    });
  });

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const password = await hash('any_password', 12);
      await accountCollection?.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password,
      });
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@gmail.com',
          password: 'any_password',
        })
        .expect(200);
    });

    it('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@gmail.com',
          password: 'any_password',
        })
        .expect(401);
    });
  });
});
