import { AccountModelProtocol } from '../../../../domain/models/account';

export const map = (account: any): AccountModelProtocol | null => {
  if (!account) return null;
  const { _id, ...accountWithoutId } = account;
  return { ...accountWithoutId, id: _id };
};
