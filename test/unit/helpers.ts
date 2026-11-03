import { vi } from 'vitest';
import { Pletopay } from '../../src/client';
import type { PletopayOptions } from '../../src/client';

export const TEST_KEY = 'sk_test_0123456789abcdef_0123456789abcdef0123456789abcdef01234567';
export const LIVE_KEY = 'sk_live_0123456789abcdef_0123456789abcdef0123456789abcdef01234567';

export interface RecordedCall {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | undefined;
  signal: AbortSignal | undefined;
  redirect: RequestInit['redirect'] | undefined;
}

type Reply = Response | Error | ((call: RecordedCall) => Response | Promise<Response>);

/** A `fetch` double that answers from a queue and records every call. */
export function fetchMock(replies: Reply[] = []) {
  const calls: RecordedCall[] = [];
  const queue = [...replies];
  const fetch = vi.fn(async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const headers: Record<string, string> = {};
    new Headers(init?.headers).forEach((value, name) => {
      headers[name] = value;
    });
    const call: RecordedCall = {
      url: typeof input === 'string' ? input : input instanceof URL ? input.href : input.url,
      method: init?.method ?? 'GET',
      headers,
      body: typeof init?.body === 'string' ? init.body : undefined,
      signal: init?.signal ?? undefined,
      redirect: init?.redirect ?? undefined,
    };
    calls.push(call);
    const next = queue.shift();
    if (!next) throw new Error(`fetchMock: no reply queued for ${call.method} ${call.url}`);
    if (next instanceof Error) throw next;
    if (typeof next === 'function') return next(call);
    return next;
  });
  return { fetch: fetch as unknown as typeof globalThis.fetch, calls, queue };
}

export function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'x-request-id': 'req_test',
      'pletopay-version': '2026-09-25',
      ...headers,
    },
  });
}

export function ok(data: unknown, message = 'OK', headers: Record<string, string> = {}): Response {
  return json(200, { status: true, message, data }, headers);
}

export function created(data: unknown, message = 'Created'): Response {
  return json(201, { status: true, message, data });
}

export function list(data: unknown[], meta: { has_more: boolean; next_cursor: string | null; url?: string }): Response {
  return json(200, { status: true, message: 'Listed', data, meta: { url: '/api/v1/x', ...meta } });
}

export function apiError(
  status: number,
  type: string,
  code: string,
  extra: { message?: string; param?: string; details?: Record<string, unknown>; headers?: Record<string, string> } = {},
): Response {
  return json(
    status,
    {
      status: false,
      message: extra.message ?? `${code} happened`,
      error: {
        type,
        code,
        ...(extra.param ? { param: extra.param } : {}),
        ...(extra.details ? { details: extra.details } : {}),
      },
      request_id: 'req_err',
    },
    extra.headers,
  );
}

export function client(fetch: typeof globalThis.fetch, options: Partial<PletopayOptions> = {}): Pletopay {
  return new Pletopay({ secretKey: TEST_KEY, baseUrl: 'http://api.test', fetch, maxRetries: 0, ...options });
}
