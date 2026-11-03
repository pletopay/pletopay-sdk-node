import { describe, expect, it } from 'vitest';
import { lastResponseOf } from '../../src/client';
import {
  PletopayConflictError,
  PletopayIdempotencyError,
  PletopayInvalidRequestError,
  PletopayNotFoundError,
} from '../../src/errors';
import type { Customer, Payment } from '../../src/types';
import { enabled, liveClient, poll, unique } from './setup';

describe.skipIf(!enabled)('payments (live)', () => {
  const pletopay = enabled ? liveClient() : (undefined as never);
  let customer: Customer;
  let payment: Payment;

  it('creates a customer', async () => {
    customer = await pletopay.customers.create({
      email: `${unique('ada')}@example.com`,
      name: 'Ada Okeke',
      metadata: { via: 'sdk' },
    });
    expect(customer.object).toBe('customer');
    expect(customer.livemode).toBe(false);
    expect(lastResponseOf(customer)?.requestId).toMatch(/^req_/);
    expect(lastResponseOf(customer)?.apiVersion).toBe('2026-09-25');
    expect(lastResponseOf(customer)?.status).toBe(201);
  });

  it('creates a payment with transfer instructions and embeds the customer on request', async () => {
    const reference = unique('ORDER');
    payment = await pletopay.payments.create(
      {
        amount: 250000,
        currency: 'NGN',
        reference,
        customer: { id: customer.id },
        description: 'SDK live test',
        metadata: { reference },
      },
      { idempotencyKey: `create-${reference}` },
    );
    expect(payment.status).toBe('pending');
    expect(payment.bank_transfer?.account_number).toMatch(/^\d{10}$/);
    expect(payment.customer).toBe(customer.id);

    const expanded = await pletopay.payments.retrieve(payment.id, { expand: ['customer'] });
    expect(expanded.customer?.id).toBe(customer.id);
    expect(expanded.customer?.email).toBe(customer.email);
  });

  it('replays an identical request with the same Idempotency-Key and rejects a different body', async () => {
    const reference = unique('IDEM');
    const body = { amount: 100000, currency: 'NGN' as const, reference };
    const first = await pletopay.payments.create(body, { idempotencyKey: `k-${reference}` });
    const second = await pletopay.payments.create(body, { idempotencyKey: `k-${reference}` });
    expect(second.id).toBe(first.id);
    expect(lastResponseOf(first)?.idempotentReplayed).toBe(false);
    expect(lastResponseOf(second)?.idempotentReplayed).toBe(true);
    await expect(
      pletopay.payments.create({ ...body, amount: 100001 }, { idempotencyKey: `k-${reference}` }),
    ).rejects.toBeInstanceOf(PletopayIdempotencyError);
  });

  it('maps API errors to typed classes', async () => {
    await expect(
      pletopay.payments.create({ amount: 1, currency: 'NGN', reference: payment.reference }),
    ).rejects.toMatchObject({
      code: 'duplicate_reference',
      constructor: PletopayConflictError,
    });
    const invalid = await pletopay.payments
      .create({ amount: -5, currency: 'NGN', reference: unique('X') })
      .catch((e: unknown) => e);
    expect(invalid).toBeInstanceOf(PletopayInvalidRequestError);
    expect((invalid as PletopayInvalidRequestError).param).toBe('amount');
    await expect(pletopay.payments.retrieve('pay_01J8Z5X7Q9K2M4N6P8R0S2T4V6')).rejects.toBeInstanceOf(
      PletopayNotFoundError,
    );
  });

  it('succeeds after a simulated transfer and is found by reference', async () => {
    const simulated = await pletopay.sandbox.simulateTransfer({
      account_number: payment.bank_transfer!.account_number,
      amount: payment.amount!,
    });
    expect(simulated.object).toBeDefined();
    const paid = await poll(
      () => pletopay.payments.retrieve(payment.id),
      (p) => p.status === 'succeeded',
    );
    expect(paid.amount_received).toBe(payment.amount);
    const byRef = await pletopay.payments.retrieveByReference(payment.reference);
    expect(byRef.id).toBe(payment.id);
    payment = paid;
  });

  it('lists with filters and paginates with bracket query parameters', async () => {
    const page = await pletopay.payments.list({
      limit: 1,
      customer: customer.id,
      created: { gte: new Date(Date.now() - 3600000) },
    });
    expect(page.data).toHaveLength(1);
    expect(page.hasMore).toBe(false);
    const all = await pletopay.payments.list({ limit: 1 }).autoPagingToArray({ limit: 3 });
    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(new Set(all.map((p) => p.id)).size).toBe(all.length);
    const succeeded = await pletopay.payments.list({
      status: 'succeeded',
      amount: { gte: payment.amount! },
      limit: 100,
    });
    expect(succeeded.data.some((p) => p.id === payment.id)).toBe(true);
  });

  it('updates metadata by merging and lists transactions and the balance', async () => {
    const updated = await pletopay.customers.update(customer.id, { metadata: { tier: 'gold', via: '' } });
    expect(updated.metadata).toEqual({ tier: 'gold' });
    const balance = await pletopay.balance.retrieve();
    expect(balance.object).toBe('balance');
    expect(balance.currency).toBe('NGN');
    const tx = await pletopay.transactions.list({ limit: 5, source: 'payment' });
    expect(tx.data.length).toBeGreaterThan(0);
    expect(tx.data[0]!.object).toBeDefined();
  });

  it('refunds the payment with a deterministic key', async () => {
    const reference = unique('REF');
    const refund = await pletopay.refunds.create(
      { payment: payment.id, amount: 50000, reason: 'SDK live test refund', reference },
      { idempotencyKey: `refund-${reference}` },
    );
    expect(refund.payment).toBe(payment.id);
    expect(['pending', 'processing', 'succeeded']).toContain(refund.status);
    expect((await pletopay.refunds.retrieveByReference(reference)).id).toBe(refund.id);
    expect((await pletopay.refunds.list({ payment: payment.id })).data.map((r) => r.id)).toContain(refund.id);
  });
});
