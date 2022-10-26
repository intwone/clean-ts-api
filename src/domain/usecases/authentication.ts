export interface AuthenticationModelProtocol {
  email: string;
  password: string;
}

export interface AuthenticationProtocol {
  auth: (authentication: AuthenticationModelProtocol) => Promise<string>;
}
