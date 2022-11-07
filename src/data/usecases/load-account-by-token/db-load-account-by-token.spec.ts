import { DecrypterProtocol } from '../../protocols/cryptography/decrypter';
import { DbLoadAccountByToken } from './db-load-account-by-token';

interface SutProtocol {
  sut: DbLoadAccountByToken;
  decrypterStub: DecrypterProtocol;
}

const makeDecrypterStub = (): DecrypterProtocol => {
  class DecrypterStub implements DecrypterProtocol {
    async decrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('any_value'));
    }
  }
  const decrypterStub = new DecrypterStub();
  return decrypterStub;
};

const makeSut = (): SutProtocol => {
  const decrypterStub = makeDecrypterStub();
  const sut = new DbLoadAccountByToken(decrypterStub);
  return {
    sut,
    decrypterStub,
  };
};

describe('DbLoadAccountByToken Usecase', () => {
  it('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.load('any_token');

    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });
});
