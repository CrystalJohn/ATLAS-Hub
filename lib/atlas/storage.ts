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

export function d1ExpeditionStore(database: D1Database): ExpeditionStore {
  const db = database.withSession('first-primary');
  return {
    provider: 'sites-d1',
    async initialize(playerId, document) {
      await db.prepare('INSERT OR IGNORE INTO expeditions(player_id,revision,document) VALUES (?,0,?)').bind(playerId, document).run();
    },
    async read(playerId) {
      return db.prepare('SELECT revision,document FROM expeditions WHERE player_id=?').bind(playerId).first<ExpeditionRow>();
    },
    async compareAndSwap(playerId, revision, document) {
      const result = await db.prepare('UPDATE expeditions SET document=?,revision=revision+1 WHERE player_id=? AND revision=?').bind(document, playerId, revision).run();
      return result.meta.changes === 1;
    },
  };
}
