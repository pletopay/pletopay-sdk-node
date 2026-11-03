/**
 * Compile-time checks (run by `pnpm typecheck`): the hand-written query parameter types expose
 * exactly the query parameters the contract declares for each operation.
 */
import { describe, expectTypeOf, it } from 'vitest';
import type { OPERATIONS } from '../../src/operations';
import type {
  CheckoutSessionListParams,
  CustomerListParams,
  Event,
  EventListParams,
  EventOf,
  EventType,
  ExpandedPayment,
  InvoiceListParams,
  ListParams,
  PaymentListParams,
  PaymentRetrieveParams,
  PaymentLinkListParams,
  RefundListParams,
  ReportListParams,
  RiskEventListParams,
  SettlementListParams,
  StatementParams,
  SubscriptionListParams,
  TransactionListParams,
  TransferListParams,
  VirtualAccountListParams,
  WebhookDeliveryListParams,
  Payment,
} from '../../src/types';

type QueryKeys<Op extends keyof typeof OPERATIONS> = (typeof OPERATIONS)[Op] extends { query: readonly (infer Q)[] }
  ? Q
  : never;

describe('query parameter types match the contract', () => {
  it('lists', () => {
    expectTypeOf<keyof CustomerListParams>().toEqualTypeOf<QueryKeys<'listCustomers'>>();
    expectTypeOf<keyof PaymentListParams>().toEqualTypeOf<QueryKeys<'listPayments'>>();
    expectTypeOf<keyof VirtualAccountListParams>().toEqualTypeOf<QueryKeys<'listVirtualAccounts'>>();
    expectTypeOf<keyof ListParams>().toEqualTypeOf<QueryKeys<'listSubaccounts'>>();
    expectTypeOf<keyof ListParams>().toEqualTypeOf<QueryKeys<'listSplitRules'>>();
    expectTypeOf<keyof TransferListParams>().toEqualTypeOf<QueryKeys<'listTransfers'>>();
    expectTypeOf<keyof SettlementListParams>().toEqualTypeOf<QueryKeys<'listSettlements'>>();
    expectTypeOf<keyof RefundListParams>().toEqualTypeOf<QueryKeys<'listRefunds'>>();
    expectTypeOf<keyof CheckoutSessionListParams>().toEqualTypeOf<QueryKeys<'listCheckoutSessions'>>();
    expectTypeOf<keyof PaymentLinkListParams>().toEqualTypeOf<QueryKeys<'listPaymentLinks'>>();
    expectTypeOf<keyof InvoiceListParams>().toEqualTypeOf<QueryKeys<'listInvoices'>>();
    expectTypeOf<keyof RiskEventListParams>().toEqualTypeOf<QueryKeys<'listRiskEvents'>>();
    expectTypeOf<keyof ListParams>().toEqualTypeOf<QueryKeys<'listPlans'>>();
    expectTypeOf<keyof SubscriptionListParams>().toEqualTypeOf<QueryKeys<'listSubscriptions'>>();
    expectTypeOf<keyof ReportListParams>().toEqualTypeOf<QueryKeys<'listReports'>>();
    expectTypeOf<keyof ListParams>().toEqualTypeOf<QueryKeys<'listWebhookEndpoints'>>();
    expectTypeOf<keyof WebhookDeliveryListParams>().toEqualTypeOf<QueryKeys<'listEndpointDeliveries'>>();
    expectTypeOf<keyof EventListParams>().toEqualTypeOf<QueryKeys<'listEvents'>>();
    expectTypeOf<keyof TransactionListParams>().toEqualTypeOf<QueryKeys<'listTransactions'>>();
  });

  it('single-object operations', () => {
    expectTypeOf<keyof StatementParams>().toEqualTypeOf<QueryKeys<'getStatement'>>();
    expectTypeOf<keyof PaymentRetrieveParams>().toEqualTypeOf<QueryKeys<'getPayment'>>();
    expectTypeOf<keyof PaymentRetrieveParams>().toEqualTypeOf<QueryKeys<'getPaymentByReference'>>();
    expectTypeOf<'expand'>().toEqualTypeOf<QueryKeys<'createPayment'>>();
  });

  it('events narrow on type', () => {
    expectTypeOf<EventOf<'payment.succeeded'>['data']['object']>().toEqualTypeOf<Payment>();
    expectTypeOf<Event['type']>().toEqualTypeOf<EventType>();
    expectTypeOf<ExpandedPayment['customer']>().not.toEqualTypeOf<Payment['customer']>();
  });
});
