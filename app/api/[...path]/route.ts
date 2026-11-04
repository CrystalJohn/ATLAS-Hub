export const dynamic='force-dynamic';
async function handle(request:Request){
  const {handleVercelAtlas}=await import('../../../lib/atlas/vercel-handler');
  const {supabaseRouteClient}=await import('../../../lib/supabase/server');
  const {supabaseAdmin}=await import('../../../lib/supabase/admin');
  // The npm dev launcher binds loopback and enables a volatile DRAFT-only Tower.
  const hostname=new URL(request.url).hostname;
  const isTower=new URL(request.url).pathname.startsWith('/api/tower');
  const localDraft=process.env.NODE_ENV==='development' && process.env.ATLAS_LOCAL_TOWER_REVIEW==='1' && (hostname==='localhost'||hostname==='127.0.0.1'||hostname==='[::1]') && isTower
    ? await import('../../../lib/atlas/tower-local-draft') : undefined;
  return handleVercelAtlas(request,{
   ...(localDraft?{towerTestRuntime:localDraft.localDraftTowerRuntime,towerLocalStore:localDraft.localDraftTowerStore}:{}),
   getAdmin:supabaseAdmin,
   getUser:async()=>{const auth=await supabaseRouteClient();const {data,error}=await auth.auth.getUser();if(error&&!['AuthSessionMissingError','AuthApiError'].includes(error.name))throw error;return data.user;},
  });
}
export {handle as GET,handle as POST};
