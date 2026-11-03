import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type { RiskEvent, RiskEventListParams, RiskLimits } from '../types';
import { Resource } from './base';

/** Risk: flagged events and the limits that apply to your account. */
export class Risk extends Resource {
  listEvents(params?: RiskEventListParams, options?: RequestOptions): PagePromise<RiskEvent> {
    return this.client.list(OPERATIONS.listRiskEvents, { query: params, options });
  }

  retrieveLimits(options?: RequestOptions): Promise<RiskLimits> {
    return this.client.call(OPERATIONS.getRiskLimits, { options });
  }
}
