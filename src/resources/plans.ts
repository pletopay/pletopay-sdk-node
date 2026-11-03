import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type { ListParams, Plan, PlanCreateParams, PlanUpdateParams } from '../types';
import { Resource } from './base';

/** Plans: what a subscription charges and how often. */
export class Plans extends Resource {
  create(params: PlanCreateParams, options?: RequestOptions): Promise<Plan> {
    return this.client.call(OPERATIONS.createPlan, { body: params, options });
  }

  list(params?: ListParams, options?: RequestOptions): PagePromise<Plan> {
    return this.client.list(OPERATIONS.listPlans, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<Plan> {
    return this.client.call(OPERATIONS.getPlan, { path: { id }, options });
  }

  update(id: string, params: PlanUpdateParams, options?: RequestOptions): Promise<Plan> {
    return this.client.call(OPERATIONS.updatePlan, { path: { id }, body: params, options });
  }
}
