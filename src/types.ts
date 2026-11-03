/**
 * Public types. Resource and request-body shapes come straight from the OpenAPI contract
 * (src/generated/schema.ts, regenerated with `pnpm generate`), so they always match the published
 * API. Query parameters are hand-written: the API uses bracket filters (`created[gte]=…`,
 * `expand[]=customer`) that generators do not round-trip.
 */
import type { components, operations, webhooks } from './generated/schema';

export type { components, operations, webhooks };
export type Schemas = components['schemas'];
export type OperationId = keyof operations;

type JsonContent<R> = R extends { content: { 'application/json': infer C } } ? C : never;
type Responses<Op extends OperationId> = operations[Op]['responses'];

/** The success envelope (`{ status, message, data[, meta] }`) of an operation. */
export type OperationEnvelope<Op extends OperationId> = {
  [K in keyof Responses<Op>]: K extends 200 | 201 | 202 ? JsonContent<Responses<Op>[K]> : never;
}[keyof Responses<Op>];
/** The `data` member of an operation's success envelope. */
export type OperationData<Op extends OperationId> = OperationEnvelope<Op> extends { data: infer D } ? D : never;
/** The element type of a list operation's `data` array. */
export type OperationItem<Op extends OperationId> = OperationData<Op> extends Array<infer T> ? T : never;
/** The JSON request body of an operation. */
export type OperationBody<Op extends OperationId> = operations[Op] extends {
  requestBody: { content: { 'application/json': infer B } };
}
  ? B
  : operations[Op] extends { requestBody?: { content: { 'application/json': infer B } } }
    ? B
    : never;

// ───────────── resources ─────────────

export type Customer = Schemas['Customer'];
export type Payment = Schemas['Payment'];
export type BankTransferInstructions = Schemas['BankTransferInstructions'];
export type VirtualAccount = Schemas['VirtualAccount'];
export type Subaccount = Schemas['Subaccount'];
export type SubaccountBalance = Schemas['SubaccountBalance'];
export type SplitRule = Schemas['SplitRule'];
export type Transfer = Schemas['Transfer'];
export type AccountResolution = Schemas['AccountResolution'];
export type Bank = Schemas['Bank'];
export type Settlement = Schemas['Settlement'];
export type SettlementItem = Schemas['SettlementItem'];
export type Refund = Schemas['Refund'];
export type CheckoutSession = Schemas['CheckoutSession'];
export type PaymentLink = Schemas['PaymentLink'];
export type Invoice = Schemas['Invoice'];
export type InvoiceItem = Schemas['InvoiceItem'];
export type InvoiceTax = Schemas['InvoiceTax'];
export type RiskEvent = Schemas['RiskEvent'];
export type RiskLimits = Schemas['RiskLimits'];
export type Plan = Schemas['Plan'];
export type Subscription = Schemas['Subscription'];
export type Report = Schemas['Report'];
export type Statement = Schemas['Statement'];
export type Balance = Schemas['Balance'];
export type LedgerTransaction = Schemas['LedgerTransaction'];
export type WebhookEndpoint = Schemas['WebhookEndpoint'];
export type WebhookDelivery = Schemas['WebhookDelivery'];
export type WebhookTest = Schemas['WebhookTest'];
export type DeletedObject = Schemas['DeletedObject'];
export type SimulatedTransfer = Schemas['SimulatedTransfer'];
export type ListMeta = Schemas['ListMeta'];
export type ApiErrorBody = Schemas['Error'];
export type ApiErrorType = ApiErrorBody['error']['type'];

export type PaymentStatus = Payment['status'];
export type TransferStatus = Transfer['status'];
export type RefundStatus = Refund['status'];
export type VirtualAccountStatus = VirtualAccount['status'];
export type CheckoutSessionStatus = CheckoutSession['status'];
export type InvoiceStatus = Invoice['status'];
export type SubscriptionStatus = Subscription['status'];
export type SettlementStatus = Settlement['status'];
export type WebhookEndpointStatus = WebhookEndpoint['status'];
export type WebhookDeliveryStatus = WebhookDelivery['status'];
export type ReportType = Report['type'];
export type ReportStatus = Report['status'];

/** A payment with `expand: ['customer']`: `customer` is the full object instead of its id. */
export type ExpandedPayment = Omit<Payment, 'customer'> & { customer: Customer | null };

// ───────────── request bodies ─────────────

