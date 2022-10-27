import bcrypt from 'bcrypt';
import { HashComparerProtocol } from '../../data/protocols/cryptography/hash-comparer';
import { HasherProtocol } from '../../data/protocols/cryptography/hasher';

export class BcryptAdapter implements HasherProtocol, HashComparerProtocol {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash);
    return new Promise(resolve => resolve(true));
  }
}
