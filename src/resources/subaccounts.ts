import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type {
  ListParams,
  Subaccount,
  SubaccountBalance,
  SubaccountCreateParams,
  SubaccountUpdateParams,
} from '../types';
import { Resource } from './base';

/** Subaccounts: the parties that receive a share of split payments and are settled separately. */
export class Subaccounts extends Resource {
  create(params: SubaccountCreateParams, options?: RequestOptions): Promise<Subaccount> {
    return this.client.call(OPERATIONS.createSubaccount, { body: params, options });
  }

  list(params?: ListParams, options?: RequestOptions): PagePromise<Subaccount> {
    return this.client.list(OPERATIONS.listSubaccounts, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<Subaccount> {
    return this.client.call(OPERATIONS.getSubaccount, { path: { id }, options });
  }

  update(id: string, params: SubaccountUpdateParams, options?: RequestOptions): Promise<Subaccount> {
    return this.client.call(OPERATIONS.updateSubaccount, { path: { id }, body: params, options });
  }

  retrieveBalance(id: string, options?: RequestOptions): Promise<SubaccountBalance> {
    return this.client.call(OPERATIONS.getSubaccountBalance, { path: { id }, options });
  }
}
