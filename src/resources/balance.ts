import type { RequestOptions } from '../client';
import { OPERATIONS } from '../operations';
import type { Balance as BalanceObject } from '../types';
import { Resource } from './base';

/** Your balance: `available` (can be paid out), `pending`, `held`, `settling`, … in kobo. */
export class Balance extends Resource {
  retrieve(options?: RequestOptions): Promise<BalanceObject> {
    return this.client.call(OPERATIONS.getBalance, { options });
  }
}
