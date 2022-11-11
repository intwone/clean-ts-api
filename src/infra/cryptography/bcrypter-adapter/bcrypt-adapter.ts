import { HashComparerProtocol } from '@/data/protocols/cryptography/hash-comparer';
import { HasherProtocol } from '@/data/protocols/cryptography/hasher';
import bcrypt from 'bcrypt';

export class BcryptAdapter implements HasherProtocol, HashComparerProtocol {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash);
    return isValid;
  }
}
