import { AccountModelProtocol } from '@/domain/models/account';
import { AddAccountParamsProtocol } from '@/domain/usecases/account/add-account';

export interface AddAccountRepositoryProtocol {
  add: (accountData: AddAccountParamsProtocol) => Promise<AccountModelProtocol>;
}
