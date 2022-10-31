export interface UpdateAccessTokenRepositoryProtocol {
  updateAccessToken: (id: string, token: string) => Promise<void>;
}
