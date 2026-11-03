import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type { LedgerTransaction, TransactionListParams } from '../types';
import { Resource } from './base';

/** The ledger: every movement on your balance, newest first. */
export class Transactions extends Resource {
  list(params?: TransactionListParams, options?: RequestOptions): PagePromise<LedgerTransaction> {
    return this.client.list(OPERATIONS.listTransactions, { query: params, options });
  }
}
