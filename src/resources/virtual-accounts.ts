import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type {
  VirtualAccount,
  VirtualAccountCloseParams,
  VirtualAccountCreateParams,
  VirtualAccountListParams,
} from '../types';
import { Resource } from './base';

/**
 * Virtual accounts: `dedicated` (one per customer, every transfer in creates a succeeded payment)
 * or `dynamic` (one payment, expires).
 */
export class VirtualAccounts extends Resource {
  create(params: VirtualAccountCreateParams, options?: RequestOptions): Promise<VirtualAccount> {
    return this.client.call(OPERATIONS.createVirtualAccount, { body: params, options });
  }

  list(params?: VirtualAccountListParams, options?: RequestOptions): PagePromise<VirtualAccount> {
    return this.client.list(OPERATIONS.listVirtualAccounts, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<VirtualAccount> {
    return this.client.call(OPERATIONS.getVirtualAccount, { path: { id }, options });
  }

  /** Dynamic accounts only: their reference is their payment's. */
  retrieveByReference(reference: string, options?: RequestOptions): Promise<VirtualAccount> {
    return this.client.call(OPERATIONS.getVirtualAccountByReference, { path: { reference }, options });
  }

  /** Closes an account; money sent to it afterwards is not credited. */
  close(id: string, params: VirtualAccountCloseParams, options?: RequestOptions): Promise<VirtualAccount> {
    return this.client.call(OPERATIONS.closeVirtualAccount, { path: { id }, body: params, options });
  }
}
