import type { RequestOptions } from '../client';
import type { PagePromise } from '../core/pagination';
import { OPERATIONS } from '../operations';
import type { Report, ReportCreateParams, ReportListParams, Statement, StatementParams } from '../types';
import { Resource } from './base';

/** Reports (CSV, generated asynchronously: wait for `report.ready`) and the account statement. */
export class Reports extends Resource {
  create(params: ReportCreateParams, options?: RequestOptions): Promise<Report> {
    return this.client.call(OPERATIONS.createReport, { body: params, options });
  }

  list(params?: ReportListParams, options?: RequestOptions): PagePromise<Report> {
    return this.client.list(OPERATIONS.listReports, { query: params, options });
  }

  retrieve(id: string, options?: RequestOptions): Promise<Report> {
    return this.client.call(OPERATIONS.getReport, { path: { id }, options });
  }

  /** The CSV of a `succeeded` report, as text (`409 report_not_ready` before that). */
  download(id: string, options?: RequestOptions): Promise<string> {
    return this.client.call(OPERATIONS.downloadReport, { path: { id }, options }) as Promise<string>;
  }

  /** Opening balance, movements and closing balance for a period. */
  statement(params: StatementParams, options?: RequestOptions): Promise<Statement> {
    return this.client.call(OPERATIONS.getStatement, { query: params, options });
  }
}
