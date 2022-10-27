import bcrypt from 'bcrypt';
import { HasherProtocol } from '../../data/protocols/cryptography/hasher';

export class BcryptAdapter implements HasherProtocol {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }
}
