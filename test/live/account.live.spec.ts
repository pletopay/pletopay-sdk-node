import { describe, expect, it } from 'vitest';
import { PletopayConflictError } from '../../src/errors';
import type { Pletopay } from '../../src/client';
import type { Customer, Invoice, Plan } from '../../src/types';
import { enabled, isBankUnavailable, liveClient, poll, unique } from './setup';

describe.skipIf(!enabled)('checkout, links, invoices, subscriptions, reports (live)', () => {
  const pletopay = enabled ? liveClient() : (undefined as unknown as Pletopay);
  let customer: Customer;
  let plan: Plan;
  let invoice: Invoice;

  it('creates, retrieves and expires a checkout session', async () => {
    const reference = unique('CS');
    const session = await pletopay.checkout.sessions.create(
      {
        amount: 150000,
        currency: 'NGN',
        reference,
        customer_email: 'ada@example.com',
        success_url: 'https://shop.example.com/ok',
      },
      { idempotencyKey: `cs-${reference}` },
    );
    expect(session.status).toBe('open');
    expect(session.url).toMatch(/^https?:\/\//);
    expect(session.token).toMatch(/^[A-Za-z0-9_-]{8,64}$/);
    expect((await pletopay.checkout.sessions.retrieveByReference(reference)).id).toBe(session.id);
    const expired = await pletopay.checkout.sessions.expire(session.id);
    expect(expired.status).toBe('expired');
    await expect(pletopay.checkout.sessions.expire(session.id)).rejects.toBeInstanceOf(PletopayConflictError);
    expect((await pletopay.checkout.sessions.list({ status: 'expired', limit: 100 })).data.map((s) => s.id)).toContain(
      session.id,
    );
  });

  it('creates and updates a payment link', async () => {
    const link = await pletopay.paymentLinks.create({ name: 'SDK donation', amount: 20000 });
    expect(link.object).toBe('payment_link');
    const updated = await pletopay.paymentLinks.update(link.id, { active: false });
    expect(updated.active).toBe(false);
    expect((await pletopay.paymentLinks.retrieve(link.id)).active).toBe(false);
  });

  it('runs an invoice through draft → finalized → void', async () => {
    customer = await pletopay.customers.create({ email: `${unique('inv')}@example.com`, name: 'Invoice Customer' });
    invoice = await pletopay.invoices.create({
      customer: customer.id,
      due_date: new Date(Date.now() + 7 * 86400000).toISOString(),
      items: [{ description: 'Consulting', quantity: 2, unit_amount: 100000 }],
    });
    expect(invoice.status).toBe('draft');
    const updated = await pletopay.invoices.update(invoice.id, { memo: 'updated' });
    expect(updated.id).toBe(invoice.id);
    const finalized = await pletopay.invoices.finalize(invoice.id);
    expect(finalized.status).toBe('open');
    const voided = await pletopay.invoices.void(invoice.id);
    expect(voided.status).toBe('void');
    expect((await pletopay.invoices.list({ customer: customer.id })).data.map((i) => i.id)).toContain(invoice.id);
  });

  it('creates a plan and a subscription, then cancels it', async () => {
    plan = await pletopay.plans.create({ name: 'SDK monthly', amount: 500000, interval: 'month' });
    expect(plan.object).toBe('plan');
    expect((await pletopay.plans.update(plan.id, { name: 'SDK monthly v2' })).name).toBe('SDK monthly v2');
    const subscription = await pletopay.subscriptions.create({
      customer: customer.id,
      plan: plan.id,
      collection_method: 'invoice',
    });
    expect(subscription.status).toBe('active');
    const cancelled = await pletopay.subscriptions.cancel(subscription.id);
    expect(cancelled.status).toBe('canceled');
    expect(
      (await pletopay.subscriptions.list({ customer: customer.id, status: 'canceled' })).data.map((s) => s.id),
    ).toContain(subscription.id);
    expect((await pletopay.plans.list()).data.map((p) => p.id)).toContain(plan.id);
  });

  it('generates and downloads a report and reads the statement and risk limits', async () => {
    const report = await pletopay.reports.create({
      type: 'payments',
      period_start: new Date(Date.now() - 7 * 86400000).toISOString(),
      period_end: new Date().toISOString(),
    });
    const ready = await poll(
      () => pletopay.reports.retrieve(report.id),
      (r) => r.status === 'succeeded' || r.status === 'failed',
    );
    expect(ready.status).toBe('succeeded');
    const csv = await pletopay.reports.download(report.id);
    expect(csv.split('\n')[0]).toMatch(/id|reference/i);
    expect((await pletopay.reports.list({ type: 'payments' })).data.map((r) => r.id)).toContain(report.id);
    const statement = await pletopay.reports.statement({
      period_start: new Date(Date.now() - 86400000),
      period_end: new Date(),
    });
    expect(statement.object).toBeDefined();
    const limits = await pletopay.risk.retrieveLimits();
    expect(limits).toBeTruthy();
    expect((await pletopay.risk.listEvents({ limit: 5 })).data).toBeInstanceOf(Array);
  });

  it('resolves a beneficiary and lists banks (skipped when the bank side is unavailable)', async () => {
    try {
      const banks = await pletopay.banks.list();
      expect(banks.data.length).toBeGreaterThan(0);
      const bank = banks.data[0]!;
      const resolution = await pletopay.transfers.resolveAccount({
        bank_code: bank.code,
        account_number: '0123456789',
      });
      expect(resolution.account_name).toBeTruthy();
    } catch (error) {
      if (!isBankUnavailable(error)) throw error;
      console.warn('bank side unavailable, skipping name enquiry assertions');
    }
  });

  it('creates a dedicated virtual account and closes it', async () => {
    try {
      const account = await pletopay.virtualAccounts.create({ type: 'dedicated', customer_id: customer.id });
      expect(['requested', 'active']).toContain(account.status);
      const active = await poll(
        () => pletopay.virtualAccounts.retrieve(account.id),
        (a) => a.status !== 'requested',
      );
      expect(active.status).toBe('active');
      expect(
        (await pletopay.virtualAccounts.list({ customer: customer.id, type: 'dedicated' })).data.map((a) => a.id),
      ).toContain(account.id);
      const closed = await pletopay.virtualAccounts.close(account.id, { reason: 'SDK live test done' });
      expect(closed.status).toBe('closed');
    } catch (error) {
      if (!isBankUnavailable(error)) throw error;
      console.warn('bank side unavailable, skipping virtual account assertions');
    }
  });
});
