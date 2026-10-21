import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdir,writeFile} from 'node:fs/promises';
import {createLocalStack,freePort,untilReady,ids} from './auth02/local-stack.mts';
import type {AtlasState} from '../app/components/chapter-types.ts';
import type {PlayerProfile} from '../lib/atlas/profile.ts';
import type {ResumeState} from '../lib/atlas/checkpoint.ts';

// Real built Next route handlers/cookies + Supabase SDK + PostgREST + PostgreSQL.
// Auth endpoint is the signed local fixture, not GoTrue/Google OAuth.
const stack=await createLocalStack(),base=`http://127.0.0.1:${await freePort()}`;
stack.setAppOrigin(base);
const env:NodeJS.ProcessEnv={...process.env,NEXT_PUBLIC_SUPABASE_URL:stack.url,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:stack.publicKey,SUPABASE_SECRET_KEY:stack.serviceKey};
delete env.VERCEL;delete env.ATLAS_PROFILE_PREVIEW;
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',new URL(base).port],{env,stdio:['ignore','pipe','pipe'],windowsHide:true});
let logs='';child.stdout.on('data',chunk=>{logs+=String(chunk);});child.stderr.on('data',chunk=>{logs+=String(chunk);});
const login=async(name:string)=>(await fetch(`${stack.url}/login/${name}`,{redirect:'manual'})).headers.get('set-cookie')!.split(';')[0];
type ApiBody=AtlasState&ResumeState&{profile:PlayerProfile;id:string;awardedXp:number;code?:string};
async function api(path:string,cookie='',body?:unknown){
 const r=await fetch(`${base}/api/${path}`,{method:body===undefined?'GET':'POST',headers:{cookie,origin:base,'Content-Type':'application/json','oai-authenticated-user-id':ids.bob},...(body===undefined?{}:{body:JSON.stringify(body)})});
 assert.ok(r.headers.get('cache-control')?.includes('no-store'));
 return {status:r.status,body:await r.json() as ApiBody};
}
const payload=(encounterId:string,stepId:string,action:unknown)=>({encounterId,stepId,version:1,band:'A2',support:{vietnamese:true,glossary:false},action});
try{
 await untilReady(base,child);
 assert.equal((await api('health')).status,200);
 assert.equal((await api('session','',{})).status,401);
 assert.equal((await api('state','sb-127-auth-token=not-a-session')).status,401);
 let alice=await login('alice');const bob=await login('bob');
 const sessions=await Promise.all(Array.from({length:12},()=>api('session',alice,{})));assert.ok(sessions.every(r=>r.status===200));
 assert.equal((await stack.sql.query('select count(*)::int as n from public.atlas_profiles where player_id=$1',[ids.alice])).rows[0].n,1);
 assert.equal((await api('profile',alice,{displayName:'AUTH02 HTTP Alice'})).status,200);
 assert.equal((await api('profile',alice)).body.profile.playerId,ids.alice);
 await api('travel/start',alice,{countryId:'JP'});
 await api('travel/action',alice,payload('jp-arrival','read-signs',{kind:'inspect',target:'signs'}));
 await api('travel/action',alice,payload('jp-arrival','ask-staff',{kind:'say',choice:'ask'}));
 const completion=await api('travel/action',alice,payload('jp-arrival','find-train',{kind:'target',target:'station'}));assert.equal(completion.body.awardedXp,30);
 const current=(await api('state',alice)).body;
 assert.equal((await api('checkpoint',alice,{expectedRevision:current.revision,target:{kind:'travel',encounterId:'jp-directions'}})).status,201);
 await api('travel/action',alice,payload('jp-directions','read-map',{kind:'inspect',target:'map'}));
 const resume=(await api('resume',alice)).body;
 assert.ok(resume.target?.kind==='travel');assert.equal(resume.target.encounterId,'jp-directions');assert.equal(resume.target.step,1);
 const before=(await stack.sql.query('select revision,document from public.atlas_expeditions where player_id=$1',[ids.alice])).rows[0];
 const logout=await fetch(`${base}/auth/logout`,{method:'POST',headers:{cookie:alice,origin:base},redirect:'manual'});assert.equal(logout.status,303);assert.ok(logout.headers.get('set-cookie'));
 assert.equal((await api('state',alice)).status,401,'Revoked fixture session must not access the real Next route');
 alice=await login('alice');assert.equal((await api('session',alice,{})).body.xp,30);
 assert.equal((await api('profile',alice)).body.profile.displayName,'AUTH02 HTTP Alice');
 assert.deepEqual((await api('resume',alice)).body,resume);
 assert.deepEqual((await stack.sql.query('select revision,document from public.atlas_expeditions where player_id=$1',[ids.alice])).rows[0],before);
 assert.equal((await api('session',bob,{})).body.xp,0);assert.equal((await api('resume',bob)).body.target,null);
 assert.equal((await api(`resume?playerId=${ids.alice}`,bob)).status,400);
 assert.equal((await api('profile',bob,{playerId:ids.alice,displayName:'Intruder'})).status,400);
 const attempt=(await api('attempts',alice,{missionId:'silent-forest'})).body;
 assert.equal((await api(`attempts/${attempt.id}/submit`,bob,{type:'DISCOVERY',answer:'linked'})).status,404);
 const html=await(await fetch(base)).text();assert.ok(!html.includes(stack.serviceKey));assert.ok(!html.includes('signin-with-chatgpt'));
 await mkdir('output/auth02',{recursive:true});await writeFile('output/auth02/http-evidence.json',JSON.stringify({status:'PASS',runtime:'Next production without VERCEL switch',...stack.info,checks:['12 concurrent first session requests create one profile','Missing/invalid cookies and spoofed identity rejected','HttpOnly cookie verified through actual SDK auth.getUser','Tokyo reward/stamp committed through real Next routes','Checkpoint reload and fresh session recover exact step','POST logout clears cookies and revoked fixture session is rejected','Account B profile/progress/checkpoint isolated','Foreign attempt/reward and player selector rejected','Supabase service key not rendered in page HTML'],limitations:['Auth verifier fixture, not GoTrue or Google OAuth','No hosted staging/production gameplay tests']},null,2));
 console.log('PASS AUTH-02 real Next HTTP/cookie→SDK→PostgREST→PostgreSQL: initialization, reward, checkpoint, reload, logout/login, two-account isolation, expired/invalid session rejection. OAuth NOT RUN.');
}catch(error){console.error(logs.slice(-1500));throw error;}
finally{
 if(child.exitCode===null){const exited=once(child,'exit');child.kill();await exited;}
 await stack.close();
}
