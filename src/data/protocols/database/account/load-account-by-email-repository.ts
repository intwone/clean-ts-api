import { AccountModelProtocol } from '../../../usecases/add-account/db-add-account-protocols';

export interface LoadAccountByEmailRepositoryProtocol {
  loadByEmail: (email: string) => Promise<AccountModelProtocol>;
}
