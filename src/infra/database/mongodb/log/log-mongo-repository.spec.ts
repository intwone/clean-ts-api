import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { LogMongoRepository } from './log-mongo-repository';

interface SutProtocol {
  sut: LogMongoRepository;
}

const makeSut = (): SutProtocol => {
  const sut = new LogMongoRepository();
  return {
    sut,
  };
};

describe('Log Mongo Repository', () => {
  let errorCollection: Collection | undefined;

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('errors');
    await errorCollection?.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should create an error log on success', async () => {
    const { sut } = makeSut();
    await sut.logError('any_error');
    const count = await errorCollection?.countDocuments();
    expect(count).toBe(1);
  });
});
