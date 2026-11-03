import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type { ListParams, SplitRule, SplitRuleCreateParams, SplitRuleUpdateParams } from '../types';
import { Resource } from './base';

/** Split rules: how a payment is shared between you and your subaccounts (`split: 'spl_…'` on a payment). */
export class SplitRules extends Resource {
  create(params: SplitRuleCreateParams, options?: RequestOptions): Promise<SplitRule> {
    return this.client.call(OPERATIONS.createSplitRule, { body: params, options });
  }

  list(params?: ListParams, options?: RequestOptions): PagePromise<SplitRule> {
    return this.client.list(OPERATIONS.listSplitRules, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<SplitRule> {
    return this.client.call(OPERATIONS.getSplitRule, { path: { id }, options });
  }

  update(id: string, params: SplitRuleUpdateParams, options?: RequestOptions): Promise<SplitRule> {
    return this.client.call(OPERATIONS.updateSplitRule, { path: { id }, body: params, options });
  }
}
