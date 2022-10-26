export interface TokenGeneratorProtocol {
  generate: (id: string) => Promise<string>;
}