export type CustomerCreateParams = Schemas['CreateCustomerDto'];
export type CustomerUpdateParams = Schemas['UpdateCustomerDto'];
export type CustomerRiskStatusParams = Schemas['CustomerRiskDto'];
export type PaymentCreateParams = Schemas['CreatePaymentDto'];
export type VirtualAccountCreateParams = Schemas['CreateVirtualAccountDto'];
export type VirtualAccountCloseParams = Schemas['CloseVirtualAccountDto'];
export type SubaccountCreateParams = Schemas['CreateSubaccountDto'];
export type SubaccountUpdateParams = Schemas['UpdateSubaccountDto'];
export type SplitRuleCreateParams = Schemas['CreateSplitRuleDto'];
export type SplitRuleUpdateParams = Schemas['UpdateSplitRuleDto'];
export type SplitAllocation = Schemas['SplitAllocationDto'];
export type TransferCreateParams = Schemas['CreateTransferDto'];
export type Beneficiary = Schemas['BeneficiaryDto'];
export type NameEnquiryParams = Schemas['NameEnquiryDto'];
export type RefundCreateParams = Schemas['CreateRefundDto'];
export type RefundDestination = Schemas['RefundDestinationDto'];
export type CheckoutSessionCreateParams = Schemas['CreateCheckoutSessionDto'];
export type PaymentLinkCreateParams = Schemas['CreatePaymentLinkDto'];
export type PaymentLinkUpdateParams = Schemas['UpdatePaymentLinkDto'];
export type InvoiceCreateParams = Schemas['CreateInvoiceDto'];
export type InvoiceUpdateParams = Schemas['UpdateInvoiceDto'];
export type InvoiceItemParams = Schemas['InvoiceItemDto'];
export type InvoiceTaxParams = Schemas['InvoiceTaxDto'];
export type PlanCreateParams = Schemas['CreatePlanDto'];
export type PlanUpdateParams = Schemas['UpdatePlanDto'];
export type SubscriptionCreateParams = Schemas['CreateSubscriptionDto'];
export type SubscriptionCancelParams = Schemas['CancelSubscriptionDto'];
export type ReportCreateParams = Schemas['CreateReportDto'];
export type WebhookEndpointCreateParams = Schemas['CreateWebhookEndpointDto'];
export type WebhookEndpointUpdateParams = Schemas['UpdateWebhookEndpointDto'];
export type EventReplayParams = Schemas['ReplayEventDto'];
export type SimulateTransferParams = Schemas['SimulateTransferDto'];

// ───────────── query parameters ─────────────

/** ISO-8601 string or a Date (serialised as UTC ISO-8601). */
export type DateLike = string | Date;

/** `created[gte]=…` style filter on a timestamp. */
export interface DateRangeFilter {
  gt?: DateLike;
  gte?: DateLike;
  lt?: DateLike;
  lte?: DateLike;
}

/** `amount[gte]=…` style filter, in kobo. */
export interface AmountRangeFilter {
  gte?: number;
  lte?: number;
}

/** Cursor pagination shared by every list. Results are newest first. */
export interface ListParams {
  /** 1–100, default 10. */
  limit?: number;
  /** Return objects created before this object id (older). Pass `meta.next_cursor`. */
  starting_after?: string;
  /** Return objects created after this object id (newer). Not together with `starting_after`. */
  ending_before?: string;
  created?: DateRangeFilter;
}

export type PaymentExpand = 'customer';

export interface CustomerListParams extends ListParams {
  /** Only the customer with this email. */
  email?: string;
}

export interface PaymentListParams extends ListParams {
  status?: PaymentStatus;
  customer?: string;
  reference?: string;
  /** Free-text search. */
  q?: string;
  /** Amount received, in kobo. */
  amount?: AmountRangeFilter;
  virtual_account?: string;
  expand?: PaymentExpand[];
}

export interface PaymentRetrieveParams {
  expand?: PaymentExpand[];
}

export interface VirtualAccountListParams extends ListParams {
  type?: 'dedicated' | 'dynamic';
  customer?: string;
  status?: VirtualAccountStatus;
  account_number?: string;
}

export interface TransferListParams extends ListParams {
  status?: TransferStatus;
}

export interface SettlementListParams extends ListParams {
  status?: SettlementStatus;
  subaccount?: string;
}

export interface RefundListParams extends ListParams {
  payment?: string;
}

export interface CheckoutSessionListParams extends ListParams {
  status?: CheckoutSessionStatus;
  payment_link?: string;
}

export interface PaymentLinkListParams extends ListParams {
  status?: 'active' | 'inactive';
}

export interface InvoiceListParams extends ListParams {
  status?: InvoiceStatus;
  customer?: string;
  subscription?: string;
}

export interface RiskEventListParams extends ListParams {
  review_status?: 'open' | 'cleared' | 'confirmed';
}

export interface SubscriptionListParams extends ListParams {
  status?: SubscriptionStatus;
  customer?: string;
}

export interface ReportListParams extends ListParams {
  type?: ReportType;
  status?: ReportStatus;
}

export interface StatementParams {
  period_start: DateLike;
  period_end: DateLike;
}

export interface WebhookDeliveryListParams extends ListParams {
  status?: WebhookDeliveryStatus;
}

export interface EventListParams extends ListParams {
  type?: EventType;
  /** Only events about this resource id. */
  resource_id?: string;
}

export type LedgerTransactionType = LedgerTransaction['type'];
export type LedgerTransactionSource = 'payment' | 'transfer' | 'account_transaction' | 'adjustment';

export interface TransactionListParams extends ListParams {
  type?: LedgerTransactionType;
  source?: LedgerTransactionSource;
}

// ───────────── webhook events ─────────────

/** Every event the API can send, discriminated on `type`. */
export type Event = {
  [K in keyof webhooks]: webhooks[K]['post']['requestBody']['content']['application/json'];
}[keyof webhooks];
export type EventType = Event['type'];
/** The event for one `type`, e.g. `EventOf<'payment.succeeded'>`. */
export type EventOf<T extends EventType> = Extract<Event, { type: T }>;
/** An event whose type this SDK version does not know. Handle it as data, or ignore it. */
export interface UnknownEvent {
  id: string;
  object: 'event';
  type: string;
  api_version: string;
  livemode: boolean;
  created_at: string;
  data: { object: Record<string, unknown> };
}
