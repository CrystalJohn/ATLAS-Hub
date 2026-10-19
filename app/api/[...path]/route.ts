import {env} from 'cloudflare:workers';
import {handleAtlas} from '../../../lib/atlas/service';
export const dynamic='force-dynamic';
async function handle(request:Request){
 if(!env.DB)return Response.json({message:'Expedition storage is unavailable.'},{status:503});
 const response=await handleAtlas(request,env.DB);
 response.headers.set('Cache-Control','no-store');response.headers.set('X-Content-Type-Options','nosniff');
 return response;
}
export {handle as GET,handle as POST};
