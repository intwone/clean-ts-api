import { DecrypterProtocol } from '@/data/protocols/cryptography/decrypter';
import { EncrypterProtocol } from '@/data/protocols/cryptography/encrypter';
import jwt from 'jsonwebtoken';

export class JwtAdapter implements EncrypterProtocol, DecrypterProtocol {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret);
    return accessToken;
  }

  async decrypt(token: string): Promise<string> {
    const value = jwt.verify(token, this.secret);
    return value as string;
  }
}
