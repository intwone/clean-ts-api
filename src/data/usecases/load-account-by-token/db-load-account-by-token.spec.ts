import { DecrypterProtocol } from '../../protocols/cryptography/decrypter';
import { DbLoadAccountByToken } from './db-load-account-by-token';

describe('DbLoadAccountByToken Usecase', () => {
  it('should call Decrypter with correct values', async () => {
    class DcrypterStub implements DecrypterProtocol {
      async decrypt(value: string): Promise<string> {
        return new Promise(resolve => resolve('any_value'));
      }
    }
    const decrypterStub = new DcrypterStub();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    const sut = new DbLoadAccountByToken(decrypterStub);
    await sut.load('any_token');

    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });
});
