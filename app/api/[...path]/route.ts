import {handleAtlas} from '../../../lib/atlas/service';
export const dynamic='force-dynamic';
async function handle(request:Request){
 // This route is backed by Sites D1. Do not accept client-supplied identity
 // headers or create fresh progress on a different host until the managed
 // Google session and Supabase storage are connected.
 if(process.env.VERCEL==='1')return Response.json({message:'Expedition storage is not configured for this preview.'},{status:503,headers:{'Cache-Control':'no-store'}});
 const {env}=await import('cloudflare:workers');
 if(!env.DB)return Response.json({message:'Expedition storage is unavailable.'},{status:503});
 const response=await handleAtlas(request,env.DB);
 response.headers.set('Cache-Control','no-store');response.headers.set('X-Content-Type-Options','nosniff');
 return response;
}
export {handle as GET,handle as POST};
