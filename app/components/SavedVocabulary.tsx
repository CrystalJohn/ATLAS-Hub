'use client';
import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {Bookmark,BookmarkCheck,RefreshCw,Trash2} from 'lucide-react';
import {travelVocabularyLessons} from '../../content/travel/japan';
import {chapterLessons} from '../../content/english/chapter';
import {vocabularyKey,type SavedWord,type VocabularyResponse} from '../../content/english/vocabulary';
import {pronunciations} from '../../content/english/pronunciation';
import {atlasApi} from './chapter-types';
import {Bilingual} from './Bilingual';
type WordIdentity=Pick<SavedWord,'lessonId'|'version'|'word'>;
export type VocabularyStore={words:SavedWord[];loading:boolean;pending:boolean;error:string;reload:()=>void;toggle:(word:WordIdentity,saved:boolean)=>Promise<void>};
export const VocabularyContext=createContext<VocabularyStore|null>(null);
export function SavedVocabularyProvider({children,api=atlasApi,enabled=true}:{children:ReactNode;api?:<T>(path:string,data?:unknown)=>Promise<T>;enabled?:boolean}){
 const [words,setWords]=useState<SavedWord[]>([]),[loading,setLoading]=useState(true),[pending,setPending]=useState(false),[error,setError]=useState(''),[reloadVersion,setReloadVersion]=useState(0);
 const saving=useRef(false);
 useEffect(()=>{
  if(!enabled)return;
  let active=true;
  void api<VocabularyResponse>('vocabulary').then(response=>{if(active)setWords(response.words);}).catch(()=>{if(active)setError('Could not load saved words.');}).finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};
 },[api,enabled,reloadVersion]);
 function reload(){setLoading(true);setError('');setReloadVersion(version=>version+1);}
 async function toggle(word:WordIdentity,saved:boolean){
  if(saving.current||loading)return;saving.current=true;setPending(true);setError('');
  try{const response=await api<VocabularyResponse>('vocabulary',{lessonId:word.lessonId,version:word.version,word:word.word,saved});setWords(response.words);}catch{setError('Could not save this word. Try again.');}finally{saving.current=false;setPending(false);}
 }
 return <VocabularyContext value={{words,loading,pending,error,reload,toggle}}>{children}</VocabularyContext>;
}
export function Pronunciation({word}:{word:string}){
 const ipa=pronunciations[word];if(!ipa)return null;
 return <div className="word-pronunciation"><div className="word-ipa-grid"><span><b>US</b><span lang="en-US">/{ipa.us}/</span></span><span><b>UK</b><span lang="en-GB">/{ipa.uk}/</span></span></div><a href={ipa.sourceUrl} target="_blank" rel="noopener noreferrer"><Bilingual text="IPA source"/> · Cambridge ↗</a></div>;
}
export function SaveWordButton({lessonId,version,word}:{lessonId:string;version:1;word:string}){
 const store=useContext(VocabularyContext),identity={lessonId,version,word};
 const saved=store?.words.some(item=>vocabularyKey(item)===vocabularyKey(identity))??false;
 return <div className="word-save-area"><button type="button" className={`word-save-button ${saved?'is-saved':''}`} disabled={!store||store.loading||store.pending||!!store.error} aria-pressed={saved} onClick={()=>{void store?.toggle(identity,!saved);}}>{saved?<BookmarkCheck size={18}/>:<Bookmark size={18}/>}<Bilingual text={store?.pending?'Saving…':store?.loading?'Loading saved words…':saved?'Saved word':'Save word'}/></button>{saved&&<p className="word-save-confirmation" role="status"><Bilingual text="Saved to My journal"/></p>}{store?.error&&<div role="alert" className="word-save-error"><Bilingual text={store.error}/><button type="button" disabled={store.pending||store.loading} onClick={store.reload}><RefreshCw size={14}/><Bilingual text="Retry"/></button></div>}</div>;
}
export function SavedWords({vietnamese}:{vietnamese:boolean}){
 const store=useContext(VocabularyContext);if(!store)return null;
 return <section className="saved-words" aria-labelledby="saved-words-title"><div className="saved-words-heading"><BookmarkCheck size={24}/><h2 id="saved-words-title"><Bilingual text="My saved words"/> <span>{store.words.length}</span></h2></div><p className="micro-copy"><Bilingual text="Words you choose to keep, saved to your account."/></p>{store.loading?<p role="status"><Bilingual text="Loading saved words…"/></p>:store.error?<div role="alert" className="word-save-error"><Bilingual text={store.error}/><button type="button" onClick={store.reload}><Bilingual text="Retry"/></button></div>:!store.words.length?<p className="saved-words-empty"><Bilingual text="Tap a word in a field note, then choose Save word."/></p>:<div className="saved-words-grid">{store.words.map(item=>{const lesson=[...chapterLessons,...travelVocabularyLessons].find(l=>l.id===item.lessonId&&l.version===item.version),entry=lesson?.glossary.find(e=>e.word===item.word);if(!entry)return null;return <article key={vocabularyKey(item)}><div className="saved-word-topline"><h3>{entry.word}{vietnamese&&<small lang="vi">{entry.meaning}</small>}</h3><button type="button" disabled={store.pending} aria-label={vietnamese?`Bỏ lưu: ${entry.word}`:`Remove saved word: ${entry.word}`} onClick={()=>{void store.toggle(item,false);}}><Trash2 size={18}/></button></div><Pronunciation word={entry.word}/><p><em>{entry.example}</em></p>{vietnamese&&<p lang="vi">{entry.exampleVi}</p>}<small><Bilingual text={lesson!.title}/></small></article>;})}</div>}</section>;
}
