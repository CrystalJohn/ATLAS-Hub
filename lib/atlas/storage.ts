/** Storage commits the complete expedition atomically, including the reward ledger. */
export type ExpeditionRow = { revision: number; document: string };
export class StorageUnavailable extends Error {
  readonly code: string;
  constructor(code: string) { super('Your adventure could not be saved right now. Please try again shortly.'); this.code = code; }
}
export interface ExpeditionStore {
  readonly provider: 'sites-d1' | 'supabase';
  initialize(playerId: string, document: string): Promise<void>;
  read(playerId: string): Promise<ExpeditionRow | null>;
  compareAndSwap(playerId: string, revision: number, document: string): Promise<boolean>;
}
