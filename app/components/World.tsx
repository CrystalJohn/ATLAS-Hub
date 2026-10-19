'use client';
import {useMemo} from 'react';
import {Check,Lock,Leaf,Waves,Sprout,Telescope,Compass,Search,X} from 'lucide-react';
export const locations=[
 {id:'silent-forest',name:'The Silent Forest',label:'Whispering Woods',x:27,y:48,number:'01',Icon:Leaf},
 {id:'disappearing-lake',name:'The Disappearing Lake',label:'Mirrorwater Lake',x:61,y:59,number:'02',Icon:Waves},
 {id:'restore-ecosystem',name:'Restore the Ecosystem',label:'The Renewal Grove',x:75,y:29,number:'03',Icon:Sprout},
 {id:'observation-station',name:'Observation Station',label:'Observation Station',x:46,y:20,number:'04',Icon:Telescope},
];
function hash(n:number){const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);}
export interface MapClue {id:string;title:string;reading:string;detail:string;observed:boolean;}
export function World({selected,onSelect,unlocked,completed,restored,zoom,clues=[],onInspect,activeClue,onCloseClue,busy=false}:{selected:string;onSelect:(id:string)=>void;unlocked:string[];completed:string[];restored:boolean;zoom:number;clues?:MapClue[];onInspect?:(id:string)=>void;activeClue?:string;onCloseClue?:()=>void;busy?:boolean}){
 const trees=useMemo(()=>Array.from({length:470},(_,i)=>{const x=hash(i+2)*1040-20,y=155+hash(i+491)*630;const lake=((x-635)/172)**2+((y-490)/105)**2<1.25;const river=y<420&&Math.abs(x-(690-0.21*y))<44;const points=[[270,365],[460,152],[750,220],[185,600]];const clearing=points.some(([a,b])=>Math.hypot(x-a,(y-b)*1.25)<68);const path1=x>180&&x<610&&Math.abs(y-(420+60*Math.sin((x-240)/100)))<23;const path2=x>450&&x<780&&Math.abs(y-(140+(x-450)*.3))<24;return {x,y,s:.65+hash(i+92)*.7,kind:hash(i+19)>.74?'broad':'pine',hidden:lake||river||clearing||path1||path2};}).filter(t=>!t.hidden).sort((a,b)=>a.y-b.y),[]);
 return <div className={`world-viewport ${restored?'world-restored':''}`}>
 <div className="map-canvas" style={{transform:`scale(${zoom})`}}>
 <svg className="world-art" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true" focusable="false">
 <defs>
  <linearGradient id="land" x2=".8" y2="1"><stop stopColor="#48695b"/><stop offset=".5" stopColor="#7e9770"/><stop offset="1" stopColor="#3c6752"/></linearGradient>
  <linearGradient id="sky" x2="0" y2="1"><stop stopColor="#a3b4a6"/><stop offset="1" stopColor="#657e71"/></linearGradient>
  <linearGradient id="water" x1="0" y1="0" x2="1" y2="1"><stop stopColor={restored?'#5bb9ac':'#6b9390'}/><stop offset=".55" stopColor={restored?'#2e9293':'#4b777b'}/><stop offset="1" stopColor="#285d67"/></linearGradient>
  <linearGradient id="trunk" x2="1"><stop stopColor="#795f43"/><stop offset="1" stopColor="#4f4f3a"/></linearGradient>
  <radialGradient id="sun"><stop stopColor="#f8eac2" stopOpacity=".35"/><stop offset="1" stopColor="#e4e1b4" stopOpacity="0"/></radialGradient>
  <radialGradient id="shade"><stop stopColor="#071e1a" stopOpacity="0" offset=".45"/><stop offset="1" stopColor="#071e1a" stopOpacity=".55"/></radialGradient>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".62" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".065"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="12"/></filter>
  <filter id="glow"><feGaussianBlur stdDeviation="4"/></filter>
  <g id="pine"><ellipse cy="7" rx="17" ry="7" fill="#153e30" opacity=".28"/><path d="M-3 5L0-48 4 5" fill="url(#trunk)"/><path d="M0-78L-13-48-7-49-21-27-12-29-28-4 0-10 27-4 12-30 20-27 7-50 13-48Z" fill="#285740"/><path d="M0-78L-13-48-7-49-21-27-12-29-28-4 0-10Z" fill="#3e7251"/><path d="M0-78L-3-52-13-48M-7-49L-3-31-21-27M-12-29L-2-13-28-4" fill="none" stroke="#75a271" strokeWidth="1.8" opacity=".44"/></g>
  <g id="broad"><ellipse cy="8" rx="23" ry="8" fill="#173b2a" opacity=".2"/><path d="M-3 5L-1-39 5-49 2 4" fill="url(#trunk)"/><circle cx="-12" cy="-42" r="20" fill="#4f7a51"/><circle cx="12" cy="-43" r="21" fill="#477249"/><circle cy="-60" r="23" fill="#6f9360"/><path d="M-19-62Q-12-82 5-80" stroke="#b4bc79" strokeWidth="3" opacity=".5" fill="none"/></g>
  <g id="rock"><path d="M-12 4L-16-4-6-16 7-14 16-1 10 6Z" fill="#8b9985"/><path d="M-16-4L-6-16 7-14 3-5Z" fill="#b7bba2"/><path d="M3-5L7-14 16-1 10 6Z" fill="#647c6a"/></g>
 </defs>
 <g filter="url(#grain)">
 <rect width="1000" height="760" fill="url(#land)"/>
 <path d="M0 0H1000V225Q867 132 780 171T567 139T300 167T0 207Z" fill="url(#sky)"/>
 <path d="M160 157L247 40 276 81 320 30 410 153 483 61 551 147 622 72 712 139 794 33 888 146 950 94 1020 178V243H0V169L87 99Z" fill="#526e63" opacity=".7"/>
 <path d="M247 40L224 91 246 78 261 100 276 81ZM320 30L286 87 316 68 345 85ZM794 33L766 82 794 64 825 91Z" fill="#c2ccbc" opacity=".56"/>
 <path d="M-20 234Q139 128 287 205T566 205T819 208T1030 153" stroke="#8fa58a" strokeWidth="36" fill="none" opacity=".4"/>
 <path d="M-55 464Q150 284 325 344T637 332T1084 288" stroke="#b2b493" strokeWidth="90" fill="none" opacity=".14"/>
 <path d="M0 637Q198 583 290 633T575 686T1000 610" stroke="#284f3f" strokeWidth="140" fill="none" opacity=".3"/>
 {[0,1,2,3].map(i=><path key={i} d={`M-60 ${270+i*118} Q180 ${190+i*105} 320 ${267+i*118}T1000 ${260+i*126}`} stroke="#cfceb0" strokeWidth="1" fill="none" opacity=".12"/>)}
 <path d="M664 138C681 205 605 249 623 300S660 367 638 413" stroke="#a9b29a" strokeWidth="63" fill="none"/>
 <path d="M664 138C681 205 605 249 623 300S660 367 638 413" stroke="url(#water)" strokeWidth="44" fill="none"/>
 <path d="M661 151C677 201 604 249 627 302S650 365 636 406" stroke="#bcdbcb" strokeWidth="3" strokeDasharray="9 42" fill="none" opacity=".5"/>
 <path d="M511 414C555 382 641 393 676 408S809 405 819 464 767 550 723 567 610 594 559 564 463 529 468 485 477 438 511 414Z" fill="#334f3d" opacity=".25" transform="translate(4 14)"/>
 <path d="M511 414C555 382 641 393 676 408S809 405 819 464 767 550 723 567 610 594 559 564 463 529 468 485 477 438 511 414Z" fill="#a4ad86" stroke="#b5b68b" strokeWidth="10"/>
 <path d="M526 425C565 402 641 407 673 420S790 420 801 463 752 536 713 551 618 576 568 550 484 517 484 484 492 445 526 425Z" fill="url(#water)"/>
 <g className="water-glints" stroke="#bdd8c4" opacity=".4" strokeLinecap="round"><path d="M552 457h34m70-8h42m37 40h35m-219 14h48m51 32h34m-77-53h28m-8-37h13"/><path d="M577 527h22m123-4h17m-93-18h17m-129-19h12"/></g>
 <path d="M725 554C711 604 818 626 814 689S869 738 898 773" stroke="#a4ad86" strokeWidth="52" fill="none"/>
 <path d="M725 554C711 604 818 626 814 689S869 738 898 773" stroke="url(#water)" strokeWidth="35" fill="none"/>
 <path d="M174 637C184 552 273 529 272 452S350 408 403 455 450 457 493 470M285 416C325 344 391 310 447 313S535 351 552 316 598 250 676 257 730 234 762 212M448 310C426 257 435 216 459 155" stroke="#304f35" strokeWidth="15" fill="none" opacity=".25" transform="translate(4 5)"/>
 <path d="M174 637C184 552 273 529 272 452S350 408 403 455 450 457 493 470M285 416C325 344 391 310 447 313S535 351 552 316 598 250 676 257 730 234 762 212M448 310C426 257 435 216 459 155" stroke="#c6b994" strokeWidth="9" fill="none" opacity=".8"/>
 <path d="M174 637C184 552 273 529 272 452S350 408 403 455 450 457 493 470M285 416C325 344 391 310 447 313S535 351 552 316 598 250 676 257 730 234 762 212M448 310C426 257 435 216 459 155" stroke="#ecdcad" strokeWidth="2" strokeDasharray="3 11" fill="none" opacity=".55"/>
 {/* Timber bridge over the headwater. */}
 <g transform="translate(618 257) rotate(8)"><path d="M-35-10H35V11H-35Z" fill="#755e40" stroke="#4c4e32" strokeWidth="3"/>{Array.from({length:12},(_,i)=><path key={i} d={`M${-31+i*5.6}-9v20`} stroke="#c0a579" strokeWidth="3"/>)}<path d="M-38-13H38M-38 14H38" stroke="#bfa174" strokeWidth="4"/></g>
 {trees.map((t,i)=><use key={i} href={`#${t.kind}`} transform={`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)}) scale(${t.s.toFixed(2)})`} opacity={t.y<210?.7:1}/>)}
 {/* The abandoned lookout becomes an illuminated observation station. */}
 <g transform="translate(460 156)"><ellipse cy="17" rx="55" ry="18" fill="#183c2f" opacity=".28"/><path d="M-28 4V-30L0-47 28-30V4L0 21Z" fill="#7a7656"/><path d="M0-47L28-30V4L0 21Z" fill="#4b6350"/><path d="M-35-29L0-63 36-29 0-10Z" fill={restored?'#a7b193':'#83917a'} stroke="#c0bfa0" strokeWidth="2"/><path d="M-17-9V5L-6 11V-4Z" fill={restored?'#f0d890':'#273f32'}/><path d="M9-6V7L19 1V-12Z" fill={restored?'#f0d890':'#273f32'}/><path d="M-14 16L-14 35M15 16L15 35" stroke="#5e6041" strokeWidth="5"/><path d="M-14 29H15M-14 22H15" stroke="#b8aa7c" strokeWidth="3"/>{restored&&<circle cy="-23" r="50" fill="#e5df88" opacity=".15" filter="url(#glow)"/>}</g>
 <g transform="translate(181 597)"><ellipse cy="10" rx="44" ry="14" fill="#254b34" opacity=".4"/><path d="M-35 7L-5-43 22 7Z" fill="#d3bd87"/><path d="M-5-43L40-9 22 7Z" fill="#a18d61"/><path d="M-5-33L-13 7H11Z" fill="#44513c"/><path d="M52 20L68 15M55 13L66 23" stroke="#5d4d31" strokeWidth="4"/><path d="M57 18Q52 9 60 0Q60 10 66 10Q73 20 57 18Z" fill="#e3b963"/><path d="M59-4Q49-14 58-24" stroke="#d5d7b5" strokeWidth="3" fill="none" opacity=".5"/></g>
 <g transform="translate(749 223)"><ellipse cy="6" rx="53" ry="17" fill={restored?'#86b478':'#c4b78c'} opacity=".5"/>{[[-30,0],[0,-12],[28,1]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}>{restored?<><path d="M0 0V-20M0-10Q-15-24-15-12Q-9-7 0-10M0-18Q13-30 15-20Q7-15 0-18" stroke="#37683c" strokeWidth="3" fill="#91bc76"/></>:<><path d="M-8 0V-11L5-15 10-8V0Z" fill="#a6a17c"/><ellipse cy="-10" rx="9" ry="4" fill="#c5b48b"/><ellipse cy="-10" rx="5" ry="2" fill="none" stroke="#99845e"/></>}</g>)}</g>
 {Array.from({length:38},(_,i)=><use key={`r${i}`} href="#rock" transform={`translate(${hash(i+345)*1000} ${245+hash(i+798)*500}) scale(${.2+hash(i+322)*.45})`}/>)}
 {restored&&<g fill="#c8de9b">{Array.from({length:36},(_,i)=><circle key={i} cx={485+hash(i+645)*310} cy={390+hash(i+118)*215} r={1.5+hash(i+8)*2}/>)}</g>}
 <ellipse cx="720" cy="150" rx="370" ry="300" fill="url(#sun)"/>
 <path d="M910-50L250 760H500L1000 90" fill="#f3e6b1" opacity=".035"/>
 <rect width="1000" height="760" fill="url(#shade)"/>
 </g>
 <g fill="#d1d4b9" opacity=".17" filter="url(#soft)"><ellipse cx="60" cy="270" rx="190" ry="22"/><ellipse cx="810" cy="190" rx="200" ry="12"/><ellipse cx="830" cy="680" rx="180" ry="17"/></g>
 <g className="birds" stroke="#c5d1b8" fill="none" strokeWidth="2" opacity=".7"><path d="M364 219q6-7 12 0q6-7 12 0M386 203q4-5 8 0q4-5 8 0M339 230q4-5 8 0q4-5 8 0"/></g>
 </svg>
 {locations.map(({id,name,label,x,y,number,Icon})=>{const open=unlocked.includes(id),done=completed.includes(id);return <button key={id} className={`location ${selected===id?'selected':''} ${open?'available':'locked'} ${done?'completed':''}`} style={{left:`${x}%`,top:`${y}%`}} onClick={()=>onSelect(id)} aria-label={`${name}${done?', completed':open?', available':', locked'}`} aria-pressed={selected===id}>
 <span className="location-ring"><span className="location-core">{done?<Check size={21}/>:open?<Icon size={23}/>:<Lock size={18}/>}</span>{open&&!done&&<span className="location-pulse"/>}</span>
 <span className="location-tag"><span>{done?'✓':number}</span> {label} {!open&&<Lock size={10}/>}</span>
 </button>})}
 {clues.map((clue,i)=>{const coordinates=selected==='silent-forest'?[[15,33],[49,45],[47,66]]:[[57,49],[77,66],[79,45]];return <button key={clue.id} className={`map-clue ${clue.observed?'clue-recorded':''} map-clue-${i}`} style={{left:`${coordinates[i][0]}%`,top:`${coordinates[i][1]}%`}} onClick={()=>onInspect?.(clue.id)} disabled={busy} aria-label={`Inspect ${clue.title}${clue.observed?', recorded':''}`}><span>{clue.observed?<Check size={14}/>:<Search size={16}/>}</span><small>{clue.reading}</small></button>;})}
 <div className="camp-label" style={{left:'18%',top:'84%'}}>EXPEDITION CAMP</div>
 <div className="map-water-label">MIRRORWATER</div>
 <div className="fireflies" aria-hidden="true">{Array.from({length:16},(_,i)=><i key={i} style={{left:`${10+hash(i+4)*80}%`,top:`${20+hash(i+19)*70}%`,animationDelay:`${hash(i)*6}s`}}/>)}</div>
 </div>
 {clues.find(c=>c.id===activeClue&&c.observed)&&<div className="map-fieldnote" role="status"><div><span>FIELD OBSERVATION</span><button aria-label="Close field observation" onClick={onCloseClue}><X size={13}/></button></div><h3>{clues.find(c=>c.id===activeClue)?.title}</h3><p>{clues.find(c=>c.id===activeClue)?.detail}</p></div>}
 <div className="map-caption"><Compass size={14}/> HAND-CHARTED TERRITORY <span>·</span> NATURE REALM</div>
 </div>;
}
