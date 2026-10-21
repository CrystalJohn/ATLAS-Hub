'use client';
import {useId,useState} from 'react';
import {forestLesson,readingBands,type ReadingBand} from '../../content/english/forest.js';
import type {EnglishEvidence,projection} from '../../packages/domain/src/index.js';
import {useLocalPreference} from './useLocalPreference';
type LearningState=ReturnType<typeof projection>;
type Outcome={correct:boolean;awardedXp:number;items:{itemId:string;skill:string;correct:boolean;feedback:string}[];state:LearningState};
type Props={attemptId:string;observed:number;englishEvidence:EnglishEvidence[];onState:(state:LearningState)=>void;vietnamese:boolean;onVietnameseChange:(value:boolean)=>void;expanded:boolean;onExpandedChange:(value:boolean)=>void;onReturnToClues:()=>void;onBusyChange:(busy:boolean)=>void};
const preferenceKey='atlas-reading-band-v1';
function isReadingBand(value:string):value is ReadingBand{return readingBands.includes(value as ReadingBand);}
function readLegacyReadingBand():ReadingBand|null{try{const value:unknown=JSON.parse(window.localStorage.getItem('atlas-language-support-v1')??'null');if(value&&typeof value==='object'&&'band' in value&&typeof value.band==='string'&&isReadingBand(value.band))return value.band;}catch{/* Ignore malformed optional preferences. */}return null;}
export function EnglishLearning({attemptId,observed,englishEvidence,onState,vietnamese:vi,onVietnameseChange,expanded,onExpandedChange,onReturnToClues,onBusyChange}:Props){
 const [band,setBand]=useLocalPreference(preferenceKey,'A2',isReadingBand,readLegacyReadingBand),[word,setWord]=useState('');
 const [answers,setAnswers]=useState({read:'',word:''}),[busy,setBusy]=useState(false),[error,setError]=useState(''),[result,setResult]=useState<Outcome|null>(null);
 const [used,setUsed]=useState({vietnamese:vi,glossary:false});
 const glossaryId=useId();
 function preferences(nextBand:ReadingBand,nextVi:boolean){setBand(nextBand);onVietnameseChange(nextVi);setUsed(s=>({...s,vietnamese:s.vietnamese||nextVi}));}
 const variant=forestLesson.variants[band],entry=forestLesson.glossary.find(e=>e.word===word);
 const saved=englishEvidence.filter(e=>e.lessonId===forestLesson.id&&e.version===forestLesson.version&&e.band===band);
 const passage=variant.passage.split(/\b(shade|stream|insects|canopy)\b/gi);
 async function submit(){
  if(busy)return;setBusy(true);onBusyChange(true);setError('');setResult(null);
  try{
   const response=await fetch(`/api/attempts/${attemptId}/english`,{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(20000),body:JSON.stringify({lessonId:forestLesson.id,version:forestLesson.version,band,answers,support:{...used,vietnamese:used.vietnamese||vi}})});
   const body=await response.json() as Outcome & {message?:string};if(!response.ok)throw new Error(body.message??'Could not check your practice. Try again.');
   setResult(body);onState(body.state);
  }catch(e){setError(e instanceof Error?e.message:'Could not connect. Try again.');}finally{setBusy(false);onBusyChange(false);}
 }
 return <details className="english-learning" lang="en" open={expanded} onToggle={e=>onExpandedChange(e.currentTarget.open)}>
  <summary><span>English practice</span><small>Reading + vocabulary · 2 questions · optional</small></summary>
  <div className="english-heading"><small>OPTIONAL · ENGLISH FIELD NOTE</small><h3>Read the forest</h3></div>
  <p className="field-hint">Read the short note, answer two questions, then check your answers.</p>{vi&&<p className="instruction-vi" lang="vi">Đọc đoạn văn, chọn đáp án cho 2 câu hỏi rồi kiểm tra. Đây là phần luyện thêm, không bắt buộc để mở khu tiếp theo.</p>}
  <div className="language-controls">
   <label>Reading target <select aria-label="Reading target" value={band} disabled={busy} onChange={e=>{preferences(e.target.value as ReadingBand,vi);setAnswers({read:'',word:''});setResult(null);setError('');setWord('');}}>{readingBands.map(b=><option key={b}>{b}</option>)}</select></label>
   <label lang="vi"><input type="checkbox" checked={vi} disabled={busy} onChange={e=>preferences(band,e.target.checked)}/> Hỗ trợ tiếng Việt</label>
  </div>
  <p className="field-hint">{variant.goal} Target applies to this note only, not the whole mission or your proficiency.</p>
  <p className="english-passage">{passage.map((part,i)=>forestLesson.glossary.some(e=>e.word===part.toLowerCase())?<button type="button" className="vocabulary-word" key={i} disabled={busy} aria-expanded={word===part.toLowerCase()} aria-controls={glossaryId} aria-label={`Word help: ${part}`} onClick={()=>{setWord(word===part.toLowerCase()?'':part.toLowerCase());setUsed(s=>({...s,glossary:true}));}}>{part}</button>:part)}</p>
  <p className="field-hint">Tap an underlined word, or use Tab and Enter, for a contextual example. Vietnamese meanings appear when assistance is enabled.</p>
  <div id={glossaryId}>{entry&&<div className="vocabulary-card" role="region" aria-label={`${entry.word} word help`}><strong>{entry.word}{vi&&<> · <span lang="vi">{entry.meaning}</span></>}</strong>{vi&&<p lang="vi">{entry.explanation}</p>}<p><em>{entry.example}</em></p>{vi&&<p lang="vi">{entry.exampleVi}</p>}<button type="button" className="text-button" onClick={()=>setWord('')}>Close word help</button></div>}</div>
  {vi&&<details className="vietnamese-note"><summary lang="vi">Giải thích ngắn bằng tiếng Việt</summary><p lang="vi">{variant.vi}</p></details>}
  <p className="english-evidence">{saved.length}/2 items practised at target {band}. These are local task results, not a CEFR placement.</p>
  <div className="english-practice-status" role="status">{observed<3?<><p>Read all 3 mission clues first · {observed}/3 read</p><button type="button" className="secondary-button" onClick={onReturnToClues}>Return to mission clues</button>{vi&&<p lang="vi">Đọc đủ 3 manh mối để mở phần luyện này.</p>}</>:<p>Questions ready · {Number(!!answers.read)+Number(!!answers.word)}/2 answered</p>}</div><fieldset className="english-questions" disabled={busy||observed<3}>
   <legend>Try the field note</legend>
   {observed<3&&<p className="field-hint">Inspect all three mission clues to unlock these practice questions.</p>}
   {variant.questions.map(q=><fieldset key={`${band}-${q.id}`}><legend>{q.skill==='reading'?'Question 1 · Reading':'Question 2 · Vocabulary'} · {q.prompt}</legend>{q.options.map(o=><label key={o.id}><input type="radio" name={`${glossaryId}-${q.id}`} checked={answers[q.id]===o.id} onChange={()=>{setAnswers(a=>({...a,[q.id]:o.id}));setResult(null);}}/>{o.text}</label>)}</fieldset>)}
   <button type="button" className="secondary-button" disabled={busy||observed<3||!answers.read||!answers.word} onClick={submit}>{busy?'Checking English practice…':'Check my English answers'}</button>
  </fieldset>
  {error&&<p role="alert">{error} Your answers are kept; try again.</p>}
  {result&&<div className="english-result" role="status">{result.items.map(i=><p key={i.itemId}><strong>{i.skill}: {i.correct?'Correct':'Try again'}.</strong> {i.feedback}</p>)}<p>+0 additional XP · Language support never reduces mission rewards.</p></div>}
  <p className="field-hint">Pilot lesson · Educator review pending. Reading targets are not a proficiency assessment.</p>
 </details>;
}
export function EnglishMastery({state}:{state:LearningState|null}){
 return <section className="english-mastery" aria-label="English practice evidence"><h3>English Mastery · practice evidence</h3><p>Separate from subject knowledge and character level.</p><ul>{(['reading','vocabulary','listening','pronunciation','speaking'] as const).map(skill=><li key={skill}><strong>{skill}</strong><span>{state?.englishMastery[skill].status==='PRACTICED'?`${state.englishMastery[skill].items} item(s) practised`:'Not assessed'}</span></li>)}</ul><p>No CEFR proficiency assigned. Assistance is allowed; these tasks do not assess listening or speaking.</p></section>;
}
