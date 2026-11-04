// Test infrastructure only. Real native PostgreSQL + real PostgREST; synthetic
// Auth users and an HMAC-verifying Auth fixture. This does NOT test Google OAuth.
import EmbeddedPostgres from 'embedded-postgres';
import {createClient} from '@supabase/supabase-js';
import {createServer} from 'node:http';
import {createServer as createNetServer} from 'node:net';
import {once} from 'node:events';
import {spawn,type ChildProcess} from 'node:child_process';
import {createHmac,randomBytes,randomUUID,timingSafeEqual} from 'node:crypto';
import {access,mkdir,mkdtemp,readFile,readdir,writeFile,realpath,rm} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {dirname,resolve,sep,basename} from 'node:path';

export const ids={alice:'11111111-1111-4111-8111-111111111111',bob:'22222222-2222-4222-8222-222222222222',failure:'33333333-3333-4333-8333-333333333333',legacy:'44444444-4444-4444-8444-444444444444'};
export async function freePort(){const s=createNetServer();s.listen(0,'127.0.0.1');await once(s,'listening');const a=s.address();if(!a||typeof a==='string')throw new Error('No local port');await new Promise<void>(r=>s.close(()=>r()));return a.port;}
export async function untilReady(url:string,child?:ChildProcess){
 for(let i=0;i<100;i++){
  if(child?.exitCode!==null&&child?.exitCode!==undefined)throw new Error(`Local process exited: ${child.exitCode}`);
  try{const r=await fetch(url);if(r.status<500)return;}catch{}
  await new Promise(r=>setTimeout(r,100));
 }
 throw new Error(`Local service not ready at ${new URL(url).pathname}`);
}
export async function createLocalStack(){
 await mkdir('.sites-runtime',{recursive:true});
 const directory=resolve(await mkdtemp('.sites-runtime/auth02-pg-'));
 const pgPort=await freePort(),restPort=await freePort();
 const password=randomBytes(24).toString('hex'),jwtSecret=randomBytes(40).toString('hex');
 const pgLogs:string[]=[];
 const pg=new EmbeddedPostgres({databaseDir:resolve(directory,'db'),port:pgPort,user:'postgres',password,authMethod:'scram-sha-256',persistent:true,createPostgresUser:false,postgresFlags:['-h','127.0.0.1'],initdbFlags:['--encoding=UTF8','--locale=C'],onLog:m=>pgLogs.push(String(m)),onError:m=>pgLogs.push(String(m))});
 let rest:ChildProcess|undefined;
 let gateway:ReturnType<typeof createServer>|undefined;
 const sql=pg.getPgClient('postgres','127.0.0.1');
 const sign=(claims:Record<string,unknown>)=>{const header=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url'),body=Buffer.from(JSON.stringify({exp:Math.floor(Date.now()/1000)+3600,...claims})).toString('base64url');const input=`${header}.${body}`;return `${input}.${createHmac('sha256',jwtSecret).update(input).digest('base64url')}`;};
 const publicKey=sign({role:'anon'}),serviceKey=sign({role:'service_role'});
 const revoked=new Set<string>();
 const user=(id:string)=>({id,aud:'authenticated',role:'authenticated',app_metadata:{provider:'google',providers:['google']},user_metadata:{},created_at:'2026-10-21T00:00:00Z'});
 const token=(id:string,expiresIn=3600)=>sign({sub:id,role:'authenticated',aud:'authenticated',jti:randomUUID(),exp:Math.floor(Date.now()/1000)+expiresIn});
 const verify=(jwt:string)=>{
  const [h,b,s]=jwt.split('.');if(!h||!b||!s)throw new Error('Invalid token');
  const expected=createHmac('sha256',jwtSecret).update(`${h}.${b}`).digest(),supplied=Buffer.from(s,'base64url');
  if(supplied.length!==expected.length||!timingSafeEqual(expected,supplied))throw new Error('Invalid signature');
  const payload=JSON.parse(Buffer.from(b,'base64url').toString()) as {sub:string;exp:number;jti:string};
  if(payload.exp<=Date.now()/1000||!Object.values(ids).includes(payload.sub)||revoked.has(payload.jti))throw new Error('Invalid session');
  return payload;
 };
 async function close(){
  if(gateway){gateway.closeAllConnections();await new Promise<void>(r=>gateway!.close(()=>r()));}
  if(rest&&rest.exitCode===null){rest.kill();await once(rest,'exit');}
  try{await sql.end();}catch{}
  try{
   await pg.stop();
   const target=await realpath(directory),parent=await realpath(resolve('.sites-runtime'));
   if(!target.startsWith(parent+sep)||!basename(target).startsWith('auth02-pg-'))throw new Error('Unsafe test cleanup path');
   await rm(target,{recursive:true,force:true});
  }catch{/* Preserve the owned test directory if shutdown or safety verification failed. */}
 }
 try{
  await pg.initialise();await pg.start();await sql.connect();
  await sql.query(`create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
    create role authenticator login noinherit password '${password}'; grant anon,authenticated,service_role to authenticator;
    grant usage on schema public to anon,authenticated,service_role;
    create schema auth;create table auth.users(id uuid primary key);`);
  for(const id of Object.values(ids))await sql.query('insert into auth.users(id) values ($1)',[id]);
  const migrationFiles=(await readdir('supabase/migrations')).filter(f=>f.endsWith('.sql')).sort();
  let legacyBefore:unknown;
  for(const file of migrationFiles){
   if(file==='20261021090000_auth02_expedition_integrity.sql'){
    const legacy={progress:{xp:30,completed:['silent-forest'],evidence:['observation']},attempts:[],ledger:[{id:randomUUID(),missionId:'silent-forest',contentVersion:1,amount:30,createdAt:'2026-10-20T00:00:00Z'}],submissions:[],travel:{version:1,visitedCountries:['JP'],encounters:{'jp-arrival':{step:1,routeIndex:0,seen:['signs']}},stamps:[]}};
    await sql.query('insert into public.atlas_profiles(player_id,display_name,interests) values ($1,$2,$3)',[ids.legacy,'Legacy explorer',['food']]);
    await sql.query('insert into public.atlas_expeditions(player_id,revision,document) values ($1,5,$2)',[ids.legacy,JSON.stringify(legacy)]);
    const before=(await sql.query('select revision,document from public.atlas_expeditions where player_id=$1',[ids.legacy])).rows[0];legacyBefore={...before,revision:Number(before.revision)};
   }
   await sql.query(await readFile(`supabase/migrations/${file}`,'utf8'));
  }
  const restPath=resolve(process.env.ATLAS_POSTGREST_BIN??(process.platform==='win32'?'.sites-runtime/auth02-tools/postgrest/artifacts/postgrest-windows-x64/postgrest.exe':'.sites-runtime/auth02-tools/postgrest'));
  await access(restPath);
  let binaryPath=process.env.PATH??'';
  if(process.platform==='win32'){
   const require=createRequire(import.meta.resolve('embedded-postgres'));
   const native=resolve(dirname(require.resolve('@embedded-postgres/windows-x64')),'../native');
   binaryPath=`${resolve(native,'bin')};${resolve(native,'lib')};${binaryPath}`;
  }
  const restLogs:string[]=[];
  rest=spawn(restPath,[],{env:{...process.env,PATH:binaryPath,PGRST_DB_URI:`postgres://authenticator:${password}@127.0.0.1:${pgPort}/postgres`,PGRST_DB_SCHEMAS:'public',PGRST_DB_ANON_ROLE:'anon',PGRST_JWT_SECRET:jwtSecret,PGRST_SERVER_HOST:'127.0.0.1',PGRST_SERVER_PORT:String(restPort),PGRST_DB_POOL:'24'},stdio:['ignore','pipe','pipe'],windowsHide:true});
  rest.stdout?.on('data',m=>restLogs.push(String(m)));rest.stderr?.on('data',m=>restLogs.push(String(m)));
  await untilReady(`http://127.0.0.1:${restPort}/`,rest);
  let appOrigin='http://127.0.0.1:3212';
  gateway=createServer(async(req,res)=>{
   const url=new URL(req.url!,`http://${req.headers.host}`);
   const json=(body:unknown,status=200)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(body));};
   try{
    if(url.pathname.startsWith('/rest/v1/')){
     const chunks:Buffer[]=[];for await(const chunk of req)chunks.push(Buffer.from(chunk));
     const headers=new Headers();for(const [k,v]of Object.entries(req.headers))if(v&&!['host','connection','content-length'].includes(k))headers.set(k,Array.isArray(v)?v.join(','):v);
     const upstream=await fetch(`http://127.0.0.1:${restPort}/${url.pathname.slice('/rest/v1/'.length)}${url.search}`,{method:req.method,headers,...(chunks.length?{body:Buffer.concat(chunks)}:{})});
     res.writeHead(upstream.status,Object.fromEntries(upstream.headers));res.end(Buffer.from(await upstream.arrayBuffer()));return;
    }
    if(url.pathname==='/auth/v1/user'){
     try{return json(user(verify(req.headers.authorization?.replace(/^Bearer /,'')??'').sub));}catch{return json({message:'Invalid local test session',error_code:'bad_jwt'},401);}
    }
    if(url.pathname==='/auth/v1/logout'){
     try{revoked.add(verify(req.headers.authorization?.replace(/^Bearer /,'')??'').jti);}catch{}
     res.writeHead(204);return res.end();
    }
    if(url.pathname==='/auth/v1/settings')return json({external:{google:false}});
    if(url.pathname==='/auth/v1/token')return json({message:'Expired local test session',error_code:'refresh_token_not_found'},400);
    if(url.pathname.startsWith('/login/')){
     const name=url.pathname.slice('/login/'.length) as keyof typeof ids;
     if(!ids[name])return json({message:'Unknown test user'},404);
     const session={access_token:token(ids[name]),refresh_token:randomUUID(),token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,user:user(ids[name])};
     res.writeHead(303,{'Set-Cookie':`sb-127-auth-token=base64-${Buffer.from(JSON.stringify(session)).toString('base64url')}; Path=/; HttpOnly; SameSite=Lax`,Location:appOrigin});return res.end();
    }
    if(url.pathname==='/control/oracle'){
     const rows=(await sql.query('select player_id,revision,document from public.atlas_expeditions order by player_id')).rows;
     const snapshot=Object.fromEntries(rows.map(row=>{
      const d=JSON.parse(row.document);return [Object.entries(ids).find(([,id])=>id===row.player_id)?.[0]??'unknown',{revision:Number(row.revision),xp:d.progress.xp,completed:d.progress.completed,ledger:d.ledger.map((entry:{missionId:string;amount:number})=>({missionId:entry.missionId,amount:entry.amount})),checkpoint:d.checkpoint,travel:d.travel}];
     }));
     await mkdir('output/auth02',{recursive:true});await writeFile('output/auth02/browser-oracle.json',JSON.stringify(snapshot,null,2));return json(snapshot);
    }
    return json({message:'Local fixture route not found'},404);
   }catch{return json({message:'Local fixture failure'},500);}
  });
  gateway.listen(0,'127.0.0.1');await once(gateway,'listening');const address=gateway.address();if(!address||typeof address==='string')throw new Error('No local gateway port');
  const url=`http://127.0.0.1:${address.port}`;
  const admin=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const auth=createClient(url,publicKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const info={postgres:(await sql.query('select version()')).rows[0].version,postgrest:'12.2.3',migrations:migrationFiles};
  await writeFile(resolve(directory,'run-info.json'),JSON.stringify(info,null,2));
  return {sql,pg,url,admin,auth,publicKey,serviceKey,token,user,sign,info,directory,legacyBefore,close,setAppOrigin:(origin:string)=>{appOrigin=origin;}};
 }catch(error){await close();throw error;}
}
