export interface LogErrorRepositoryProtocol {
  logError: (stack: string) => Promise<void>;
}
