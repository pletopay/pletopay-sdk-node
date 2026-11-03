import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type {
  Subscription,
  SubscriptionCancelParams,
  SubscriptionCreateParams,
  SubscriptionListParams,
} from '../types';
import { Resource } from './base';

/** Subscriptions: an invoice is issued each period (there is no automatic debit on bank transfer). */
export class Subscriptions extends Resource {
  create(params: SubscriptionCreateParams, options?: RequestOptions): Promise<Subscription> {
    return this.client.call(OPERATIONS.createSubscription, { body: params, options });
  }

  list(params?: SubscriptionListParams, options?: RequestOptions): PagePromise<Subscription> {
    return this.client.list(OPERATIONS.listSubscriptions, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<Subscription> {
    return this.client.call(OPERATIONS.getSubscription, { path: { id }, options });
  }

  cancel(id: string, params?: SubscriptionCancelParams, options?: RequestOptions): Promise<Subscription> {
    return this.client.call(OPERATIONS.cancelSubscription, { path: { id }, body: params ?? {}, options });
  }
}
