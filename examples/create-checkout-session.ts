/**
 * Creates a checkout session and prints the hosted URL and the popup token.
 *   PLETOPAY_SECRET_KEY=sk_test_… npx tsx examples/create-checkout-session.ts
 */
import { Pletopay } from '@pletopay/node';

const pletopay = new Pletopay();
const orderId = `ORDER-${Date.now()}`;

const session = await pletopay.checkout.sessions.create(
  {
    amount: 250000, // ₦2,500.00 in kobo
    currency: 'NGN',
    reference: orderId,
    description: 'Two tickets',
    customer_email: 'ada@example.com',
    success_url: 'https://shop.example.com/thanks',
    cancel_url: 'https://shop.example.com/cart',
    expires_in: 1800,
  },
  { idempotencyKey: `checkout-${orderId}` },
);

console.log('Redirect the customer to:', session.url);
console.log('Or open the popup with token:', session.token);
console.log('Later, confirm on the server with pletopay.checkout.sessions.retrieve(session.id).status === "complete"');
