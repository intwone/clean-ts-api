import { AccountModelProtocol } from '../../usecases/add-account/db-add-account-protocols';

export interface LoadAccountByEmailRepositoryProtocol {
  load: (email: string) => Promise<AccountModelProtocol>;
}
