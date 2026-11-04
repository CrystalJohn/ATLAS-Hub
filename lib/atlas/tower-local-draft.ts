import {adaptC0Fixture} from '../../content/tower/c0-fixture-adapter.ts';
import bank from '../../docs/game-01/c0/C0-question-bank-candidates.json';
import {createIsolatedTowerRuntime} from './tower-handlers.ts';
import type {ExpeditionRow,ExpeditionStore} from './storage.ts';

// Local developer review only. No player expedition or reward is written to Supabase.
const globalDraft = globalThis as typeof globalThis & {__atlasTowerDraftRows?: Map<string, ExpeditionRow>};
const rows = globalDraft.__atlasTowerDraftRows ??= new Map<string, ExpeditionRow>();
const fixture = adaptC0Fixture(bank);
export const localDraftTowerRuntime = createIsolatedTowerRuntime(fixture.definition, fixture.answerKeys);
export const localDraftTowerStore: ExpeditionStore = {
  provider: 'local-draft',
  async initialize(playerId, document) { if (!rows.has(playerId)) rows.set(playerId, {revision: 0, document}); },
  async read(playerId) { const row = rows.get(playerId); return row ? {...row} : null; },
  async compareAndSwap(playerId, revision, document) {
    const current = rows.get(playerId);
    if (!current || current.revision !== revision) return false;
    rows.set(playerId, {revision: revision + 1, document});
    return true;
  },
};
