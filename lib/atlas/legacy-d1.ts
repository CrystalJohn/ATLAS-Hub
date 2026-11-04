// Historical D1 test/rollback tooling only. Never imported by active app routes.
import {handleAtlasForPlayer} from './service.ts';
import type {ExpeditionStore,ExpeditionRow} from './storage.ts';
export async function handleAtlas(request:Request,database:D1Database){
 const headers=new Headers(request.headers);
 // Archived tests model a trusted Sites ingress. Active Supabase API never uses it.
 if(request.method==='POST'&&!headers.has('origin'))headers.set('origin',new URL(request.url).origin);
 return handleAtlasForPlayer(new Request(request,{headers}),d1ExpeditionStore(database),request.headers.get('oai-authenticated-user-id'));
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
