import type { Pletopay } from '../client';

export abstract class Resource {
  constructor(protected readonly client: Pletopay) {}
}
