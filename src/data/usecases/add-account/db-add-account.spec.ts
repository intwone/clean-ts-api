import { DbAddAccount } from './db-add-account';

describe('DbAddaccount Usecase', () => {
  it('should call Encrypter with correct password', async () => {
    class EncryperStub {
      async encrypt(value: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'));
      }
    }

    const encryptStub = new EncryperStub();
    const sut = new DbAddAccount(encryptStub);
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password',
    };
    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});
