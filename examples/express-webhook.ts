/**
 * An Express webhook endpoint that verifies signatures, answers fast and de-duplicates.
 *   PLETOPAY_WEBHOOK_SECRET=whsec_… npx tsx examples/express-webhook.ts
 */
import express from 'express';
import type { Request, Response } from 'express';
import { Pletopay, PletopaySignatureVerificationError } from '@pletopay/node';
import type { Event } from '@pletopay/node';

const pletopay = new Pletopay({
  secretKey: process.env.PLETOPAY_SECRET_KEY ?? 'sk_test_unused_unused',
  webhookSecret: process.env.PLETOPAY_WEBHOOK_SECRET,
});
const seen = new Set<string>(); // use your database in production

const app = express();
app.post('/webhooks/pletopay', express.raw({ type: 'application/json' }), (req: Request, res: Response) => {
  let event: Event;
  try {
    event = pletopay.webhooks.constructEvent(req.body as Buffer, req.headers['x-pletopay-signature']);
  } catch (error) {
    if (error instanceof PletopaySignatureVerificationError) {
      res.status(400).send(error.message);
      return;
    }
    throw error;
  }
  res.sendStatus(200);

  if (seen.has(event.id)) return;
  seen.add(event.id);

  switch (event.type) {
    case 'payment.succeeded':
      console.log('paid', event.data.object.reference, event.data.object.amount_received);
      break;
    case 'transfer.failed':
      console.log('payout failed', event.data.object.reference, event.data.object.failure_reason);
      break;
    case 'webhook.test':
      console.log('test delivery ok');
      break;
    default:
      console.log('ignored', event.type);
  }
});

app.listen(3000, () => console.log('listening on :3000'));
