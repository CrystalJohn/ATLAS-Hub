export const dynamic='force-dynamic';
async function handle(request:Request){
  const {handleVercelAtlas}=await import('../../../lib/atlas/vercel-handler');
  const {supabaseRouteClient}=await import('../../../lib/supabase/server');
  const {supabaseAdmin}=await import('../../../lib/supabase/admin');
  return handleVercelAtlas(request,{
   getAdmin:supabaseAdmin,
   getUser:async()=>{const auth=await supabaseRouteClient();const {data,error}=await auth.auth.getUser();if(error&&!['AuthSessionMissingError','AuthApiError'].includes(error.name))throw error;return data.user;},
  });
}
export {handle as GET,handle as POST};
