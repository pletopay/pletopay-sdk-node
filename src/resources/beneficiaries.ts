import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type {
  BeneficiaryCreateParams,
  BeneficiaryListParams,
  BeneficiaryUpdateParams,
  DeletedObject,
  SavedBeneficiary,
} from '../types';
import { Resource } from './base';

/**
 * Saved transfer recipients. The recipient of every successful transfer is saved automatically;
 * you can also save accounts yourself. Pay one with `beneficiary_id` on `transfers.create`.
 */
export class Beneficiaries extends Resource {
  /** Saves an account after resolving its name. An account already saved in this mode is a 409 `beneficiary_exists`. */
  create(params: BeneficiaryCreateParams, options?: RequestOptions): Promise<SavedBeneficiary> {
    return this.client.call(OPERATIONS.createBeneficiary, { body: params, options });
  }

  /** `q` searches by id, the start of an account number, or part of the account name or nickname. */
  list(params?: BeneficiaryListParams, options?: RequestOptions): PagePromise<SavedBeneficiary> {
    return this.client.list(OPERATIONS.listBeneficiaries, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<SavedBeneficiary> {
    return this.client.call(OPERATIONS.getBeneficiary, { path: { id }, options });
  }

  /** Sets or clears (`nickname: null`) the nickname. Account details can't change: delete and save again. */
  update(id: string, params: BeneficiaryUpdateParams, options?: RequestOptions): Promise<SavedBeneficiary> {
    return this.client.call(OPERATIONS.updateBeneficiary, { path: { id }, body: params, options });
  }

  /** Transfers already sent are unaffected; a later successful transfer to the account saves it again. */
  delete(id: string, options?: RequestOptions): Promise<DeletedObject> {
    return this.client.call(OPERATIONS.deleteBeneficiary, { path: { id }, options });
  }
}
