// Explicit, disposable, loopback-only DRAFT review fixture. Not imported by Next routes.
// The proxy delegates only Tower requests to the existing authenticated handler with
// server-owned test content; every other request uses the existing Next application.
import {createServer,request as proxyRequest} from 'node:http';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFile} from 'node:fs/promises';
import {adaptC0Fixture} from '../content/tower/c0-fixture-adapter.ts';
import {createIsolatedTowerRuntime} from '../lib/atlas/tower-handlers.ts';
import {handleVercelAtlas} from '../lib/atlas/vercel-handler.ts';
import {createLocalStack,freePort,untilReady} from './auth02/local-stack.mts';

const fixturePort=Number(process.env.ATLAS_TOWER_FIXTURE_PORT??3213);
if(!Number.isInteger(fixturePort)||fixturePort<1024||fixturePort>65535)throw new Error('Invalid local fixture port');
const bank=adaptC0Fixture(JSON.parse(await readFile('docs/game-01/c0/C0-question-bank-candidates.json','utf8')));
const stack=await createLocalStack(),nextPort=await freePort();
const origin=`http://127.0.0.1:${fixturePort}`;
stack.setAppOrigin(origin);
const runtime=createIsolatedTowerRuntime(bank.definition,bank.answerKeys);
const env:NodeJS.ProcessEnv={...process.env,NEXT_PUBLIC_SUPABASE_URL:stack.url,
 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:stack.publicKey,SUPABASE_SECRET_KEY:stack.serviceKey,
 ATLAS_AUTH_ALLOWED_ORIGINS:origin,ATLAS_PROFILE_PREVIEW:'1'};
// Explicit overrides above ensure no hosted player database can be contacted.
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port',String(nextPort)],
 {env,stdio:['ignore','pipe','pipe'],windowsHide:true});
child.stdout.on('data',chunk=>process.stdout.write(chunk));child.stderr.on('data',chunk=>process.stderr.write(chunk));
let dropNextTowerResponse=false;
const proxy=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url??'/',origin);
  // This control is exposed only by the loopback-only disposable fixture process.
  if(url.pathname==='/__tower_fixture/drop-next-response'&&req.method==='POST'){
   if(req.headers.origin!==origin){res.writeHead(403);res.end();return;}
   dropNextTowerResponse=true;res.writeHead(204);res.end();return;
  }
  if(url.pathname==='/__tower_fixture/shutdown'&&req.method==='POST'){
   if(req.headers.origin!==origin){res.writeHead(403);res.end();return;}
   res.writeHead(204);res.end();setTimeout(()=>{void close();},100);return;
  }
  if(url.pathname==='/__tower_fixture/info'&&req.method==='GET'){
   res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});
   res.end(JSON.stringify({review:'DRAFT',loginAlice:`${stack.url}/login/alice`,loginBob:`${stack.url}/login/bob`,oracle:`${stack.url}/control/oracle`}));return;
  }
  if(url.pathname==='/api/tower'||url.pathname.startsWith('/api/tower/')){
   const chunks:Buffer[]=[];for await(const chunk of req)chunks.push(Buffer.from(chunk));
   const headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(value)headers.set(key,Array.isArray(value)?value.join(','):value);
   const request=new Request(url,{method:req.method,headers,...(chunks.length?{body:Buffer.concat(chunks)}:{})});
   const cookie=(req.headers.cookie??'').split(';').map(s=>s.trim()).find(s=>s.startsWith('sb-127-auth-token='));
   let accessToken='';
   try{const encoded=decodeURIComponent(cookie?.slice('sb-127-auth-token='.length)??'');
    if(encoded.startsWith('base64-'))accessToken=JSON.parse(Buffer.from(encoded.slice(7),'base64url').toString()).access_token??'';
   }catch{/* Invalid cookie resolves to unauthenticated, never a synthetic identity. */}
   const response=await handleVercelAtlas(request,{getAdmin:()=>stack.admin,getUser:async()=>{
    const {data,error}=await stack.auth.auth.getUser(accessToken);return error?null:data.user;
   },towerTestRuntime:runtime});
   if(dropNextTowerResponse&&req.method==='POST'&&url.pathname==='/api/tower/submit'){
    // Deliver an incomplete response after commit; this prevents a browser's
    // transparent connection retry from hiding the uncertain-result path.
    dropNextTowerResponse=false;res.writeHead(200,{'Content-Type':'application/json','Content-Length':'100'});res.write('{');
    setTimeout(()=>res.destroy(),50);return;
   }
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;
  }
  const upstream=proxyRequest({hostname:'127.0.0.1',port:nextPort,path:req.url,method:req.method,headers:req.headers},response=>{
   res.writeHead(response.statusCode??502,response.headers);response.pipe(res);
  });
  upstream.on('error',()=>{if(!res.headersSent)res.writeHead(502);res.end('Local review application unavailable.');});
  req.pipe(upstream);
 }catch{if(!res.headersSent)res.writeHead(500);res.end('Local review fixture error.');}
});
// Next's development client waits for its HMR WebSocket before hydrating.
// Forward that one loopback-only upgrade to the same isolated Next process.
proxy.on('upgrade',(req,socket,head)=>{
 socket.on('error',()=>socket.destroy());
 if(!req.url?.startsWith('/_next/hmr')&&!req.url?.startsWith('/_next/webpack-hmr')){socket.destroy();return;}
 const upstream=proxyRequest({hostname:'127.0.0.1',port:nextPort,path:req.url,method:req.method,headers:req.headers});
 upstream.on('upgrade',(response,nextSocket,nextHead)=>{
  nextSocket.on('error',()=>nextSocket.destroy());
  socket.write(`HTTP/1.1 ${response.statusCode} ${response.statusMessage}\r\n`);
  for(let i=0;i<response.rawHeaders.length;i+=2)socket.write(`${response.rawHeaders[i]}: ${response.rawHeaders[i+1]}\r\n`);
  socket.write('\r\n');if(head.length)nextSocket.write(head);if(nextHead.length)socket.write(nextHead);
  nextSocket.pipe(socket).pipe(nextSocket);
 });
 upstream.on('error',()=>socket.destroy());upstream.end();
});
let closing=false;
async function close(){if(closing)return;closing=true;proxy.closeAllConnections();if(proxy.listening)await new Promise<void>(r=>proxy.close(()=>r()));
 if(child.exitCode===null){const exited=once(child,'exit');child.kill();await exited;}await stack.close();}
for(const signal of ['SIGINT','SIGTERM'] as const)process.on(signal,()=>{void close();});
child.on('exit',()=>{void close();});
try{
 await untilReady(`http://127.0.0.1:${nextPort}`,child);
 proxy.listen(fixturePort,'127.0.0.1');await once(proxy,'listening');
 console.log(`DRAFT LOCAL REVIEW ONLY: ${origin}`);
 console.log(`Fixture sign-in: ${stack.url}/login/alice or ${stack.url}/login/bob`);
 console.log(`Fixture info: ${origin}/__tower_fixture/info`);
}catch(e){await close();throw e;}
