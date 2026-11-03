import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type { Invoice, InvoiceCreateParams, InvoiceListParams, InvoiceUpdateParams } from '../types';
import { Resource } from './base';

/** Invoices: draft → finalize (gets a hosted page and account details) → paid / void / uncollectible. */
export class Invoices extends Resource {
  create(params: InvoiceCreateParams, options?: RequestOptions): Promise<Invoice> {
    return this.client.call(OPERATIONS.createInvoice, { body: params, options });
  }

  list(params?: InvoiceListParams, options?: RequestOptions): PagePromise<Invoice> {
    return this.client.list(OPERATIONS.listInvoices, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<Invoice> {
    return this.client.call(OPERATIONS.getInvoice, { path: { id }, options });
  }

  /** Drafts only (`409 invoice_not_draft`). */
  update(id: string, params: InvoiceUpdateParams, options?: RequestOptions): Promise<Invoice> {
    return this.client.call(OPERATIONS.updateInvoice, { path: { id }, body: params, options });
  }

  finalize(id: string, options?: RequestOptions): Promise<Invoice> {
    return this.client.call(OPERATIONS.finalizeInvoice, { path: { id }, options });
  }

  void(id: string, options?: RequestOptions): Promise<Invoice> {
    return this.client.call(OPERATIONS.voidInvoice, { path: { id }, options });
  }

  markUncollectible(id: string, options?: RequestOptions): Promise<Invoice> {
    return this.client.call(OPERATIONS.markInvoiceUncollectible, { path: { id }, options });
  }
}
