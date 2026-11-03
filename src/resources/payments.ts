import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type {
  ExpandedPayment,
  Payment,
  PaymentCreateParams,
  PaymentExpand,
  PaymentListParams,
  PaymentRetrieveParams,
} from '../types';
import { Resource } from './base';

type Expanded = { expand: [PaymentExpand, ...PaymentExpand[]] };

/**
 * Payments: a customer sends a bank transfer to the account in `bank_transfer`. The payment becomes
 * `succeeded` only once the money is confirmed: verify with `retrieve` or the `payment.succeeded`
 * webhook, never from a client-side callback.
 */
export class Payments extends Resource {
  /**
   * Creates a payment and its transfer instructions. `reference` is your unique id for it
   * (`409 duplicate_reference` on reuse). Pass `expand: ['customer']` to embed the customer object.
   */
  create(params: PaymentCreateParams & Expanded, options?: RequestOptions): Promise<ExpandedPayment>;
  create(params: PaymentCreateParams & { expand?: PaymentExpand[] }, options?: RequestOptions): Promise<Payment>;
  create(params: PaymentCreateParams & { expand?: PaymentExpand[] }, options?: RequestOptions): Promise<Payment> {
    const { expand, ...body } = params;
    return this.client.call(OPERATIONS.createPayment, { body, query: { expand }, options });
  }

  list(params?: PaymentListParams, options?: RequestOptions): PagePromise<Payment> {
    return this.client.list(OPERATIONS.listPayments, { query: params, options });
  }

  retrieve(id: string, params: Expanded, options?: RequestOptions): Promise<ExpandedPayment>;
  retrieve(id: string, params?: PaymentRetrieveParams, options?: RequestOptions): Promise<Payment>;
  retrieve(id: string, params?: PaymentRetrieveParams, options?: RequestOptions): Promise<Payment> {
    return this.client.call(OPERATIONS.getPayment, { path: { id }, query: params, options });
  }

  /** Looks a payment up by your `reference`, e.g. after a timeout when you never got its id. */
  retrieveByReference(reference: string, params: Expanded, options?: RequestOptions): Promise<ExpandedPayment>;
  retrieveByReference(reference: string, params?: PaymentRetrieveParams, options?: RequestOptions): Promise<Payment>;
  retrieveByReference(reference: string, params?: PaymentRetrieveParams, options?: RequestOptions): Promise<Payment> {
    return this.client.call(OPERATIONS.getPaymentByReference, { path: { reference }, query: params, options });
  }
}
