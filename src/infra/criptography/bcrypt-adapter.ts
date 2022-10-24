import bcrypt from 'bcrypt';
import { EncrypterProtocol } from '../../data/protocols/encrypter';

export class BcryptAdapter implements EncrypterProtocol {
  constructor(private readonly salt: number) {}

  async encrypt(value: string): Promise<string> {
    await bcrypt.hash(value, this.salt);
    return '';
  }
}
