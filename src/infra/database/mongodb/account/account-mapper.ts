import { AccountModelProtocol } from '@/domain/models/account';

export const map = (account: any): AccountModelProtocol => {
  if (!account) return null as unknown as AccountModelProtocol;
  const { _id, ...accountWithoutId } = account;
  return { ...accountWithoutId, id: _id };
};
