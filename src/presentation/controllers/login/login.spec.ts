import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError, success, unauthorized } from '../../helpers/http-helper';
import { LoginController } from './login';
import { AuthenticationProtocol, EmailValidatorProtocol, HttpRequestProtocol } from './login-protocols';

interface SutProtocol {
  sut: LoginController;
  emailValidatorStub: EmailValidatorProtocol;
  authenticationStub: AuthenticationProtocol;
}

const makeFakeRequest = (): HttpRequestProtocol => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

const makeAuthentication = (): AuthenticationProtocol => {
  class AuthenticationStub implements AuthenticationProtocol {
    async auth(email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'));
    }
  }

  const authenticationStub = new AuthenticationStub();
  return authenticationStub;
};

const makeEmailValidator = (): EmailValidatorProtocol => {
  class EmailValidatorStub implements EmailValidatorProtocol {
    isValid(email: string): boolean {
      return true;
    }
  }

  const emailValidatorStub = new EmailValidatorStub();
  return emailValidatorStub;
};

const makeSut = (): SutProtocol => {
  const authenticationStub = makeAuthentication();
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  };
};

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should return 500 EmailValidator throw an exception', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password');
  });

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve('')));
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unauthorized());
  });

  it('should return 500 Authentication throw an exception', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(success({ accessToken: 'any_token' }));
  });
});
