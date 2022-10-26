export interface UpdateAccessTokenRepositoryProtocol {
  update: (id: string, token: string) => Promise<void>;
}
