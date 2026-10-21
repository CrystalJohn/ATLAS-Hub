// Dedicated loopback-only real-database browser fixture, never a real Google login.
import {spawn} from 'node:child_process';
import {createLocalStack,untilReady} from './auth02/local-stack.mts';
const stack=await createLocalStack(),origin='http://127.0.0.1:3212';
stack.setAppOrigin(origin);
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port','3212'],{
 env:{...process.env,ATLAS_PROFILE_PREVIEW:'1',NEXT_PUBLIC_SUPABASE_URL:stack.url,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:stack.publicKey,SUPABASE_SECRET_KEY:stack.serviceKey},stdio:'inherit',windowsHide:true,
});
let closing=false;
async function close(){if(closing)return;closing=true;if(child.exitCode===null)child.kill();await stack.close();}
for(const signal of ['SIGINT','SIGTERM'] as const)process.on(signal,()=>{void close();});
child.on('exit',()=>{void close();});
await untilReady(origin,child);
console.log(`AUTH02 LOCAL PG FIXTURE — NOT GOOGLE OAUTH: ${stack.url}/login/alice (or /login/bob)`);
console.log(`Read-only authoritative test oracle: ${stack.url}/control/oracle`);
