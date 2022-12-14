import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => {
    return Promise.resolve('any_token');
  },

  verify: async (token: string): Promise<string> => {
    return Promise.resolve('any_value');
  },
}));

interface SutProtocol {
  sut: JwtAdapter;
}

const makeSut = (): SutProtocol => {
  const sut = new JwtAdapter('secret');
  return {
    sut,
  };
};

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    it('should call sign with correct values', async () => {
      const { sut } = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');
      await sut.encrypt('any_id');

      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
    });

    it('should return a token on sign success', async () => {
      const { sut } = makeSut();
      const accessToken = await sut.encrypt('any_id');

      expect(accessToken).toBe('any_token');
    });

    it('should throw an exception if sign throw an exception', async () => {
      const { sut } = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.encrypt('any_id');

      await expect(promise).rejects.toThrow();
    });
  });

  describe('verify()', () => {
    it('should call verify with correct values', async () => {
      const { sut } = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');
      await sut.decrypt('any_token');

      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
    });

    it('should return a value on verify success', async () => {
      const { sut } = makeSut();
      const value = await sut.decrypt('any_token');

      expect(value).toBe('any_value');
    });

    it('should throw an exception if verify throw an exception', async () => {
      const { sut } = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.decrypt('any_token');

      await expect(promise).rejects.toThrow();
    });
  });
});
