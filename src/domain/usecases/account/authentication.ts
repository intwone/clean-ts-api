export interface AuthenticationParamsProtocol {
  email: string;
  password: string;
}

export interface AuthenticationProtocol {
  auth: (authentication: AuthenticationParamsProtocol) => Promise<string>;
}
