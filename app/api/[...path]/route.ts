import {handleAtlas} from '../../../lib/atlas/service';
export const dynamic='force-dynamic';
async function handle(request:Request){
 if(process.env.VERCEL==='1'){
  const {handleVercelAtlas}=await import('../../../lib/atlas/vercel-handler');
  const {supabaseRouteClient}=await import('../../../lib/supabase/server');
  const {supabaseAdmin}=await import('../../../lib/supabase/admin');
  return handleVercelAtlas(request,{
   getAdmin:supabaseAdmin,
   getUser:async()=>{const auth=await supabaseRouteClient();const {data,error}=await auth.auth.getUser();if(error&&!['AuthSessionMissingError','AuthApiError'].includes(error.name))throw error;return data.user;},
  });
 }
 const {env}=await import('cloudflare:workers');
 if(!env.DB)return Response.json({message:'Expedition storage is unavailable.'},{status:503});
 const response=await handleAtlas(request,env.DB);
 response.headers.set('Cache-Control','no-store');response.headers.set('X-Content-Type-Options','nosniff');
 return response;
}
export {handle as GET,handle as POST};
