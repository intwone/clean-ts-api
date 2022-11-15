import { AccountModelProtocol } from '@/domain/models/account';

export interface LoadAccountByTokenProtocol {
  load: (accessToken: string, role?: string) => Promise<AccountModelProtocol>;
}
