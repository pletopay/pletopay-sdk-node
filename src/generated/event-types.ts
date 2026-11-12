/* eslint-disable */
/* prettier-ignore */
// Generated from spec/public.v1.yaml by scripts/generate.mjs. Do not edit by hand.

/** Every webhook event type the API can send. New types may be added at any time; ignore ones you do not handle. */
export const EVENT_TYPES = [
  'balance.funded',
  'checkout.session.completed',
  'checkout.session.expired',
  'invoice.created',
  'invoice.finalized',
  'invoice.marked_uncollectible',
  'invoice.paid',
  'invoice.voided',
  'payment.created',
  'payment.expired',
  'payment.failed',
  'payment.partially_refunded',
  'payment.pending',
  'payment.refunded',
  'payment.reversed',
  'payment.succeeded',
  'payment.under_review',
  'refund.created',
  'refund.failed',
  'refund.succeeded',
  'report.failed',
  'report.ready',
  'risk.event_flagged',
  'settlement.completed',
  'settlement.created',
  'settlement.failed',
  'subscription.canceled',
  'subscription.created',
  'subscription.past_due',
  'subscription.updated',
  'transfer.created',
  'transfer.failed',
  'transfer.processing',
  'transfer.reversed',
  'transfer.succeeded',
  'transfer_batch.completed',
  'transfer_batch.processing',
  'virtual_account.closed',
  'virtual_account.created',
  'virtual_account.updated',
  'webhook.test',
] as const;
export type GeneratedEventType = (typeof EVENT_TYPES)[number];

/** The dated API version the committed contract describes (`info.version`). */
export const SPEC_API_VERSION = '2026-09-25';
