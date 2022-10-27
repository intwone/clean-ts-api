import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jtw-adapter';

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => {
    return new Promise(resolve => resolve('any_token'));
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
