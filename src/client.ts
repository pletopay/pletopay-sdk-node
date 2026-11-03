import {
  PletopayApiError,
  PletopayConnectionError,
  PletopayError,
  PletopayTimeoutError,
  rateLimitFromHeaders,
  retryAfterMs,
} from './errors';
import type { RateLimitInfo } from './errors';
import { SPEC_API_VERSION } from './generated/event-types';
import { assertIdempotencyKey, generateIdempotencyKey } from './core/idempotency';
import { Page, toPagePromise } from './core/pagination';
import type { PagePromise } from './core/pagination';
import { encodeQuery } from './core/query';
import type { QueryValue } from './core/query';
import { DEFAULT_MAX_RETRIES, DEFAULT_TIMEOUT_MS, isRetryableStatus, retryDelayMs, sleep } from './core/retry';
import type { HttpMethod, Idempotency, OperationDef } from './operations';
import { Balance } from './resources/balance';
import { Banks } from './resources/banks';
import { Checkout } from './resources/checkout';
import { Customers } from './resources/customers';
import { Events } from './resources/events';
import { Invoices } from './resources/invoices';
import { PaymentLinks } from './resources/payment-links';
import { Payments } from './resources/payments';
import { Plans } from './resources/plans';
import { Refunds } from './resources/refunds';
import { Reports } from './resources/reports';
import { Risk } from './resources/risk';
import { Sandbox } from './resources/sandbox';
import { Settlements } from './resources/settlements';
import { SplitRules } from './resources/split-rules';
import { Subaccounts } from './resources/subaccounts';
import { Subscriptions } from './resources/subscriptions';
import { Transactions } from './resources/transactions';
import { Transfers } from './resources/transfers';
import { VirtualAccounts } from './resources/virtual-accounts';
import { WebhookEndpoints } from './resources/webhook-endpoints';
import type { ListMeta, OperationData, OperationId, OperationItem } from './types';
import { VERSION } from './version';
import { Webhooks } from './webhooks';

export type Mode = 'test' | 'live';

