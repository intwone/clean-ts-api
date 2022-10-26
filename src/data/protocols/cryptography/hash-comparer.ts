export interface HashComparerProtocol {
  compare: (value: string, hash: string) => Promise<boolean>;
}
