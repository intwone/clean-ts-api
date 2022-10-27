import jwt from 'jsonwebtoken';
import { EncrypterProtocol } from '../../../data/protocols/cryptography/encrypter';

export class JwtAdapter implements EncrypterProtocol {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret);
    return accessToken;
  }
}
