export interface AuthenticationProtocol {
  auth: (email: string, password: string) => Promise<string>;
}
