'use client';
import {useLocalPreference} from './useLocalPreference';
import {ArrowRight,BookOpen,CheckCircle2,Languages,Leaf,TreePine,Waves} from 'lucide-react';
import {Bilingual} from './Bilingual';
import {translateVietnamese} from '../../content/localization/vi';
import type {Mission} from './chapter-types';
import type {EnglishLesson,ReadingBand} from '../../content/english/chapter';
type TranslationMode='on-demand'|'parallel';
const preferenceKey='atlas-story-translation-mode-v1';
function isTranslationMode(value:string):value is TranslationMode{return value==='on-demand'||value==='parallel';}
function StoryCopy({text,vietnamese,mode}:{text:string;vietnamese:boolean;mode:TranslationMode}){
 const translation=vietnamese?translateVietnamese(text):undefined;
 return <div className="story-copy"><p lang="en">{text}</p>{translation&&(mode==='parallel'?<p className="story-copy-vi" lang="vi">{translation}</p>:<details className="story-translation"><summary lang="vi"><Languages size={13}/> Xem tiếng Việt</summary><p lang="vi">{translation}</p></details>)}</div>;
}
export function MissionStory({mission,lesson,band,missionIndex,accent,completed,vietnamese:vi,onStart}:{mission:Mission;lesson:EnglishLesson;band:ReadingBand;missionIndex:number;accent:string;completed:boolean;vietnamese:boolean;onStart:()=>void}){
 const [mode,setMode]=useLocalPreference(preferenceKey,'on-demand',isTranslationMode);
 function chooseMode(value:TranslationMode){setMode(value);}
 return <section className="story-card" data-translation-mode={mode}>

 <div className="story-layout"><div className="story-overview">
 {vi&&<div className="story-assistance" role="group" aria-label="Cách hiển thị tiếng Việt" lang="vi"><span><Languages size={15}/> Hỗ trợ Việt</span><div><button type="button" aria-pressed={mode==='on-demand'} onClick={()=>chooseMode('on-demand')}>Xem khi cần</button><button type="button" aria-pressed={mode==='parallel'} onClick={()=>chooseMode('parallel')}>Song ngữ</button></div></div>}
 <div className="story-identity"><div className={`activity-illustration ${accent}`}>{missionIndex===0?<TreePine size={42}/>:missionIndex===1?<Waves size={42}/>:<Leaf size={42}/>}</div><span className="pill neutral"><Bilingual text="ELARA HAS A MISSION FOR YOU"/></span></div>
 <h1><Bilingual text={mission.title}/></h1><div className="story-text"><StoryCopy text={mission.narrative} vietnamese={vi} mode={mode}/></div>
 {vi&&<p className="story-support-note" lang="vi">Mỗi bước làm một việc. Phần luyện tiếng Anh có thể bỏ qua; nhiệm vụ khám phá vẫn giữ nguyên thưởng.</p>}
 </div><div className="story-plan"><div className="mission-checklist"><h3><Bilingual text="On this adventure, you’ll…"/></h3>{mission.objectives.map(objective=><div className="story-objective" key={objective}><CheckCircle2 size={17}/><StoryCopy text={objective} vietnamese={vi} mode={mode}/></div>)}<div className="story-objective"><BookOpen size={17}/><StoryCopy text={lesson.variants[band].goal} vietnamese={vi} mode={mode}/></div></div>
 <div className="lesson-actions"><button className={`play-button ${accent}`} onClick={onStart}><Bilingual text="Let’s explore"/> <ArrowRight size={18}/></button><p className="micro-copy"><Bilingual text={completed?'Revisit freely · first-clear XP was already earned':`First-clear reward · ${mission.rewards.xp} XP`}/></p></div>

 </div></div></section>;
}
