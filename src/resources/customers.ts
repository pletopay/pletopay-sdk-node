import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type {
  Customer,
  CustomerCreateParams,
  CustomerListParams,
  CustomerRiskStatusParams,
  CustomerUpdateParams,
} from '../types';
import { Resource } from './base';

/** Customers: the people or businesses that pay you. */
export class Customers extends Resource {
  /** Creates a customer. `email` is unique per mode (`409 customer_exists`). */
  create(params: CustomerCreateParams, options?: RequestOptions): Promise<Customer> {
    return this.client.call(OPERATIONS.createCustomer, { body: params, options });
  }

  list(params?: CustomerListParams, options?: RequestOptions): PagePromise<Customer> {
    return this.client.list(OPERATIONS.listCustomers, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<Customer> {
    return this.client.call(OPERATIONS.getCustomer, { path: { id }, options });
  }

  /** Updates a customer. `metadata` merges; set a key to "" to delete it. */
  update(id: string, params: CustomerUpdateParams, options?: RequestOptions): Promise<Customer> {
    return this.client.call(OPERATIONS.updateCustomer, { path: { id }, body: params, options });
  }

  /** Blocks or unblocks a customer (`risk_status`). Blocked customers cannot pay. */
  setRiskStatus(id: string, params: CustomerRiskStatusParams, options?: RequestOptions): Promise<Customer> {
    return this.client.call(OPERATIONS.setCustomerRiskStatus, { path: { id }, body: params, options });
  }
}
