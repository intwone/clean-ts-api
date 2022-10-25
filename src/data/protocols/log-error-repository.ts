export interface LogErrorRepositoryProtocol {
  log: (stack: string) => Promise<void>;
}
