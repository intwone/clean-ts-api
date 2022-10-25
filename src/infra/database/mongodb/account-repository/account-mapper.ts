import { AccountModelProtocol } from '../../../../domain/models/account';

export const map = (account: any): AccountModelProtocol => {
  const { _id, ...accountWithoutId } = account;
  return { ...accountWithoutId, id: _id };
};
