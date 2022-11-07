export interface DecrypterProtocol {
  decrypt: (value: string) => Promise<string>;
}
