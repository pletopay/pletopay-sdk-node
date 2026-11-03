import type { RequestOptions } from '../client';
import { OPERATIONS } from '../operations';
import type { SimulatedTransfer, SimulateTransferParams } from '../types';
import { Resource } from './base';

/** Test-mode helpers. The SDK refuses these locally with a live key. */
export class Sandbox extends Resource {
  /** Simulates an incoming bank transfer to a virtual account, so the payment succeeds without real money. */
  simulateTransfer(params: SimulateTransferParams, options?: RequestOptions): Promise<SimulatedTransfer> {
    return this.client.call(OPERATIONS.simulateTransfer, { body: params, options });
  }
}
