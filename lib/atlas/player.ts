import type {SupabaseClient} from '@supabase/supabase-js';
import {StorageUnavailable} from './storage.ts';

/** Verified Auth UUID is the player PK. Never replace an existing profile on login. */
export async function ensurePlayer(client:SupabaseClient,playerId:string){
 const {error}=await client.from('atlas_profiles').upsert({player_id:playerId},{onConflict:'player_id',ignoreDuplicates:true});
 if(error)throw new StorageUnavailable(error.code);
}
