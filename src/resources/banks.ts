import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type { Bank } from '../types';
import { Resource } from './base';

/** Banks and their codes, for transfer beneficiaries. */
export class Banks extends Resource {
  /** The full list (not paginated). */
  list(options?: RequestOptions): PagePromise<Bank> {
    return this.client.list(OPERATIONS.listBanks, { options });
  }
}
