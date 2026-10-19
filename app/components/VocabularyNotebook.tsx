'use client';
import {useState} from 'react';
import {BookOpen,Search,ImageIcon} from 'lucide-react';
import type {EnglishLesson,GlossaryEntry} from '../../content/english/chapter';
import {wordDetails} from '../../content/english/word-details';
import {Pronunciation,SaveWordButton} from './SavedVocabulary';
import {Bilingual} from './Bilingual';
function Example({entry}:{entry:GlossaryEntry}){
 const at=entry.example.toLowerCase().indexOf(entry.word.toLowerCase());
 return <p lang="en">{at<0?entry.example:<>{entry.example.slice(0,at)}<mark>{entry.example.slice(at,at+entry.word.length)}</mark>{entry.example.slice(at+entry.word.length)}</>}</p>;
}
export function VocabularyNotebook({lessons,vietnamese:vi}:{lessons:readonly EnglishLesson[];vietnamese:boolean}){
 const [query,setQuery]=useState('');
 const normalized=query.trim().toLocaleLowerCase('vi');
 const groups=lessons.map(lesson=>({lesson,entries:lesson.glossary.filter(entry=>`${entry.word} ${vi?entry.meaning:''}`.toLocaleLowerCase('vi').includes(normalized))})).filter(group=>group.entries.length);
 const count=groups.reduce((sum,group)=>sum+group.entries.length,0);
 return <section className="vocabulary-notebook" aria-labelledby="encountered-words-title">
 <div className="vocabulary-heading"><div><span className="vocabulary-eyebrow"><BookOpen size={16}/>{vi?'YOUR WORD COLLECTION · BỘ TỪ VỰNG':'YOUR WORD COLLECTION'}</span><h2 id="encountered-words-title"><Bilingual text="Words you’ve encountered"/></h2><p>{vi?'Ôn từ qua hình ảnh, phiên âm và câu trong nhiệm vụ.':'Revisit each word through a visual, its pronunciation and a mission example.'}</p></div><label className="vocabulary-search"><Search size={18}/><span className="sr-only">{vi?'Tìm từ tiếng Anh hoặc nghĩa tiếng Việt':'Search encountered words'}</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={vi?'Tìm từ hoặc nghĩa…':'Find a word…'}/></label></div>
 <p className="vocabulary-result-count" role="status">{count} {vi?'từ trong sổ tay':'words in your notebook'}</p>
 {!count&&<p className="vocabulary-empty">{lessons.length?(vi?'Chưa tìm thấy từ phù hợp. Thử một từ khác.':'No matching words. Try another search.'):(vi?'Luyện một field note để mở bộ từ vựng của nhiệm vụ.':'Practise a field note to discover its word collection.')}</p>}
 {groups.map(({lesson,entries})=><section className="vocabulary-group" key={lesson.id} aria-label={lesson.title}><h3><Bilingual text={lesson.title}/><span>{entries.length} {vi?'từ':'words'}</span></h3><div className="vocabulary-card-grid">{entries.map(entry=>{const detail=wordDetails[entry.word];return <article className="vocabulary-study-card" key={entry.word}>
 {detail&&<figure><img src={detail.image} srcSet={detail.scene?`${detail.image} 480w, ${detail.image.replace("-480.webp","-960.webp")} 960w`:undefined} sizes={detail.scene?"(max-width: 650px) calc(100vw - 64px), (min-width: 1500px) 400px, 540px":undefined} alt={detail.alt} loading="lazy" decoding="async" width={360} height={180} style={{objectPosition:detail.position}}/><figcaption><ImageIcon size={12}/>{detail.scene?(vi?'Tranh bối cảnh ATLAS':'ATLAS scene artwork'):(vi?'Minh họa khái niệm':'Concept illustration')}</figcaption></figure>}
 <div className="vocabulary-card-body"><div className="vocabulary-word-heading"><h4 lang="en">{entry.word}</h4>{detail&&<span lang="en">{detail.partOfSpeech}</span>}</div><Pronunciation word={entry.word}/>{vi&&<p className="vocabulary-meaning" lang="vi">{entry.meaning}</p>}{detail&&<p className="vocabulary-definition" lang="en">{detail.definition}</p>}
 <div className="vocabulary-example"><span>{vi?'IN CONTEXT · VÍ DỤ':'IN CONTEXT'}</span><Example entry={entry}/>{vi&&<details><summary lang="vi">Xem nghĩa câu & giải thích</summary><p lang="vi">{entry.exampleVi}</p><p lang="vi">{entry.explanation}</p></details>}</div>
 {detail&&<p className="vocabulary-chunk"><span>{vi?'Cụm nên nhớ':'Useful chunk'}</span><strong lang="en">{detail.chunk}</strong></p>}
 <SaveWordButton lessonId={lesson.id} version={lesson.version} word={entry.word}/></div></article>;})}</div></section>)}
 <details className="vocabulary-credits"><summary>{vi?'Nguồn phiên âm & hình minh họa':'Pronunciation & visual credits'}</summary><p>{vi?'IPA US/UK: Cambridge Dictionary; mở “IPA source” ở từng thẻ để đối chiếu và nghe bản thu tại nguồn. Côn trùng dùng dạng số nhiều của insect.':'US/UK IPA: Cambridge Dictionary. Open each card’s IPA source to check the transcription and hear the source recording. Insects uses the plural form of insect.'}</p><p>{vi?'Tranh rừng và hồ do chủ dự án cung cấp; minh họa khái niệm được vẽ riêng cho ATLAS. Đây là học liệu minh họa, không phải ảnh hay số đo thực địa.':'Forest and lake artwork supplied by the project owner; concept diagrams created for ATLAS. These learning visuals are not field photographs or real-world measurements.'}</p><p>{vi?'Câu ví dụ và giải nghĩa tiếng Việt giữ nguyên học liệu hiện có, đang chờ giáo viên thẩm định.':'Examples and Vietnamese explanations retain the existing lesson content, pending educator review.'}</p></details>
 </section>;
}
