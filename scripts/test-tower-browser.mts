// Local review browser QA. This starts only the disposable loopback fixture.
// Uses synthetic signed Auth, real local PostgreSQL and the actual Next UI.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {freePort} from './auth02/local-stack.mts';

const runtime=process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES??'C:/Users/tranp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const executablePath=process.env.ATLAS_BROWSER_EXECUTABLE??'C:/Program Files/Google/Chrome/Application/chrome.exe';
const playwright=await import(pathToFileURL(`${runtime}/playwright/index.js`).href);
const {chromium}=playwright.default??playwright;
const port=await freePort(),base=`http://127.0.0.1:${port}`;
const child=spawn(process.execPath,['scripts/preview-tower.mts'],{env:{...process.env,ATLAS_TOWER_FIXTURE_PORT:String(port)},stdio:['ignore','pipe','pipe'],windowsHide:true});
let logs='';child.stdout.on('data',c=>{logs+=String(c);});child.stderr.on('data',c=>{logs+=String(c);});
type Info={loginAlice:string;loginBob:string;oracle:string;review:string};
type Tower={tower:{run:{status:string;runId:string;revision:number;clearedFloors:number;question?:{id:string;parts:{id:string;options:{id:string;text:string}[]}[]}};bestClearedFloors:number;completed:boolean}};
const bank=JSON.parse(await readFile('docs/game-01/c0/C0-question-bank-candidates.json','utf8')) as {records:{id:string;parts:{id:string;answerId:string}[]}[]};
const checks:string[]=[];
const pass=(name:string)=>{checks.push(name);console.log(`PASS ${name}`);};
await mkdir('output/game-01/t3/screenshots',{recursive:true});
let browser:Awaited<ReturnType<typeof chromium.launch>>|undefined;
try{
 for(let attempt=0;;attempt++){
  if(child.exitCode!==null)throw new Error(`Review fixture exited: ${child.exitCode}`);
  try{if((await fetch(`${base}/__tower_fixture/info`)).ok)break;}catch{/* Next may still be compiling. */}
  if(attempt>=299)throw new Error('Local review fixture did not become ready within 60 seconds');
  await new Promise(resolve=>setTimeout(resolve,200));
 }
 const info=await(await fetch(`${base}/__tower_fixture/info`)).json() as Info;assert.equal(info.review,'DRAFT');
 browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox']});
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 async function login(page:any,name:'alice'|'bob'){
  await page.goto(name==='alice'?info.loginAlice:info.loginBob);await page.waitForURL(`${base}/`);
  const session=await page.request.post(`${base}/api/session`,{data:{},headers:{origin:base}});assert.equal(session.status(),200);
  const profile=await page.request.post(`${base}/api/profile`,{data:{displayName:`Tower ${name}`},headers:{origin:base}});assert.equal(profile.status(),200);
  await page.goto(base);try{await page.getByRole('button',{name:'World map',exact:true}).waitFor({timeout:15000});}
  catch(error){console.error('Page on navigation failure:',(await page.locator('body').innerText()).slice(0,3000));
   const button=page.getByRole('button',{name:'Switch interface to Vietnamese'});if(await button.count()){await button.click();console.error('Language click after timeout:',await page.locator('html').getAttribute('lang'));}
   console.error('Loaded script URLs:',await page.locator('script[src]').evaluateAll((nodes:Element[])=>nodes.map(n=>n.getAttribute('src'))));
   console.error('Resource timing:',await page.evaluate(()=>performance.getEntriesByType('resource').map((x)=>({name:new URL(x.name).pathname,duration:x.duration}))));await page.screenshot({path:'output/game-01/t3/screenshots/login-failure.png',fullPage:true});throw error;}
 }
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 async function hub(page:any){
  await page.getByRole('button',{name:'World map',exact:true}).click();
  const card=page.getByTestId('tower-card');
  if(!await card.isVisible().catch(()=>false)){
   await page.getByRole('button',{name:/Let.s go to Japan|Return to Tokyo/i}).click();
   await card.waitFor({state:'visible',timeout:15000});
  }
 }
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 async function state(page:any):Promise<Tower>{const r=await page.request.get(`${base}/api/tower/run`);assert.equal(r.status(),200);return await r.json() as Tower;}
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 async function pick(page:any,wrongPart?:string){
  const s=await state(page),q=s.tower.run.question;assert.ok(q);const key=bank.records.find(x=>x.id===q.id);assert.ok(key);
  for(const part of q.parts){const answer:{id:string;answerId:string}|undefined=key.parts.find(p=>p.id===part.id);assert.ok(answer);
   const choice:string=wrongPart===part.id?part.options.find(o=>o.id!==answer.answerId)!.id:answer.answerId;
   const radio:{check():Promise<void>;isChecked():Promise<boolean>}=page.getByTestId(`tower-choice-${part.id}-${choice}`);await radio.check();assert.equal(await radio.isChecked(),true);
  }
  return s;
 }
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 async function confirm(page:any){const button=page.getByTestId('tower-confirm');assert.equal(await button.isEnabled(),true);await button.click();await page.getByTestId('tower-outcome').waitFor({state:'visible'});}
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 async function continueRun(page:any){const b=page.getByTestId('tower-continue');await b.click();await page.getByTestId('tower-confirm').waitFor({state:'visible'});}
 const desktop=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await desktop.newPage();
 const errors:string[]=[];page.on('pageerror',(error:Error)=>{errors.push(error.message);console.error('Browser page error:',error.message);});
 page.on('console',(message:{type():string;text():string;location():{url?:string}})=>{if(message.type()==='error')console.error('Browser console error:',message.text().slice(0,300),message.location().url);});
 page.on('requestfailed',(r:{url():string;failure():unknown})=>console.error('Browser request failed:',new URL(r.url()).pathname,r.failure()));
 page.on('response',(response:{status():number;url():string;headers():Record<string,string>})=>{const path=new URL(response.url()).pathname;if(response.status()>=400||path.startsWith('/api/')||path.endsWith('.js'))console.error('Browser HTTP response:',response.status(),path,response.headers()['content-type']);});
 await login(page,'alice');await hub(page);assert.ok(await page.getByTestId('tower-card').isVisible());await page.getByTestId('tower-enter').click();
 assert.match(await page.locator('body').innerText(),/one wrong confirmed answer/i);assert.match(await page.locator('body').innerText(),/floor 1/i);
 assert.match(await page.locator('body').innerText(),/DRAFT/i);assert.equal(await page.getByTestId('tower-start').isEnabled(),false);
 await page.getByTestId('tower-acknowledge').check();await page.getByTestId('tower-start').click();
 await page.getByTestId('tower-confirm').waitFor();assert.equal(await page.getByTestId('tower-confirm').isEnabled(),false);
 const before=await state(page);await pick(page);const afterSelection=await state(page);assert.equal(afterSelection.tower.run.revision,before.tower.run.revision);
 await page.getByTestId('tower-confirm').evaluate((button:HTMLButtonElement)=>{button.click();button.click();});
 await page.getByTestId('tower-outcome').waitFor({state:'visible'});const after=await state(page);assert.equal(after.tower.run.clearedFloors,1);assert.equal(after.tower.run.revision,before.tower.run.revision+1);
 await page.screenshot({path:'output/game-01/t3/screenshots/desktop-correct.png',fullPage:true});pass('hub discovery, rules, select-before-confirm and correct response');
 await continueRun(page);await pick(page,'p1');await confirm(page);assert.equal((await state(page)).tower.run.status,'FAILED');
 assert.ok(await page.getByTestId('tower-review-lesson').isVisible());await page.screenshot({path:'output/game-01/t3/screenshots/desktop-failed.png',fullPage:true});
 const checkpointBefore=await(await page.request.get(`${base}/api/resume`)).json();
 await page.getByTestId('tower-review-lesson').click();assert.match(await page.locator('body').innerText(),/Tokyo|lesson|airport/i);
 assert.deepEqual(await(await page.request.get(`${base}/api/resume`)).json(),checkpointBefore);
 await page.getByRole('button',{name:/Back to tower/i}).click();await page.getByTestId('tower-restart').click();await page.getByTestId('tower-confirm').waitFor({state:'visible'});
 assert.equal((await state(page)).tower.run.clearedFloors,0);assert.equal((await state(page)).tower.run.status,'IN_PROGRESS');pass('wrong answer, truthful lesson return and fresh restart');
 await pick(page);const arm=await page.request.post(`${base}/__tower_fixture/drop-next-response`,{headers:{origin:base}});assert.equal(arm.status(),204);
 await page.getByTestId('tower-confirm').click();await page.getByTestId('tower-error').waitFor({state:'visible'});
 const committed=await state(page);assert.equal(committed.tower.run.clearedFloors,1);
 // Persist the original pending operation across a full reload and account switch.
 await page.reload();await hub(page);await page.getByTestId('tower-enter').click();await page.getByTestId('tower-error').waitFor({state:'visible'});
 await login(page,'bob');await hub(page);await page.getByTestId('tower-enter').click();
 assert.equal((await state(page)).tower.run.status,'NOT_STARTED');assert.equal(await page.getByTestId('tower-error').count(),0);
 await login(page,'alice');await hub(page);await page.getByTestId('tower-enter').click();await page.getByTestId('tower-error').waitFor({state:'visible'});
 await page.getByTestId('tower-recover').click();await page.getByTestId('tower-outcome').waitFor({state:'visible'});
 assert.equal((await state(page)).tower.run.revision,committed.tower.run.revision);pass('lost response survives reload and account switch; original outcome recovered once');
 await page.reload();await hub(page);await page.getByTestId('tower-enter').click();const resumed=await state(page);assert.equal(resumed.tower.run.runId,committed.tower.run.runId);assert.equal(resumed.tower.run.clearedFloors,1);assert.deepEqual(resumed.tower.run.question,committed.tower.run.question);pass('reload resumes pinned authoritative run');
 // Continue through ordinary floors; complete both boss choices atomically.
 while((await state(page)).tower.run.clearedFloors<4){
  if(await page.getByTestId('tower-continue').isVisible().catch(()=>false))await continueRun(page);
  await pick(page);await confirm(page);
 }
 if(await page.getByTestId('tower-continue').isVisible().catch(()=>false))await continueRun(page);
 const bossBefore=await state(page),boss=bossBefore.tower.run.question;assert.equal(boss?.parts.length,2);
 const first=bank.records.find(q=>q.id===boss!.id)!.parts[0];await page.getByTestId(`tower-choice-${first.id}-${first.answerId}`).check();
 assert.equal(await page.getByTestId('tower-confirm').isEnabled(),false);assert.equal((await state(page)).tower.run.revision,bossBefore.tower.run.revision);
 await pick(page);await page.screenshot({path:'output/game-01/t3/screenshots/desktop-boss.png',fullPage:true});await confirm(page);
 const completed=await state(page);assert.equal(completed.tower.run.status,'COMPLETED');assert.equal(completed.tower.bestClearedFloors,5);
 await page.screenshot({path:'output/game-01/t3/screenshots/desktop-victory.png',fullPage:true});pass('boss requires both selections, atomic victory and personal best');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 const mobile=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),phone=await mobile.newPage();
 await login(phone,'bob');await hub(phone);assert.match(await phone.getByTestId('tower-card').innerText(),/0|floor|tower/i);
 await phone.getByTestId('tower-enter').click();await phone.getByTestId('tower-acknowledge').check();await phone.getByTestId('tower-start').click();await phone.getByTestId('tower-confirm').waitFor();
 const bob=await state(phone);assert.notEqual(bob.tower.run.runId,completed.tower.run.runId);assert.equal(bob.tower.run.clearedFloors,0);
 await phone.getByRole('button',{name:'Switch interface to Vietnamese'}).click();assert.equal(await phone.locator('html').getAttribute('lang'),'vi');
 assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const radio=phone.locator('input[type=radio]').first();await radio.focus();assert.equal(await radio.evaluate((e:Element)=>document.activeElement===e),true);
 await phone.screenshot({path:'output/game-01/t3/screenshots/mobile-active-vi.png',fullPage:true});
 await phone.setViewportSize({width:320,height:844});assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.equal(await phone.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),true);
 assert.ok(await phone.locator('.tower-choice').first().evaluate((e:Element)=>e.getBoundingClientRect().height)>=48);
 // Simulate 200% magnification at 640px, yielding a 320px CSS layout.
 await phone.setViewportSize({width:640,height:844});await phone.evaluate(()=>{document.body.style.zoom='2';});
 await phone.screenshot({path:'output/game-01/t3/screenshots/mobile-zoom-200.png',fullPage:true});
 // CSS zoom does not alter media-query breakpoints like browser zoom, so this
 // is a conservative simulation rather than native browser zoom verification.
 const zoom=await phone.evaluate(()=>({pageOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,
  towerOverflow:Array.from(document.querySelectorAll('.tower-shell, .tower-choice')).some(e=>e.getBoundingClientRect().right>innerWidth+1)}));
 assert.equal(zoom.towerOverflow,false);assert.equal(zoom.pageOverflow,false);
 await phone.evaluate(()=>{document.body.style.zoom='';});
 pass('two-account isolation, 320px/mobile Vietnamese, keyboard focus, reduced motion and simulated 200% Tower content');
 while((await state(phone)).tower.run.clearedFloors<4){await pick(phone);await confirm(phone);await continueRun(phone);}
 const beforeBoss=await state(phone);await pick(phone,'p2');await confirm(phone);
 const failedBoss=await state(phone);assert.equal(failedBoss.tower.run.status,'FAILED');assert.equal(failedBoss.tower.run.clearedFloors,4);assert.equal(failedBoss.tower.run.revision,beforeBoss.tower.run.revision+1);
 const outcome=await phone.getByTestId('tower-outcome').innerText();assert.match(outcome,/Đúng/);assert.match(outcome,/Chưa đúng/);
 pass('boss wrong second part fails atomically and retains correct first-part feedback');
 await desktop.close();await mobile.close();
 await writeFile('output/game-01/t3/browser-evidence.json',JSON.stringify({status:'PASS',checks,screenshots:['desktop-correct.png','desktop-failed.png','desktop-boss.png','desktop-victory.png','mobile-active-vi.png','mobile-zoom-200.png'],limitations:['Synthetic Auth and loopback fixture; no hosted Google OAuth','No independent usability study','Automated checks do not establish WCAG conformance','CSS zoom is a simulation and native browser zoom/assistive technology testing remain unverified']},null,2));
 console.log(`PASS ${checks.length} browser groups, desktop/mobile, synthetic Auth and local PostgreSQL`);
}catch(error){console.error(logs.slice(-3500));throw error;}
finally{await browser?.close();if(child.exitCode===null){
 const exited=once(child,'exit');try{await fetch(`${base}/__tower_fixture/shutdown`,{method:'POST',headers:{origin:base},signal:AbortSignal.timeout(3000)});}catch{/* Startup may have failed before the fixture listened. */}
 const clean=await Promise.race([exited.then(()=>true),new Promise<boolean>(r=>setTimeout(()=>r(false),12000))]);
 if(!clean&&child.exitCode===null){child.kill();await exited;}
}}
