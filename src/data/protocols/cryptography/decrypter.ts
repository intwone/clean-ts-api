export interface DecrypterProtocol {
  decrypt: (token: string) => Promise<string>;
}