/** A minimal logger; `console` fits. */
export interface Logger {
  debug(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
}

export interface RequestHookContext {
  method: HttpMethod;
  url: string;
  /** Request headers with `authorization` redacted. */
  headers: Record<string, string>;
  /** 0 for the first attempt. */
  attempt: number;
  idempotencyKey: string | undefined;
}
export interface ResponseHookContext extends RequestHookContext {
  status: number;
  requestId: string | undefined;
  durationMs: number;
}
export interface RetryHookContext extends RequestHookContext {
  reason: 'connection' | 'timeout' | 'status';
  status: number | undefined;
  code: string | undefined;
  delayMs: number;
}
export interface PletopayHooks {
  onRequest?(context: RequestHookContext): void | Promise<void>;
  onResponse?(context: ResponseHookContext): void | Promise<void>;
  onRetry?(context: RetryHookContext): void | Promise<void>;
}

export interface PletopayOptions {
  /** `sk_test_…` or `sk_live_…`. Defaults to `process.env.PLETOPAY_SECRET_KEY`. */
  secretKey?: string;
  /** Defaults to `process.env.PLETOPAY_API_URL`, then `https://api.pletopay.com`. */
  baseUrl?: string;
  /**
   * Dated `PletoPay-Version` to send. Defaults to the version this SDK's types describe
   * (`Pletopay.API_VERSION`). `null` sends none, so the version pinned on your organization applies.
   */
  apiVersion?: string | null;
  /** Per-request timeout. Default 30 000 ms. */
  timeoutMs?: number;
  /** Automatic retries of safe requests on network errors, 429, 5xx. Default 2. */
  maxRetries?: number;
  /** Custom `fetch` (tests, instrumentation). Defaults to the global one. */
  fetch?: typeof globalThis.fetch;
  /** An undici `Dispatcher` (proxy, keep-alive tuning), passed to `fetch` as `dispatcher`. */
  dispatcher?: unknown;
  /** `X-Correlation-Id` for every request: a fixed value or a factory. */
  correlationId?: string | (() => string);
  /** `whsec_…`, used by `pletopay.webhooks.constructEvent` when no secret is passed there. */
  webhookSecret?: string;
  /** Signature timestamp tolerance in seconds. Default 300. */
  webhookTolerance?: number;
  hooks?: PletopayHooks;
  logger?: Logger;
  /** Identifies your integration in the `User-Agent` (e.g. a plugin name and version). */
  appInfo?: { name: string; version?: string; url?: string };
}

/** Per-call options accepted by every resource method. */
export interface RequestOptions {
  /** Your own `Idempotency-Key`. Use a deterministic one (e.g. your order id) for money movement. */
  idempotencyKey?: string;
  timeoutMs?: number;
  maxRetries?: number;
  /** Cancels the request (and any retry). */
  signal?: AbortSignal;
  correlationId?: string;
  /** Overrides the client's `PletoPay-Version` for this call. */
  apiVersion?: string;
  /** Extra headers (cannot override authorization). */
  headers?: Record<string, string>;
}

/** What `pletopay.request()` resolves to: the envelope plus the headers worth reading. */
export interface PletopayResponse<T = unknown> {
  data: T;
  /** The API's human-readable outcome. Don't branch on it. */
  message: string;
  /** Present on lists. */
  meta: ListMeta | undefined;
  /** HTTP status code. */
  status: number;
  headers: Headers;
  /** `X-Request-Id`. Quote it to support. */
  requestId: string | undefined;
  /** The `PletoPay-Version` the API applied. */
  apiVersion: string | undefined;
  /** The `Idempotency-Key` sent (yours or generated). */
  idempotencyKey: string | undefined;
  /** `Idempotent-Replayed: true`: this is the stored response of an earlier identical request. */
  idempotentReplayed: boolean;
  rateLimit: RateLimitInfo | undefined;
  /** `Deprecation` / `Sunset` headers, when the API announces a retirement. */
  deprecation: string | undefined;
  sunset: string | undefined;
}

export interface RawRequestInit {
  query?: object | undefined;
  body?: unknown;
  options?: RequestOptions | undefined;
  /** How `Idempotency-Key` is handled. Default: none. */
  idempotency?: Idempotency;
  /** `text/csv` returns the body as a string in `data`. */
  accept?: 'application/json' | 'text/csv';
  testModeOnly?: boolean;
}

export interface CallArgs {
  /** Values for the `{param}` placeholders in the operation path. */
  path?: Record<string, string>;
  query?: object | undefined;
  body?: unknown;
  options?: RequestOptions | undefined;
}

const LAST_RESPONSE = Symbol.for('pletopay.lastResponse');

/** The response metadata (request id, rate limit, …) behind an object a resource method returned. */
export function lastResponseOf(resource: unknown): PletopayResponse | undefined {
  if (typeof resource !== 'object' || resource === null) return undefined;
  return (resource as { [LAST_RESPONSE]?: PletopayResponse })[LAST_RESPONSE];
}

function attachLastResponse<T>(data: T, response: PletopayResponse): T {
  if (typeof data === 'object' && data !== null && !Object.isFrozen(data)) {
    Object.defineProperty(data, LAST_RESPONSE, { value: response, enumerable: false, configurable: true });
  }
  return data;
}

type FetchInit = NonNullable<Parameters<typeof globalThis.fetch>[1]>;

const SECRET_KEY_PATTERN = /^sk_(test|live)_[A-Za-z0-9_]+$/;

export class Pletopay {
  static readonly DEFAULT_BASE_URL = 'https://api.pletopay.com';
  /** The dated API version whose shapes this SDK's types describe. */
  static readonly API_VERSION: string = SPEC_API_VERSION;
  static readonly VERSION = VERSION;

  /** `test` or `live`, from the key prefix. */
  readonly mode: Mode;
  readonly baseUrl: string;
  readonly apiVersion: string | null;
  readonly timeoutMs: number;
  readonly maxRetries: number;

  readonly customers: Customers;
  readonly payments: Payments;
  readonly virtualAccounts: VirtualAccounts;
  readonly subaccounts: Subaccounts;
  readonly splitRules: SplitRules;
  readonly transfers: Transfers;
  readonly banks: Banks;
  readonly settlements: Settlements;
  readonly refunds: Refunds;
  readonly checkout: Checkout;
  readonly paymentLinks: PaymentLinks;
  readonly invoices: Invoices;
  readonly risk: Risk;
  readonly plans: Plans;
  readonly subscriptions: Subscriptions;
  readonly reports: Reports;
  readonly webhookEndpoints: WebhookEndpoints;
  readonly events: Events;
  readonly balance: Balance;
  readonly transactions: Transactions;
  readonly sandbox: Sandbox;
  /** Signature verification for incoming webhooks. */
  readonly webhooks: Webhooks;

