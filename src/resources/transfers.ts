import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type {
  AccountResolution,
  NameEnquiryParams,
  Transfer,
  TransferCreateParams,
  TransferListParams,
} from '../types';
import { Resource } from './base';

/**
 * Transfers (payouts) from your available balance to any Nigerian bank account. A transfer stays
 * `processing` until the outcome is known and is never reported `failed` prematurely.
 */
export class Transfers extends Resource {
  /**
   * Sends money. `Idempotency-Key` is required by the API: pass `options.idempotencyKey` with a
   * deterministic value (e.g. `payout-<your id>`) so a retry from a crashed process cannot pay twice;
   * the SDK generates a random one only when you omit it.
   *
   * The API answers once the bank has, so the default timeout is 90 s. A timeout or connection
   * error does not mean the transfer failed: retry with the thrown error's `idempotencyKey`.
   */
  create(params: TransferCreateParams, options?: RequestOptions): Promise<Transfer> {
    return this.client.call(OPERATIONS.createTransfer, { body: params, options });
  }

  list(params?: TransferListParams, options?: RequestOptions): PagePromise<Transfer> {
    return this.client.list(OPERATIONS.listTransfers, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<Transfer> {
    return this.client.call(OPERATIONS.getTransfer, { path: { id }, options });
  }

  /** Your payouts only; the transfers behind refunds and settlements are not returned. */
  retrieveByReference(reference: string, options?: RequestOptions): Promise<Transfer> {
    return this.client.call(OPERATIONS.getTransferByReference, { path: { reference }, options });
  }

  /** Name enquiry: shows the account holder's name before you send. */
  resolveAccount(params: NameEnquiryParams, options?: RequestOptions): Promise<AccountResolution> {
    return this.client.call(OPERATIONS.resolveAccount, { body: params, options });
  }
}
