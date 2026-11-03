import { createServer } from 'node:http';
import type { Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { constructEvent } from '../../src/webhooks';
import type { Event, WebhookEndpoint } from '../../src/types';
import { enabled, liveClient, poll } from './setup';

interface Delivery {
  headers: Record<string, string | string[] | undefined>;
  body: Buffer;
}

describe.skipIf(!enabled)('webhooks (live)', () => {
  const pletopay = enabled ? liveClient() : (undefined as never);
  const deliveries: Delivery[] = [];
  let server: Server;
  let url: string;
  let endpoint: WebhookEndpoint;
  let secret: string;

  beforeAll(async () => {
    server = createServer((req, res) => {
      const chunks: Buffer[] = [];
      req.on('data', (c: Buffer) => chunks.push(c));
      req.on('end', () => {
        deliveries.push({ headers: req.headers, body: Buffer.concat(chunks) });
        res.writeHead(200).end('ok');
      });
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (typeof address !== 'object' || address === null) throw new Error('no address');
    url = `http://127.0.0.1:${address.port}/hooks/pletopay`;
  });

  afterAll(async () => {
    if (endpoint) await pletopay.webhookEndpoints.delete(endpoint.id).catch(() => undefined);
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('registers an endpoint and returns the secret once', async () => {
    endpoint = await pletopay.webhookEndpoints.create({
      url,
      enabled_events: ['webhook.test', 'payment.succeeded'],
      description: 'SDK live test',
    });
    expect(endpoint.status).toBe('enabled');
    expect(endpoint.secret).toMatch(/^whsec_/);
    secret = endpoint.secret!;
    const fetched = await pletopay.webhookEndpoints.retrieve(endpoint.id);
    expect(fetched.secret ?? null).toBeNull();
  });

  it('delivers a signed test event that constructEvent verifies', async () => {
    const delivery = await pletopay.webhookEndpoints.test(endpoint.id);
    expect(delivery.endpoint).toBe(endpoint.id);
    await poll(
      async () => deliveries.length,
      (n) => n > 0,
    );
    const received = deliveries[0]!;
    expect(received.headers['x-pletopay-event-type']).toBe('webhook.test');
    expect(received.headers['x-pletopay-event-id']).toMatch(/^evt_/);
    const event: Event = constructEvent(received.body, received.headers['x-pletopay-signature'], secret);
    expect(event.type).toBe('webhook.test');
    expect(event.id).toBe(received.headers['x-pletopay-event-id']);
    expect(event.livemode).toBe(false);
    expect(constructEvent(received.body, received.headers['x-pletopay-signature'], secret).object).toBe('event');
    expect(() => constructEvent(received.body, received.headers['x-pletopay-signature'], 'whsec_wrong')).toThrow(
      /No signature found/,
    );
  });

  it('lists deliveries and events, replays, rotates the secret and updates', async () => {
    const list = await poll(
      () => pletopay.webhookEndpoints.listDeliveries(endpoint.id, { limit: 10 }),
      (page) => page.data.some((d) => d.status === 'succeeded'),
    );
    expect(list.data[0]!.endpoint).toBe(endpoint.id);
    const events = await pletopay.events.list({ type: 'webhook.test', limit: 5 });
    expect(events.data.length).toBeGreaterThan(0);
    const eventId = events.data[0]!.id;
    expect((await pletopay.events.retrieve(eventId)).id).toBe(eventId);
    expect((await pletopay.events.listDeliveries(eventId)).data.length).toBeGreaterThan(0);

    const rotated = await pletopay.webhookEndpoints.rotateSecret(endpoint.id);
    expect(rotated.secret).toMatch(/^whsec_/);
    expect(rotated.secret).not.toBe(secret);
    const updated = await pletopay.webhookEndpoints.update(endpoint.id, { description: 'rotated', status: 'disabled' });
    expect(updated.status).toBe('disabled');
    expect(updated.description).toBe('rotated');
    const enabledAgain = await pletopay.webhookEndpoints.update(endpoint.id, { status: 'enabled' });
    expect(enabledAgain.status).toBe('enabled');
    expect((await pletopay.webhookEndpoints.list()).data.map((e) => e.id)).toContain(endpoint.id);
  });

  it('deletes the endpoint', async () => {
    const deleted = await pletopay.webhookEndpoints.delete(endpoint.id);
    expect(deleted).toMatchObject({ id: endpoint.id, deleted: true });
    endpoint = undefined as never;
  });
});
