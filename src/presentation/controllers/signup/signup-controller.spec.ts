import { EmailInUseError, MissingParamError, ServerError } from '../../errors';
import { badRequest, forbidden, serverError, success } from '../../helpers/http/http-helper';
import { SignUpController } from './signup-controller';
import {
  AccountModelProtocol,
  AddAccountModelProtocol,
  AddAccountProtocol,
  AuthenticationModelProtocol,
  AuthenticationProtocol,
  HttpRequestProtocol,
  ValidationProtocol,
} from './signup-controller-protocols';

interface SutProtocol {
  sut: SignUpController;
  addAccountStub: AddAccountProtocol;
  validationStub: ValidationProtocol;
  authenticationStub: AuthenticationProtocol;
}

const makeFakeRequest = (): HttpRequestProtocol => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeFakeAccount = (): AccountModelProtocol => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeAuthentication = (): AuthenticationProtocol => {
  class AuthenticationStub implements AuthenticationProtocol {
    async auth(authentication: AuthenticationModelProtocol): Promise<string> {
      return new Promise(resolve => resolve('any_token'));
    }
  }

  const authenticationStub = new AuthenticationStub();
  return authenticationStub;
};

const makeAddAccountStub = (): AddAccountProtocol => {
  class AddAccountStub implements AddAccountProtocol {
    async add(account: AddAccountModelProtocol): Promise<AccountModelProtocol> {
      const fakeAccount = makeFakeAccount();
      return new Promise(resolve => resolve(fakeAccount));
    }
  }
  const addAccountStub = new AddAccountStub();
  return addAccountStub;
};

const makeValidation = (): ValidationProtocol => {
  class ValidationStub implements ValidationProtocol {
    validate(input: any): Error | null {
      return null;
    }
  }
  const validationStub = new ValidationStub();
  return validationStub;
};

const makeSut = (): SutProtocol => {
  const addAccountStub = makeAddAccountStub();
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub);
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub,
  };
};

describe('SignUp Controller', () => {
  it('should call AddAccount with correct value', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  it('should return 500 if AddAccount throw an exception', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new ServerError('')));
  });

  it('should return 403 if AddAccount return null', async () => {
    const { sut, addAccountStub } = makeSut();
    jest
      .spyOn(addAccountStub, 'add')
      .mockReturnValueOnce(new Promise(resolve => resolve(null as unknown as AccountModelProtocol)));
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  it('should return 200 if a valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(success({ accessToken: 'any_token' }));
  });

  it('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' });
  });

  it('should return 500 Authentication throw an exception', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