  private readonly secretKey: string;
  private readonly fetchImpl: typeof globalThis.fetch;
  private readonly dispatcher: unknown;
  private readonly correlationId: string | (() => string) | undefined;
  private readonly hooks: PletopayHooks;
  private readonly logger: Logger | undefined;
  private readonly userAgent: string;

  constructor(options: PletopayOptions = {}) {
    const secretKey = options.secretKey ?? process.env.PLETOPAY_SECRET_KEY;
    if (!secretKey) {
      throw new PletopayError(
        'No secret key. Pass `secretKey` or set PLETOPAY_SECRET_KEY (Dashboard → Settings → Developers → API keys).',
      );
    }
    if (secretKey.startsWith('pk_')) {
      throw new PletopayError(
        'A publishable key (pk_…) cannot call the API. Use your secret key (sk_test_… / sk_live_…) on the server only.',
      );
    }
    if (!SECRET_KEY_PATTERN.test(secretKey)) {
      throw new PletopayError('The secret key must look like sk_test_… or sk_live_…');
    }
    this.secretKey = secretKey;
    this.mode = secretKey.startsWith('sk_live_') ? 'live' : 'test';
    this.baseUrl = (options.baseUrl ?? process.env.PLETOPAY_API_URL ?? Pletopay.DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.apiVersion = options.apiVersion === undefined ? Pletopay.API_VERSION : options.apiVersion;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    if (!Number.isInteger(this.maxRetries) || this.maxRetries < 0)
      throw new PletopayError('maxRetries must be a non-negative integer');
    if (!(this.timeoutMs > 0)) throw new PletopayError('timeoutMs must be a positive number');
    this.fetchImpl = options.fetch ?? globalThis.fetch;
    if (typeof this.fetchImpl !== 'function')
      throw new PletopayError('No fetch available: use Node 20+ or pass `fetch`');
    this.dispatcher = options.dispatcher;
    this.correlationId = options.correlationId;
    this.hooks = options.hooks ?? {};
    this.logger = options.logger;
    const app = options.appInfo
      ? ` ${options.appInfo.name}${options.appInfo.version ? `/${options.appInfo.version}` : ''}${options.appInfo.url ? ` (${options.appInfo.url})` : ''}`
      : '';
    this.userAgent = `pletopay-node/${VERSION} node/${process.versions.node}${app}`;

    this.customers = new Customers(this);
    this.payments = new Payments(this);
    this.virtualAccounts = new VirtualAccounts(this);
    this.subaccounts = new Subaccounts(this);
    this.splitRules = new SplitRules(this);
    this.transfers = new Transfers(this);
    this.banks = new Banks(this);
    this.settlements = new Settlements(this);
    this.refunds = new Refunds(this);
    this.checkout = new Checkout(this);
    this.paymentLinks = new PaymentLinks(this);
    this.invoices = new Invoices(this);
    this.risk = new Risk(this);
    this.plans = new Plans(this);
    this.subscriptions = new Subscriptions(this);
    this.reports = new Reports(this);
    this.webhookEndpoints = new WebhookEndpoints(this);
    this.events = new Events(this);
    this.balance = new Balance(this);
    this.transactions = new Transactions(this);
    this.sandbox = new Sandbox(this);
    this.webhooks = new Webhooks({ secret: options.webhookSecret, tolerance: options.webhookTolerance });
  }

  /**
   * Calls one operation and resolves to its `data` (with the response metadata reachable through
   * `lastResponseOf`). Resource methods are thin wrappers over this.
   * @internal
   */
  async call<Op extends OperationId>(def: OperationDef<Op>, args: CallArgs = {}): Promise<OperationData<Op>> {
    const response = await this.request<OperationData<Op>>(def.method, `/api/v1${fillPath(def.path, args.path)}`, {
      query: args.query,
      body: args.body,
      options: args.options,
      idempotency: def.idempotency,
      accept: def.accept ?? 'application/json',
      testModeOnly: def.testModeOnly === true,
    });
    return attachLastResponse(response.data, response);
  }

  /**
   * Calls a list operation and resolves to a `Page` that can be iterated across every page.
   * @internal
   */
  list<Op extends OperationId>(def: OperationDef<Op>, args: CallArgs = {}): PagePromise<OperationItem<Op>> {
    type Item = OperationItem<Op>;
    const fetchPage = async (query: object | undefined): Promise<Page<Item>> => {
      const response = await this.request<Item[]>(def.method, `/api/v1${fillPath(def.path, args.path)}`, {
        query,
        body: args.body,
        options: args.options,
        idempotency: def.idempotency,
        testModeOnly: def.testModeOnly === true,
      });
      const page: Page<Item> = new Page(response, (cursor) =>
        fetchPage({ ...query, starting_after: cursor, ending_before: undefined }),
      );
      attachLastResponse(page.data, response);
      return page;
    };
    return toPagePromise(fetchPage(args.query));
  }

  /**
   * Sends one request and resolves to the full envelope. `path` is relative to the base URL
   * (e.g. `/api/v1/payments`). Use it for endpoints newer than this SDK.
   */
  async request<T = unknown>(
    method: HttpMethod,
    path: string,
    init: RawRequestInit = {},
  ): Promise<PletopayResponse<T>> {
    const options = init.options ?? {};
    const idempotency = init.idempotency ?? 'none';
    if (init.testModeOnly && this.mode === 'live') {
      throw new PletopayError(`${method} ${path} is only available in test mode (use an sk_test_ key)`);
    }
    let idempotencyKey: string | undefined;
    if (options.idempotencyKey !== undefined) {
      assertIdempotencyKey(options.idempotencyKey);
      idempotencyKey = options.idempotencyKey;
    } else if (idempotency !== 'none') {
      idempotencyKey = generateIdempotencyKey();
    }

    const url = `${this.baseUrl}${path}${encodeQuery(init.query as Record<string, QueryValue> | undefined)}`;
    const headers = new Headers();
    headers.set('accept', init.accept ?? 'application/json');
    headers.set('user-agent', this.userAgent);
    const apiVersion = options.apiVersion ?? this.apiVersion;
    if (apiVersion) headers.set('pletopay-version', apiVersion);
    if (idempotencyKey !== undefined) headers.set('idempotency-key', idempotencyKey);
    const correlationId =
      options.correlationId ?? (typeof this.correlationId === 'function' ? this.correlationId() : this.correlationId);
    if (correlationId) headers.set('x-correlation-id', correlationId);
    for (const [name, value] of Object.entries(options.headers ?? {})) {
      if (name.toLowerCase() === 'authorization') continue;
      headers.set(name, value);
    }
    headers.set('authorization', `Bearer ${this.secretKey}`);
    const bodyText = init.body === undefined ? undefined : JSON.stringify(init.body);
    if (bodyText !== undefined) headers.set('content-type', 'application/json');

    const maxRetries = options.maxRetries ?? this.maxRetries;
    const retryable = method === 'GET' || method === 'DELETE' || idempotencyKey !== undefined;
    const timeoutMs = options.timeoutMs ?? this.timeoutMs;
    const hookBase = { method, url, headers: redact(headers), idempotencyKey };

    for (let attempt = 0; ; attempt++) {
      const timeoutSignal = AbortSignal.timeout(timeoutMs);
      const signal = options.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal;
      const startedAt = Date.now();
      await this.hooks.onRequest?.({ ...hookBase, attempt });
      this.logger?.debug(`pletopay: ${method} ${path}`, { attempt, idempotencyKey });

      let res: Response;
      try {
        // The API never redirects. A redirect would mean a misconfigured proxy or a hijacked DNS
        // name, and following it could replay the request (and its secret key) elsewhere.
        const fetchInit: FetchInit = { method, headers, body: bodyText, signal, redirect: 'error' };
        if (this.dispatcher !== undefined) (fetchInit as { dispatcher?: unknown }).dispatcher = this.dispatcher;
        res = await this.fetchImpl(url, fetchInit);
      } catch (cause) {
        if (options.signal?.aborted) throw options.signal.reason instanceof Error ? options.signal.reason : cause;
        const timedOut = timeoutSignal.aborted;
        const error = timedOut
          ? new PletopayTimeoutError(`${method} ${path} timed out after ${timeoutMs} ms`, { cause })
          : new PletopayConnectionError(`${method} ${path} failed: ${describe(cause)}`, { cause });
        if (retryable && attempt < maxRetries) {
          const delayMs = retryDelayMs(attempt);
          await this.hooks.onRetry?.({
            ...hookBase,
            attempt,
            reason: timedOut ? 'timeout' : 'connection',
            status: undefined,
            code: undefined,
            delayMs,
          });
          this.logger?.warn(`pletopay: retrying ${method} ${path} after ${error.name}`, { attempt, delayMs });
          await sleep(delayMs, options.signal);
          continue;
        }
        throw error;
      }

      const requestId = res.headers.get('x-request-id') ?? undefined;
      await this.hooks.onResponse?.({
        ...hookBase,
        attempt,
        status: res.status,
        requestId,
        durationMs: Date.now() - startedAt,
      });

      if (res.ok) {
        const envelope = await parseSuccess(res, init.accept ?? 'application/json');
        return {
          data: envelope.data as T,
          message: envelope.message,
          meta: envelope.meta,
          status: res.status,
          headers: res.headers,
          requestId,
          apiVersion: res.headers.get('pletopay-version') ?? undefined,
          idempotencyKey,
          idempotentReplayed: res.headers.get('idempotent-replayed') === 'true',
          rateLimit: rateLimitFromHeaders(res.headers),
          deprecation: res.headers.get('deprecation') ?? undefined,
          sunset: res.headers.get('sunset') ?? undefined,
        };
      }

      const body = await parseBody(res);
      const error = PletopayApiError.fromResponse(res.status, body, res.headers);
      if (retryable && attempt < maxRetries && isRetryableStatus(res.status, error.code)) {
        const delayMs = retryDelayMs(attempt, {
          retryAfterMs: retryAfterMs(res.headers),
          status: res.status,
          code: error.code,
        });
        await this.hooks.onRetry?.({
          ...hookBase,
          attempt,
          reason: 'status',
          status: res.status,
          code: error.code,
          delayMs,
        });
        this.logger?.warn(`pletopay: retrying ${method} ${path} after HTTP ${res.status}`, {
          attempt,
          delayMs,
          code: error.code,
        });
        await sleep(delayMs, options.signal);
        continue;
      }
      throw error;
    }
  }
}

function fillPath(template: string, params: Record<string, string> | undefined): string {
  return template.replace(/\{(\w+)\}/g, (_match, name: string) => {
    const value = params?.[name];
    if (typeof value !== 'string' || value.length === 0) {
      throw new PletopayError(`${name} is required and must be a non-empty string`);
    }
    return encodeURIComponent(value);
  });
}

function redact(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((value, name) => {
    out[name] = name === 'authorization' ? 'Bearer sk_***' : value;
  });
  return out;
}

function describe(cause: unknown): string {
  if (cause instanceof Error) {
    const inner = (cause as { cause?: unknown }).cause;
    return inner instanceof Error ? `${cause.message} (${inner.message})` : cause.message;
  }
  return String(cause);
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

interface Envelope {
  data: unknown;
  message: string;
  meta: ListMeta | undefined;
}

async function parseSuccess(res: Response, accept: string): Promise<Envelope> {
  if (accept === 'text/csv') {
    return { data: await res.text(), message: 'OK', meta: undefined };
  }
  const body = await parseBody(res);
  if (typeof body === 'object' && body !== null && 'status' in body && 'data' in body) {
    const envelope = body as { status: unknown; message?: unknown; data: unknown; meta?: unknown };
    return {
      data: envelope.data,
      message: typeof envelope.message === 'string' ? envelope.message : '',
      meta: isListMeta(envelope.meta) ? envelope.meta : undefined,
    };
  }
  throw new PletopayApiError(res.status, body, res.headers, 'The API returned an unexpected response body');
}

function isListMeta(value: unknown): value is ListMeta {
  return typeof value === 'object' && value !== null && 'has_more' in value && 'next_cursor' in value;
}
