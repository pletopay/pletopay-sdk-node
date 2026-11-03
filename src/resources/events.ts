import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type { EventListParams, EventReplayParams, WebhookDelivery } from '../types';
import type { Schemas } from '../types';
import { Resource } from './base';

/** The stored event, as the API lists it (`data.object` is the resource snapshot). */
export type StoredEvent = Schemas['Event'];

/** Events: everything that happened on your account, and their webhook deliveries. */
export class Events extends Resource {
  list(params?: EventListParams, options?: RequestOptions): PagePromise<StoredEvent> {
    return this.client.list(OPERATIONS.listEvents, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<StoredEvent> {
    return this.client.call(OPERATIONS.getEvent, { path: { id }, options });
  }

  /** Every delivery attempt group of this event (not paginated). */
  listDeliveries(id: string, options?: RequestOptions): PagePromise<WebhookDelivery> {
    return this.client.list(OPERATIONS.listEventDeliveries, { path: { id }, options });
  }

  /** Delivers the event again, to every subscribed endpoint or to one `endpoint`. Rate limited. */
  replay(id: string, params?: EventReplayParams, options?: RequestOptions): PagePromise<WebhookDelivery> {
    return this.client.list(OPERATIONS.replayEvent, { path: { id }, body: params ?? {}, options });
  }
}
