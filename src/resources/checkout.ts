import type { Pletopay, RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type { CheckoutSession, CheckoutSessionCreateParams, CheckoutSessionListParams } from '../types';
import { Resource } from './base';

/**
 * Checkout sessions: a hosted page (`url`) or the popup (`token` with pletopay.js) where the
 * customer pays. Confirm fulfilment from `status === 'complete'` on the server, never from the browser.
 */
export class CheckoutSessions extends Resource {
  create(params: CheckoutSessionCreateParams, options?: RequestOptions): Promise<CheckoutSession> {
    return this.client.call(OPERATIONS.createCheckoutSession, { body: params, options });
  }

  list(params?: CheckoutSessionListParams, options?: RequestOptions): PagePromise<CheckoutSession> {
    return this.client.list(OPERATIONS.listCheckoutSessions, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<CheckoutSession> {
    return this.client.call(OPERATIONS.getCheckoutSession, { path: { id }, options });
  }

  /** Only sessions created with a `reference`. */
  retrieveByReference(reference: string, options?: RequestOptions): Promise<CheckoutSession> {
    return this.client.call(OPERATIONS.getCheckoutSessionByReference, { path: { reference }, options });
  }

  /** Expires an open session so it can no longer be paid. */
  expire(id: string, options?: RequestOptions): Promise<CheckoutSession> {
    return this.client.call(OPERATIONS.expireCheckoutSession, { path: { id }, options });
  }
}

export class Checkout extends Resource {
  readonly sessions: CheckoutSessions;

  constructor(client: Pletopay) {
    super(client);
    this.sessions = new CheckoutSessions(client);
  }
}
