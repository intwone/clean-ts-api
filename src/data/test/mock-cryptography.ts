import { DecrypterProtocol } from '@/data/protocols/cryptography/decrypter';
import { EncrypterProtocol } from '@/data/protocols/cryptography/encrypter';
import { HashComparerProtocol } from '@/data/protocols/cryptography/hash-comparer';
import { HasherProtocol } from '@/data/protocols/cryptography/hasher';

export const mockHasher = () => {
  class HasherStub implements HasherProtocol {
    async hash(value: string): Promise<string> {
      return Promise.resolve('any_password');
    }
  }
  return new HasherStub();
};

export const mockDecrypter = (): DecrypterProtocol => {
  class DecrypterStub implements DecrypterProtocol {
    async decrypt(value: string): Promise<string> {
      return Promise.resolve('any_token');
    }
  }
  const decrypterStub = new DecrypterStub();
  return decrypterStub;
};

export const mockEncrypter = (): EncrypterProtocol => {
  class EncrypterStub implements EncrypterProtocol {
    async encrypt(value: string): Promise<string> {
      return 'any_token';
    }
  }
  const encrypterStub = new EncrypterStub();
  return encrypterStub;
};

export const mockHashComparer = (): HashComparerProtocol => {
  class HashComparerStub implements HashComparerProtocol {
    async compare(value: string, hash: string): Promise<boolean> {
      return true;
    }
  }
  const hashComparerStub = new HashComparerStub();
  return hashComparerStub;
};
