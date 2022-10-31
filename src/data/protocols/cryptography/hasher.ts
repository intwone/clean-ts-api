export interface HasherProtocol {
  hash: (value: string) => Promise<string>;
}
