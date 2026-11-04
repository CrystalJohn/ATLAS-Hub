import fs from 'node:fs';
import {createLocalStack,freePort} from './auth02/local-stack.mts';
import {handleVercelAtlas} from '../lib/atlas/vercel-handler.ts';
import {adaptC0Fixture} from '../content/tower/c0-fixture-adapter.ts';
import {createIsolatedTowerRuntime} from '../lib/atlas/tower-handlers.ts';
import {createServer,request as proxyRequest} from 'node:http';import {once} from 'node:events';import {readFile,mkdir} from 'node:fs/promises';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';
const bank=JSON.parse(await readFile('docs/game-01/c0/C0-question-bank-candidates.json','utf8'));const fixture=adaptC0Fixture(bank);const runtime=createIsolatedTowerRuntime(fixture.definition,fixture.answerKeys);const stack=await createLocalStack(),port=await freePort(),base=`http://127.0.0.1:${port}`;stack.setAppOrigin(base);
const proxy=createServer(async(req,res)=>{try{const url=new URL(req.url??'/',base);if(url.pathname.startsWith('/api/')){const chunks=[];for await(const c of req)chunks.push(c);const headers=new Headers();for(const [k,v] of Object.entries(req.headers))if(v)headers.set(k,Array.isArray(v)?v.join(','):v);const request=new Request(url,{method:req.method,headers,...(chunks.length?{body:Buffer.concat(chunks)}:{})});const cookie=(req.headers.cookie??'').split(';').map(s=>s.trim()).find(s=>s.startsWith('sb-127-auth-token='));let token='';try{const enc=decodeURIComponent(cookie?.slice('sb-127-auth-token='.length)??'');if(enc.startsWith('base64-'))token=JSON.parse(Buffer.from(enc.slice(7),'base64url').toString()).access_token??'';}catch{}const response=await handleVercelAtlas(request,{getAdmin:()=>stack.admin,getUser:async()=>{const {data,error}=await stack.auth.auth.getUser(token);return error?null:data.user;},towerTestRuntime:runtime});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;}const upstream=proxyRequest({hostname:'127.0.0.1',port:3000,path:req.url,method:req.method,headers:req.headers},r=>{res.writeHead(r.statusCode??502,r.headers);r.pipe(res)});upstream.on('error',()=>{res.writeHead(502);res.end()});req.pipe(upstream);}catch{if(!res.headersSent)res.writeHead(500);res.end()}});
proxy.on('upgrade',(req,socket,head)=>{socket.on('error',()=>socket.destroy());const upstream=proxyRequest({hostname:'127.0.0.1',port:3000,path:req.url,method:req.method,headers:req.headers});upstream.on('upgrade',(r,s,h)=>{s.on('error',()=>s.destroy());socket.write(`HTTP/1.1 ${r.statusCode} ${r.statusMessage}\r\n`);for(let i=0;i<r.rawHeaders.length;i+=2)socket.write(`${r.rawHeaders[i]}: ${r.rawHeaders[i+1]}\r\n`);socket.write('\r\n');if(head.length)s.write(head);if(h.length)socket.write(h);s.pipe(socket).pipe(s)});upstream.on('error',()=>socket.destroy());upstream.end()});proxy.listen(port,'127.0.0.1');await once(proxy,'listening');
const pw=await import(pathToFileURL('C:/Users/tranp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js').href);const {chromium}=pw.default??pw;const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const p=await ctx.newPage();

