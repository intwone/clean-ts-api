import { LogErrorRepositoryProtocol } from '@/data/protocols/database/log/log-error-repository';
import { MongoHelper } from '../helpers/mongo-helper';

export class LogMongoRepository implements LogErrorRepositoryProtocol {
  async logError(stack: string): Promise<void> {
    const errorCollection = MongoHelper.getCollection('errors');
    await errorCollection?.insertOne({ stack, date: new Date() });
  }
}
