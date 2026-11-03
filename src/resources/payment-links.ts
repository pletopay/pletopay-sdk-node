import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type { PaymentLink, PaymentLinkCreateParams, PaymentLinkListParams, PaymentLinkUpdateParams } from '../types';
import { Resource } from './base';

/** Payment links: reusable hosted pages you can share anywhere. */
export class PaymentLinks extends Resource {
  create(params: PaymentLinkCreateParams, options?: RequestOptions): Promise<PaymentLink> {
    return this.client.call(OPERATIONS.createPaymentLink, { body: params, options });
  }

  list(params?: PaymentLinkListParams, options?: RequestOptions): PagePromise<PaymentLink> {
    return this.client.list(OPERATIONS.listPaymentLinks, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<PaymentLink> {
    return this.client.call(OPERATIONS.getPaymentLink, { path: { id }, options });
  }

  update(id: string, params: PaymentLinkUpdateParams, options?: RequestOptions): Promise<PaymentLink> {
    return this.client.call(OPERATIONS.updatePaymentLink, { path: { id }, body: params, options });
  }
}
