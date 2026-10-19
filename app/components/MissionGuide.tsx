'use client';
import {missionGuidance,type GuideInput} from './mission-guidance';
type Props={progress:GuideInput;vietnamese:boolean;busy:boolean;onVietnamese:(v:boolean)=>void;onAction:()=>void;onHelp:()=>void;onEnglish?:()=>void};
export function MissionGuide({progress,vietnamese,busy,onVietnamese,onAction,onHelp,onEnglish}:Props){
 const guide=missionGuidance(progress),labels=progress.type==='PUZZLE'?['Plan','Explain','Complete']:['Observe','Answer','Unlock'];
 return <section className="mission-guide" aria-label="Mission guidance">
  <div className="guide-toolbar"><span>YOUR NEXT STEP</span><button type="button" onClick={onHelp}>How to play</button><label lang="vi"><input type="checkbox" checked={vietnamese} onChange={e=>onVietnamese(e.target.checked)}/> Tiếng Việt</label></div>
  <ol className="mission-steps" aria-label="Mission steps">{labels.map((label,i)=><li key={label} className={guide.current>i+1?'finished':guide.current===i+1?'current':''} aria-current={guide.current===i+1?'step':undefined}><span>{guide.current>i+1?'✓':i+1}</span>{label}</li>)}</ol>
  <div className="guide-current" aria-live="polite"><strong>{guide.title}</strong>{vietnamese&&<p lang="vi">{guide.vi}</p>}</div>
  {progress.started&&!progress.complete&&<button type="button" className="guide-action" disabled={busy} onClick={onAction}>{busy?'Saving…':guide.button}{vietnamese&&!busy&&<small lang="vi">{guide.buttonVi}</small>}<span aria-hidden="true">→</span></button>}
  {onEnglish&&<button type="button" className="guide-english-link" disabled={busy} onClick={onEnglish}>English practice <span>2 questions · optional</span>{vietnamese&&<small lang="vi">Luyện đọc và từ vựng · Không bắt buộc</small>}</button>}
 </section>;
}
