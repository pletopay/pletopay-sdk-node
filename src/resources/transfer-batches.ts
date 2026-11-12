import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type {
  TransferBatch,
  TransferBatchCreateParams,
  TransferBatchItem,
  TransferBatchItemListParams,
  TransferBatchItemParams,
  TransferBatchItemUpdateParams,
  TransferBatchListParams,
} from '../types';
import { Resource } from './base';

/**
 * Bulk transfers: many payouts added as rows, checked (name enquiry on every account), reviewed and
 * sent together. There is no row limit; send rows up to 1,000 per request. Submitting holds the
 * whole cost of the valid rows at once, or nothing, and each row is then sent as an ordinary
 * transfer. Follow progress with `retrieve` (`counts`) or the `transfer_batch.completed` event.
 */
export class TransferBatches extends Resource {
  /**
   * Starts a bulk transfer, optionally with its first rows (up to 1,000). `Idempotency-Key` is
   * required: pass a deterministic `options.idempotencyKey` so a retry never creates a second batch.
   */
  create(params: TransferBatchCreateParams, options?: RequestOptions): Promise<TransferBatch> {
    return this.client.call(OPERATIONS.createTransferBatch, { body: params, options });
  }

  list(params?: TransferBatchListParams, options?: RequestOptions): PagePromise<TransferBatch> {
    return this.client.list(OPERATIONS.listTransferBatches, { query: params, options });
  }

  /** `counts` gives the number of rows in each status. */
  retrieve(id: string, options?: RequestOptions): Promise<TransferBatch> {
    return this.client.call(OPERATIONS.getTransferBatch, { path: { id }, options });
  }

  /** The rows, in upload order (up to 500 per page). */
  listItems(
    id: string,
    params?: TransferBatchItemListParams,
    options?: RequestOptions,
  ): PagePromise<TransferBatchItem> {
    return this.client.list(OPERATIONS.listTransferBatchItems, { path: { id }, query: params, options });
  }

  /**
   * Appends up to 1,000 rows to a `draft` batch, all or nothing. `Idempotency-Key` is required, so
   * use one key per chunk (e.g. `payroll-2026-11-chunk-3`): a retried chunk is never added twice.
   */
  addItems(id: string, items: TransferBatchItemParams[], options?: RequestOptions): Promise<TransferBatch> {
    return this.client.call(OPERATIONS.addTransferBatchItems, { path: { id }, body: { items }, options });
  }

  /** Fixes a row before submit. Changing the account (or editing an `invalid` row) checks it again. */
  updateItem(
    id: string,
    itemId: string,
    params: TransferBatchItemUpdateParams,
    options?: RequestOptions,
  ): Promise<TransferBatchItem> {
    return this.client.call(OPERATIONS.updateTransferBatchItem, { path: { id, itemId }, body: params, options });
  }

  /** Removes a row before submit. It is kept as `removed` and left out of the totals. */
  removeItem(id: string, itemId: string, options?: RequestOptions): Promise<TransferBatch> {
    return this.client.call(OPERATIONS.removeTransferBatchItem, { path: { id, itemId }, options });
  }

  /** Closes a `draft` to new rows and checks every account: `validating`, then `ready`. */
  validate(id: string, options?: RequestOptions): Promise<TransferBatch> {
    return this.client.call(OPERATIONS.validateTransferBatch, { path: { id }, options });
  }

  /**
   * Sends a `ready` batch: holds the whole cost of its valid rows, or nothing (`400
   * insufficient_funds`), then sends the rows in the background. `Idempotency-Key` is required:
   * pass a deterministic `options.idempotencyKey` so a retry can never hold the money twice.
   */
  submit(id: string, options?: RequestOptions): Promise<TransferBatch> {
    return this.client.call(OPERATIONS.submitTransferBatch, { path: { id }, options });
  }

  /** Cancels a batch before submit. Nothing is held before submit, so nothing moves. */
  cancel(id: string, options?: RequestOptions): Promise<TransferBatch> {
    return this.client.call(OPERATIONS.cancelTransferBatch, { path: { id }, options });
  }
}