await mkdir('output/study-calendar',{recursive:true});
const checks:string[]=[];
try{
 await p.goto(stack.url+'/login/alice');await p.waitForURL(base+'/');
 await p.request.post(base+'/api/session',{data:{},headers:{origin:base}});
 await p.request.post(base+'/api/profile',{data:{displayName:'Calendar Tester'},headers:{origin:base}});
 const saved=(await stack.sql.query('select revision,document from public.atlas_expeditions where player_id=$1', ['11111111-1111-4111-8111-111111111111'])).rows[0];
 const d=JSON.parse(saved.document);
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const yesterday=new Date(Date.parse(today+'T00:00:00Z')-86400000).toISOString().slice(0,10);
 d.studyHistory={version:1,timeZone:'Asia/Ho_Chi_Minh',days:[...new Set(['2026-10-02','2026-10-03',yesterday,today])].sort()};
 await stack.sql.query('update public.atlas_expeditions set document=$1,revision=revision+1 where player_id=$2',[JSON.stringify(d),'11111111-1111-4111-8111-111111111111']);
 await p.goto(base);
 const trigger=p.getByTestId('study-streak');await trigger.waitFor();await p.waitForFunction(()=>document.querySelector('[data-testid="study-streak"]')?.textContent?.includes('2'));
 await trigger.click();const dialog=p.getByTestId('study-calendar');await dialog.waitFor({state:'visible'});
 assert.match(await dialog.innerText(),/longest streak/);checks.push('Header shows authoritative 2-day streak; modal displays current/best/total');
 await p.getByLabel('Choose month and year').fill('2026-10');await p.locator('[data-study-date="2026-10-03"]').click();
 assert.equal(await p.locator('[data-study-date="2026-10-03"]').getAttribute('data-studied'),'true');
 assert.match(await p.locator('.study-date-detail').innerText(),/3 October 2026/);
 await p.screenshot({path:'output/study-calendar/calendar-desktop.png'});
 checks.push('Past October 3 study day and detail visible via month picker');
 await p.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});assert.equal(await trigger.evaluate((el:HTMLElement)=>el===document.activeElement),true);checks.push('Escape closes native dialog and restores trigger focus');
 await p.getByRole('button',{name:'Switch interface to Vietnamese',exact:true}).click();await trigger.click();
 await p.getByLabel('Chọn tháng và năm').fill('2026-10');await p.locator('[data-study-date="2026-10-03"]').click();
 assert.match(await p.locator('.study-date-detail').innerText(),/Đã ghi nhận hoạt động học/);
 checks.push('Vietnamese interface preserves date and activity meaning');
 for(const width of [320,390,768,1440]){
  await p.setViewportSize({width,height:900});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'page overflow '+width);
  const box=await dialog.boundingBox();assert.ok(box&&box.x>=0&&box.x+box.width<=width,'dialog fits '+width);assert.ok(box&&Math.abs(box.x-(width-box.width)/2)<2,'dialog centered '+width);
  const size=await p.locator('[data-study-date="2026-10-03"]').boundingBox();assert.ok(size&&size.height>=44,'day height '+width);
  if(width===390)await p.screenshot({path:'output/study-calendar/calendar-mobile.png'});
 }
 checks.push('320/390/768/1440 layouts fit viewport; day targets at least 44px high');
 await p.keyboard.press('Escape');
 await p.goto(stack.url+'/login/bob');await p.waitForURL(base+'/');await p.request.post(base+'/api/session',{data:{},headers:{origin:base}});await p.request.post(base+'/api/profile',{data:{displayName:'Second Explorer'},headers:{origin:base}});
 await p.goto(base);await p.getByTestId('study-streak').waitFor();await p.waitForFunction(()=>document.querySelector('[data-testid="study-streak"]')?.textContent?.includes('0'));
 await p.getByTestId('study-streak').click();
 assert.equal(await p.locator('[data-studied="true"]').count(),0);checks.push('Account switch shows no prior player dates');
 await p.keyboard.press('Escape');await p.setViewportSize({width:1440,height:1000});await p.goto(base+'/#/travel/encounter/jp-arrival');
 await p.locator('.travel-encounter').waitFor();await p.locator('.travel-hotspot').filter({hasText:'Read the signs'}).click();
 await p.waitForFunction(()=>document.querySelector('[data-testid="study-streak"]')?.textContent?.includes('1'));
 checks.push('Actual lesson interaction immediately refreshes badge from 0 to 1 without reload');
 const ownHistory=await(await p.request.get(base+'/api/study')).json();
 await p.route('**/api/study',async(route:{fulfill:(options:{status:number;contentType:string;body:string})=>Promise<void>})=>{await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({...ownHistory,playerId:'11111111-1111-4111-8111-111111111111'})});});
 await p.getByTestId('study-streak').click();await p.locator('.study-calendar-error').waitFor();
 assert.equal(await p.locator('.study-calendar-stats').count(),0);
 checks.push('Mismatched account response is rejected instead of exposing another calendar');
 fs.writeFileSync('output/study-calendar/browser-results.json',JSON.stringify({pass:true,checks,fixtureOnly:true},null,2));
 console.log(checks.map(check=>'PASS '+check).join('\n'));
}finally{
 await browser.close();proxy.closeAllConnections();await new Promise<void>(resolve=>proxy.close(()=>resolve()));await stack.close();
}
