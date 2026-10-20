import type { SupabaseClient } from '@supabase/supabase-js';
import { StorageUnavailable, type ExpeditionStore, type ExpeditionRow } from './storage.ts';

export function supabaseExpeditionStore(client: SupabaseClient): ExpeditionStore {
  return {
    provider: 'supabase',
    async initialize(playerId, document) {
      // ON CONFLICT DO NOTHING. Login must never overwrite existing progress.
      const { error } = await client.from('atlas_expeditions').upsert(
        { player_id: playerId, revision: 0, document },
        { onConflict: 'player_id', ignoreDuplicates: true },
      );
      if (error) throw new StorageUnavailable(error.code);
    },
    async read(playerId) {
      const { data, error } = await client.from('atlas_expeditions').select('revision,document').eq('player_id', playerId).maybeSingle();
      if (error) throw new StorageUnavailable(error.code);
      if (!data) return null;
      if (!Number.isSafeInteger(data.revision) || typeof data.document !== 'string') throw new StorageUnavailable('INVALID_EXPEDITION');
      return data as ExpeditionRow;
    },
    async compareAndSwap(playerId, revision, document) {
      const { data, error } = await client.from('atlas_expeditions')
        .update({ document, revision: revision + 1 })
        .eq('player_id', playerId).eq('revision', revision).select('revision');
      if (error) throw new StorageUnavailable(error.code);
      return data.length === 1;
    },
  };
}
