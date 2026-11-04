'use client';
import {Fragment,useEffect,useRef,useState} from 'react';
import {Check, DoorOpen, Footprints, Lock, Map, MapPin, MessageCircle, Ticket, TriangleAlert} from 'lucide-react';
import type {TowerPresentation} from '../../../content/tower/types';
import {useInterfaceLanguage} from '../Bilingual';

type StageState='complete'|'current'|'locked'|'failed';
const icons=[Footprints,Ticket,MessageCircle,Ticket,DoorOpen];
const desktop=['M80 600 C150 630 210 520 290 520','M290 520 C370 520 420 230 510 230','M510 230 C600 230 640 480 720 480','M720 480 C800 480 850 570 920 570'];
const tablet=['M120 180 C200 130 260 230 350 230','M350 230 C470 230 620 310 620 440','M620 440 C620 540 400 550 400 680','M400 680 C530 680 700 760 820 760'];
const mobile=['M350 860 C350 770 620 800 620 670','M620 670 C620 560 380 580 380 470','M380 470 C380 360 620 390 620 270','M620 270 C620 170 420 190 420 90'];
const compact=['M100 425 C160 390 240 425 300 425','M300 425 C360 390 440 425 500 425','M500 425 C560 390 640 425 700 425','M700 425 C760 390 840 425 900 425'];
const positions={compact:[[100,425],[300,425],[500,425],[700,425],[900,425]],desktop:[[80,600],[290,520],[510,230],[720,480],[920,570]],tablet:[[120,180],[350,230],[620,440],[400,680],[820,760]],mobile:[[350,860],[620,670],[380,470],[620,270],[420,90]]};
export function TowerProgress({run,personalBest}:{run:TowerPresentation|undefined;personalBest:number}){
 const {t}=useInterfaceLanguage();
 const [expanded,setExpanded]=useState(run?.status==='NOT_STARTED');
 const root=useRef<HTMLElement>(null);
 const previous=useRef({cleared:run?.clearedFloors??0,status:run?.status,runId:run?.runId});
 const cleared=run?.clearedFloors??0,status=run?.status??'NOT_STARTED',floor=Math.min(cleared+1,5);
 const stageState=(n:number):StageState=>n<=cleared?'complete':n===floor&&status==='FAILED'?'failed':n===floor&&(status==='NOT_STARTED'||status==='IN_PROGRESS')?'current':'locked';
 useEffect(()=>{
  const before=previous.current;previous.current={cleared,status:run?.status,runId:run?.runId};
  if(before.status==='NOT_STARTED'&&status==='IN_PROGRESS')setExpanded(false);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animations:Animation[]=[];
  root.current?.querySelectorAll<SVGSVGElement>('.tower-route').forEach(svg=>{
   const marker=svg.nextElementSibling as HTMLElement|null;
   const advance=before.runId===run?.runId&&cleared===before.cleared+1&&cleared<5&&status!=='FAILED';
   const reset=(status==='FAILED'&&before.status!=='FAILED')||(before.runId!==run?.runId&&status==='IN_PROGRESS');
   if(!marker||reduced)return;
   svg.querySelectorAll<SVGPathElement>('.route-base,.route-progress').forEach(path=>{const length=path.getTotalLength();animations.push(path.animate([{strokeDasharray:String(length),strokeDashoffset:String(length)},{strokeDasharray:String(length),strokeDashoffset:'0'}],{duration:700,easing:'ease-out'}));});
   if(advance){const path=svg.querySelector<SVGPathElement>('[data-segment="'+(cleared-1)+'"]');if(path){const length=path.getTotalLength();const frames=Array.from({length:36},(_,i)=>{const pt=path.getPointAtLength(length*i/35);return {left:(pt.x/10)+'%',top:(pt.y/10)+'%'}});animations.push(marker.animate(frames,{duration:820,easing:'ease-in-out'}));}}
   else if(reset)animations.push(marker.animate([{opacity:0,scale:'.65'},{opacity:1,scale:'1'}],{duration:260}));
  });
  if(cleared>before.cleared)root.current?.querySelectorAll('.stage-'+cleared+' .tower-location').forEach(el=>{if(!reduced)animations.push(el.animate([{transform:'scale(1)'},{transform:'scale(1.18)'},{transform:'scale(1)'}],{duration:450}));});
  return ()=>animations.forEach(a=>a.cancel());
 },[cleared,status,run?.runId,run?.status,expanded]);
 function route(kind:keyof typeof positions,paths:string[]){const index=status==='FAILED'?0:Math.min(cleared,4),[x,y]=positions[kind][index];return <><svg className={'tower-route route-'+kind} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">{paths.map((d,i)=><Fragment key={d}><path d={d} style={{fill:"none",stroke:"#bba58b",strokeWidth:8}} className="route-base"  data-segment={i}/>{(i+2<=cleared||i+2===floor&&status==='IN_PROGRESS')&&<path d={d}  className={'route-progress route-'+stageState(i+2)+(i===3?' route-gold':'')}/>}</Fragment>)}</svg><span className={'tower-traveler-pin pin-'+kind} style={{left:(x/10)+'%',top:(y/10)+'%'}} aria-hidden="true"><MapPin size={18}/></span></>}
 const title=(n:number)=>n===5?t('FINAL GATE','CỔNG CUỐI'):t(`Floor ${n}`,`Tầng ${n}`);
 const label=(s:StageState)=>s==='complete'?t('CLEARED','ĐÃ VƯỢT'):s==='current'?t('YOU ARE HERE','BẠN Ở ĐÂY'):s==='failed'?t('RUN ENDED','LƯỢT KẾT THÚC'):t('LOCKED','CHƯA MỞ');
 const current=status==='COMPLETED'?t('Tower cleared','Đã vượt tháp'):status==='FAILED'?t(`Ended · ${title(floor)}`,`Kết thúc · ${title(floor)}`):title(floor);
 function node(n:number,compact=false){const state=stageState(n),Icon=state==='complete'?Check:state==='failed'?TriangleAlert:icons[n-1];return <li key={n} className={`tower-destination stage-${n} is-${state} ${n===5?'is-gate':''}`} data-testid={`tower-floor-${n}`} data-state={state} tabIndex={0} title={title(n)+": "+label(state)+(state==='locked'?t(' · Clear earlier floors first',' · Vượt các tầng trước'):'')} aria-current={state==='current'?'step':undefined} aria-label={`${title(n)}: ${label(state)}`}><span className="tower-location"><Icon size={compact?18:n===5?28:23} aria-hidden="true"/>{state==='locked'&&<Lock className="tower-node-lock" size={12} aria-hidden="true"/>}</span><strong>{compact?(n===5?'BOSS':n):title(n)}</strong>{!compact&&<><small>{n===5?(state==='current'?t('BOSS READY','BOSS SẴN SÀNG'):'BOSS'):label(state)}</small>{n===5&&state==='locked'&&<span className="tower-gate-rule">{t('Clear Floors 1–4 to unlock','Vượt tầng 1–4 để mở')}</span>}{n===5&&state!=='locked'&&<span className="tower-gate-rule">{label(state)}</span>}</>}</li>}
 return <section ref={root} data-run-status={status} className={`tower-progress tower-adventure ${expanded?'is-expanded':'is-compact'}`} aria-label={t('Tower progress','Tiến độ tháp')} data-testid="tower-progress">
 <div className="tower-map-stats"><div data-testid="tower-best"><span>{t('Personal Best','Thành tích tốt nhất')}</span><strong>{personalBest}<small> / 5</small></strong></div><div><span>{t('Current Run','Lượt hiện tại')}</span><strong>{current}</strong></div></div>
 {expanded?<div className="tower-landscape" id="tower-map-overview" data-testid="tower-map-overview"><span className="tower-map-scribble" aria-hidden="true">{t('A little higher, one step at a time.','Từng bước nhỏ, lên cao hơn.')}</span>{route('desktop',desktop)}{route('tablet',tablet)}{route('mobile',mobile)}<ol className="tower-destinations" aria-label={t('Route from Floor 1 to the final gate','Đường từ tầng 1 đến cổng cuối')}>{[1,2,3,4,5].map(n=>node(n))}</ol></div>:<div className="tower-mini-landscape">{route('compact',compact)}<ol className="tower-mini-route" aria-label={t('Current run floors','Các tầng của lượt hiện tại')}>{[1,2,3,4,5].map(n=>node(n,true))}</ol></div>}
 <button type="button" className="tower-map-toggle" aria-expanded={expanded} aria-controls={expanded?'tower-map-overview':undefined} data-testid="tower-map-toggle" onClick={()=>setExpanded(x=>!x)}><Map size={17} aria-hidden="true"/>{expanded?t('Use compact view','Thu gọn bản đồ'):t('View tower map','Xem bản đồ tháp')}</button>
 </section>;
}
