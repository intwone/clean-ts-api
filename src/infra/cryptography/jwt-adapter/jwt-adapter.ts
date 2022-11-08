import jwt from 'jsonwebtoken';
import { DecrypterProtocol } from '../../../data/protocols/cryptography/decrypter';
import { EncrypterProtocol } from '../../../data/protocols/cryptography/encrypter';

export class JwtAdapter implements EncrypterProtocol, DecrypterProtocol {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret);
    return accessToken;
  }

  async decrypt(value: string): Promise<string> {
    await jwt.verify(value, this.secret);
    return new Promise(resolve => resolve(''));
  }
}
