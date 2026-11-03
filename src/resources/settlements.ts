import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type { Settlement, SettlementItem, SettlementListParams } from '../types';
import { Resource } from './base';

/** Settlements: payouts of your available balance to your settlement account, on your schedule. */
export class Settlements extends Resource {
  list(params?: SettlementListParams, options?: RequestOptions): PagePromise<Settlement> {
    return this.client.list(OPERATIONS.listSettlements, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<Settlement> {
    return this.client.call(OPERATIONS.getSettlement, { path: { id }, options });
  }

  /** The payments, refunds and fees that make up a settlement (not paginated). */
  listItems(id: string, options?: RequestOptions): PagePromise<SettlementItem> {
    return this.client.list(OPERATIONS.listSettlementItems, { path: { id }, options });
  }
}
