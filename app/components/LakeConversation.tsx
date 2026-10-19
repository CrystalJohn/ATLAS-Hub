'use client';
import {useState} from 'react';
import type {ReadingBand} from '../../content/english/chapter';
import {EvidenceCopy} from './EvidencePanel';
import {lakeExchanges as exchanges} from '../../content/learning/lake-conversation';
const c=(en:string,vi:string)=>({en,vi});
/** Optional reading interaction. No listening/speaking assessment or reward writes. */
export function LakeConversation({band,vietnamese}:{band:ReadingBand;vietnamese:boolean}){
 const [selected,setSelected]=useState<number|null>(null);
 return <section className="lake-conversation" aria-labelledby="lake-chat-title"><h2 id="lake-chat-title"><EvidenceCopy text={c('Ask Elara','Hỏi Elara')} vietnamese={vietnamese}/></h2><p><EvidenceCopy text={c('Choose a question. Read her reply.','Chọn câu hỏi rồi đọc câu trả lời.')} vietnamese={vietnamese}/></p><div className="lake-chat-questions">{exchanges.map((item,i)=><button type="button" key={item.question.en} aria-pressed={selected===i} aria-controls="lake-chat-reply" onClick={()=>setSelected(i)}><EvidenceCopy text={item.question} vietnamese={vietnamese}/></button>)}</div><div id="lake-chat-reply" aria-live="polite">{selected!==null&&<blockquote><strong>Elara</strong><p><EvidenceCopy text={c(exchanges[selected].reply[band],exchanges[selected].vi)} vietnamese={vietnamese}/></p></blockquote>}</div><details className="lake-useful-english" open={band==='A1'||band==='A2'}><summary><EvidenceCopy text={c('4 useful expressions for this walk','4 cách nói hữu ích trong chuyến đi')} vietnamese={vietnamese}/></summary><ul>{[c('What is different?','Có gì khác nhau?'),c('warmer than …','ấm hơn …'),c('less … than …','ít … hơn …'),c('How do you know?','Làm sao bạn biết?')].map(item=><li key={item.en}><EvidenceCopy text={item} vietnamese={vietnamese}/></li>)}</ul></details></section>;
}
