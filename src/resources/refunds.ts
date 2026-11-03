import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type { Refund, RefundCreateParams, RefundListParams } from '../types';
import { Resource } from './base';

/**
 * Refunds: money back to the payer of a confirmed payment. The payment becomes
 * `partially_refunded` / `refunded` only once the refund succeeds.
 */
export class Refunds extends Resource {
  /**
   * Refunds a payment (whole, or `amount` of it). `Idempotency-Key` is required by the API: pass
   * `options.idempotencyKey` with a deterministic value (e.g. `refund-<your id>`); the SDK
   * generates a random one only when you omit it.
   */
  create(params: RefundCreateParams, options?: RequestOptions): Promise<Refund> {
    return this.client.call(OPERATIONS.createRefund, { body: params, options });
  }

  list(params?: RefundListParams, options?: RequestOptions): PagePromise<Refund> {
    return this.client.list(OPERATIONS.listRefunds, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<Refund> {
    return this.client.call(OPERATIONS.getRefund, { path: { id }, options });
  }

  retrieveByReference(reference: string, options?: RequestOptions): Promise<Refund> {
    return this.client.call(OPERATIONS.getRefundByReference, { path: { reference }, options });
  }
}
