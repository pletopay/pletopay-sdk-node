/**
 * Resolves a beneficiary and sends a transfer with a deterministic idempotency key.
 *   PLETOPAY_SECRET_KEY=sk_test_… npx tsx examples/payout.ts
 */
import { Pletopay, PletopayApiError } from '@pletopay/node';

const pletopay = new Pletopay();
const payoutId = 'PAYOUT-2026-0001';
const beneficiary = { bank_code: '058', account_number: '0123456789' };

const who = await pletopay.transfers.resolveAccount(beneficiary);
console.log('Paying', who.account_name);

try {
  const transfer = await pletopay.transfers.create(
    { amount: 2500000, currency: 'NGN', reference: payoutId, narration: 'Vendor payout', beneficiary },
    { idempotencyKey: `payout-${payoutId}` }, // the same key on every retry: never pays twice
  );
  console.log(transfer.id, transfer.status); // processing until the outcome is known
} catch (error) {
  if (error instanceof PletopayApiError && error.code === 'duplicate_reference') {
    console.log('Already sent:', (await pletopay.transfers.retrieveByReference(payoutId)).status);
  } else if (error instanceof PletopayApiError && error.code === 'insufficient_funds') {
    console.log('Top up first:', error.details);
  } else {
    throw error;
  }
}
