'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {CalendarDays,Check,ChevronLeft,ChevronRight,Flame,Trophy,X} from 'lucide-react';
import type {StudySummary} from '../../packages/domain/src/study';
import {useInterfaceLanguage} from './Bilingual';
import {atlasApi} from './chapter-types';

const monthOf=(day:string)=>day.slice(0,7);
function shiftMonth(month:string,delta:number){const [y,m]=month.split('-').map(Number);return new Date(Date.UTC(y,m-1+delta,1)).toISOString().slice(0,7);}
export function StudyCalendar({owner}:{owner:string}){
 const {t,locale}=useInterfaceLanguage();
 const [history,setHistory]=useState<StudySummary|null>(null),[error,setError]=useState(false),[loading,setLoading]=useState(true);
 const [month,setMonth]=useState(''),[selected,setSelected]=useState('');
 const dialog=useRef<HTMLDialogElement>(null),generation=useRef(0),recordedToday=useRef('');
 const load=useCallback(async()=>{
  const n=++generation.current;setLoading(true);
  try{const data=await atlasApi<{playerId:string;studyHistory:StudySummary}>('study');if(n!==generation.current)return;if(data.playerId!==owner)throw new Error('Study calendar owner changed');
   recordedToday.current=data.studyHistory.today;setHistory(data.studyHistory);setMonth(value=>value||monthOf(data.studyHistory.today));setSelected(value=>value||data.studyHistory.today);setError(false);
  }catch{if(n===generation.current)setError(true);}finally{if(n===generation.current)setLoading(false);}
 },[owner]);
 useEffect(()=>{
  let active=true;const lifecycle=generation,todayRef=recordedToday;
  void Promise.resolve().then(()=>{if(active)void load();});
  let timer:ReturnType<typeof setTimeout>|undefined;
  const refresh=()=>{clearTimeout(timer);timer=setTimeout(()=>{if(active)void load();},150);};
  const onVisibility=()=>{if(document.visibilityState==='visible')refresh();};
  window.addEventListener('atlas:study-updated',refresh);window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',onVisibility);
  // Refresh the badge across a Vietnam midnight, even if the page stays open.
  const timerId=setInterval(()=>{if(document.visibilityState==='visible'&&todayRef.current&&new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())!==todayRef.current)refresh();},60000);
  return()=>{active=false;lifecycle.current++;clearTimeout(timer);clearInterval(timerId);window.removeEventListener('atlas:study-updated',refresh);window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',onVisibility);};
 },[load,owner]);
 const language=locale==='vi'?'vi-VN':'en-GB';
 const formatDay=(day:string)=>new Intl.DateTimeFormat(language,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(day+'T12:00:00Z'));
 const monthTitle=month?new Intl.DateTimeFormat(language,{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(month+'-01T12:00:00Z')):'';
 const [year,monthIndex]=(month||'2000-01').split('-').map(Number);
 const count=new Date(Date.UTC(year,monthIndex,0)).getUTCDate(),offset=(new Date(Date.UTC(year,monthIndex-1,1)).getUTCDay()+6)%7;
 const days=new Set(history?.days??[]),activeDay=days.has(selected);
 function open(){dialog.current?.showModal();void load();}
 const streak=error?'—':history?.currentStreak??'—';
 return <>
  <button className="study-streak-trigger" type="button" onClick={open} aria-haspopup="dialog" aria-label={t('Study streak and calendar','Chuỗi ngày học và lịch học')} data-testid="study-streak"><Flame size={18}/><span>{streak}<small>{t('days','ngày')}</small></span></button>
  <dialog ref={dialog} className="study-calendar" aria-labelledby="study-calendar-title" data-testid="study-calendar">
   <header className="study-calendar-heading"><div><span className="study-calendar-eyebrow"><CalendarDays size={15}/>{t('YOUR LEARNING RHYTHM','NHỊP HỌC CỦA BẠN')}</span><h2 id="study-calendar-title">{t('A little, every day.','Mỗi ngày, một chút.')}</h2><p>{t('Your effort has a place on the calendar.','Mỗi lần cố gắng đều có một ngày để ghi nhớ.')}</p></div><button autoFocus type="button" className="study-icon-button" onClick={()=>dialog.current?.close()} aria-label={t('Close calendar','Đóng lịch')}><X size={20}/></button></header>
   {error?<div className="study-calendar-error" role="alert"><p>{t('We could not load your learning calendar. Your saved days have not been changed.','Chưa tải được lịch học. Những ngày đã lưu vẫn được giữ nguyên.')}</p><button type="button" onClick={()=>void load()}>{t('Try again','Thử lại')}</button></div>:!history?<p role="status">{t('Loading your learning days…','Đang tải ngày học…')}</p>:<>
    <div className="study-calendar-stats"><div><Flame size={20}/><strong>{history.currentStreak}<small>{t('day streak','ngày liên tiếp')}</small></strong></div><div><Trophy size={19}/><strong>{history.longestStreak}<small>{t('longest streak','chuỗi dài nhất')}</small></strong></div><div><CalendarDays size={19}/><strong>{history.totalDays}<small>{t('days studied','ngày đã học')}</small></strong></div></div>
    <div className={'study-today-note '+(history.studiedToday?'is-studied':'')} role="status">{history.studiedToday?<><Check size={17}/>{t('Today is on your learning calendar. Well done!','Hôm nay đã có trong lịch học. Bạn đã cố gắng rồi!')}</>:t('One learning activity today keeps your rhythm going.','Một hoạt động học hôm nay giúp bạn giữ nhịp.')}</div>
    <div className="study-month-nav"><button className="study-icon-button" type="button" aria-label={t('Previous month','Tháng trước')} disabled={year<=1970&&monthIndex===1} onClick={()=>setMonth(shiftMonth(month,-1))}><ChevronLeft size={20}/></button><label className="study-month-picker"><span aria-hidden="true">{monthTitle}</span><CalendarDays size={15} aria-hidden="true"/><span className="sr-only">{t('Choose month and year','Chọn tháng và năm')}</span><input type="month" value={month} min="1970-01" max={monthOf(history.today)} onChange={e=>{if(/^\d{4}-\d{2}$/.test(e.target.value)&&e.target.value>='1970-01'&&e.target.value<=monthOf(history.today))setMonth(e.target.value);}} aria-label={t('Choose month and year','Chọn tháng và năm')}/></label><button className="study-icon-button" type="button" aria-label={t('Next month','Tháng sau')} disabled={month>=monthOf(history.today)} onClick={()=>setMonth(shiftMonth(month,1))}><ChevronRight size={20}/></button></div>
    <table className="study-month-grid" aria-label={monthTitle}><caption className="sr-only">{monthTitle}</caption><thead><tr>{(locale==='vi'?['T2','T3','T4','T5','T6','T7','CN']:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']).map(day=><th key={day} scope="col">{day}</th>)}</tr></thead><tbody>{Array.from({length:Math.ceil((offset+count)/7)},(_,week)=><tr key={week}>{Array.from({length:7},(_,weekday)=>{const n=week*7+weekday-offset+1;if(n<1||n>count)return <td key={weekday}/>;const day=month+'-'+String(n).padStart(2,'0'),studied=days.has(day);return <td key={day}><button type="button" className={[studied?'is-studied':'',day===history.today?'is-today':'',selected===day?'is-selected':''].join(' ')} aria-label={formatDay(day)+(studied?t(', studied',', đã học'):t(', no recorded activity',', chưa có hoạt động được ghi nhận'))} aria-pressed={selected===day} aria-current={day===history.today?'date':undefined} disabled={day>history.today} onClick={()=>setSelected(day)} data-study-date={day} data-studied={studied}><span>{n}</span>{studied&&<Check size={11} aria-hidden="true"/>}</button></td>;})}</tr>)}</tbody></table>
    <div className="study-calendar-legend"><span><i/>{t('Studied','Đã học')}</span><button type="button" onClick={()=>{setMonth(monthOf(history.today));setSelected(history.today);}}>{t('Back to today','Về hôm nay')}</button></div>
    <section className="study-date-detail" aria-live="polite"><strong>{selected?formatDay(selected):''}</strong><p>{activeDay?t('Learning activity recorded. This day counts once toward your streak.','Đã ghi nhận hoạt động học. Ngày này được tính một lần vào chuỗi.'):t('No learning activity recorded for this date.','Chưa có hoạt động học được ghi nhận vào ngày này.')}</p></section>
    <footer>{t('A valid learning response or a newly recorded clue marks a study day. Simply signing in does not count. Days follow Vietnam time (UTC+7).','Trả lời bài học hợp lệ hoặc ghi nhận manh mối mới sẽ đánh dấu ngày học. Chỉ đăng nhập chưa được tính. Ngày tính theo giờ Việt Nam (UTC+7).')}<p>{t('Missing a day starts a new streak; your history and longest streak stay saved. Older days appear only where saved learning timestamps exist.','Nghỉ một ngày sẽ bắt đầu chuỗi mới; lịch sử và chuỗi dài nhất vẫn được giữ. Ngày cũ chỉ hiển thị khi có mốc thời gian học đã lưu.')}</p></footer>
   </>}
   <span className="sr-only" role="status">{loading&&history?t('Refreshing calendar','Đang cập nhật lịch'):''}</span>
  </dialog>
 </>;
}
