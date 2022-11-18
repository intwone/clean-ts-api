import { LogErrorRepositoryProtocol } from '@/data/protocols/database/log/log-error-repository';

export const mockLogErrorRepository = (): LogErrorRepositoryProtocol => {
  class LogErrorRepositoryStub implements LogErrorRepositoryProtocol {
    async logError(stack: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }
  const logErrorRepositoryStub = new LogErrorRepositoryStub();
  return logErrorRepositoryStub;
};
