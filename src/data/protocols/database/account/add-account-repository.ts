import { AccountModelProtocol } from '@/domain/models/account';
import { AddAccountModelProtocol } from '@/domain/usecases/account/add-account';

export interface AddAccountRepositoryProtocol {
  add: (accountData: AddAccountModelProtocol) => Promise<AccountModelProtocol>;
}
