import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type {
  DeletedObject,
  WebhookDelivery,
  WebhookDeliveryListParams,
  WebhookEndpoint,
  WebhookEndpointCreateParams,
  WebhookEndpointUpdateParams,
  ListParams,
} from '../types';
import { Resource } from './base';

/** Webhook endpoints: where Pletopay sends signed events. The `secret` is returned only by `create` and `rotateSecret`. */
export class WebhookEndpoints extends Resource {
  /** Registers an endpoint. Store `secret` (`whsec_…`) now: it is never shown again. */
  create(params: WebhookEndpointCreateParams, options?: RequestOptions): Promise<WebhookEndpoint> {
    return this.client.call(OPERATIONS.createWebhookEndpoint, { body: params, options });
  }

  list(params?: ListParams, options?: RequestOptions): PagePromise<WebhookEndpoint> {
    return this.client.list(OPERATIONS.listWebhookEndpoints, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<WebhookEndpoint> {
    return this.client.call(OPERATIONS.getWebhookEndpoint, { path: { id }, options });
  }

  /** Changes the URL, events or description, or re-enables an auto-disabled endpoint (`status: 'enabled'`). */
  update(id: string, params: WebhookEndpointUpdateParams, options?: RequestOptions): Promise<WebhookEndpoint> {
    return this.client.call(OPERATIONS.updateWebhookEndpoint, { path: { id }, body: params, options });
  }

  /** Stops deliveries; history is kept. */
  delete(id: string, options?: RequestOptions): Promise<DeletedObject> {
    return this.client.call(OPERATIONS.deleteWebhookEndpoint, { path: { id }, options });
  }

  /** Issues a new `secret`. Accept both for a while: the old one keeps signing during the grace period. */
  rotateSecret(id: string, options?: RequestOptions): Promise<WebhookEndpoint> {
    return this.client.call(OPERATIONS.rotateWebhookSecret, { path: { id }, options });
  }

  /** Sends a signed `webhook.test` event to this endpoint only. */
  test(id: string, options?: RequestOptions): Promise<WebhookDelivery> {
    return this.client.call(OPERATIONS.testWebhookEndpoint, { path: { id }, options });
  }

  listDeliveries(
    id: string,
    params?: WebhookDeliveryListParams,
    options?: RequestOptions,
  ): PagePromise<WebhookDelivery> {
    return this.client.list(OPERATIONS.listEndpointDeliveries, { path: { id }, query: params, options });
  }
}
