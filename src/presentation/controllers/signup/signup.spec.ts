import { InvalidParamError, MissingParamError, ServerError } from '../../errors';
import { badRequest, serverError, success } from '../../helpers/http-helper';
import { SignUpController } from './signup';
import {
  AccountModelProtocol,
  AddAccountModelProtocol,
  AddAccountProtocol,
  EmailValidatorProtocol,
  HttpRequestProtocol,
  ValidationProtocol,
} from './signup-protocols';

interface SutProtocol {
  sut: SignUpController;
  emailValidatorStub: EmailValidatorProtocol;
  addAccountStub: AddAccountProtocol;
  validationStub: ValidationProtocol;
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

const makeEmailValidator = (): EmailValidatorProtocol => {
  class EmailvalidatorStub implements EmailValidatorProtocol {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailvalidatorStub();
  return emailValidatorStub;
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
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccountStub();
  const validationStub = makeValidation();
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub);
  return {
    sut,
    addAccountStub,
    emailValidatorStub,
    validationStub,
  };
};

describe('SignUp Controller', () => {
  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidEmailSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(isValidEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

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

  it('should return 500 if EmailValid throw an exception', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new ServerError('')));
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

  it('should return 200 if a valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    const fakeAccount = makeFakeAccount();

    expect(httpResponse).toEqual(success(fakeAccount));
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
});
