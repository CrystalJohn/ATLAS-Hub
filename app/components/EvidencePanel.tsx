'use client';
import {useId} from 'react';
import lakeAdvanced from '../../content/learning/lake-advanced.json' with {type:'json'};
import {BookOpen,ExternalLink,FlaskConical,ShieldCheck} from 'lucide-react';
import type {EvidenceClass,EvidenceCitation,LearningCopy,MissionEvidence,VisualEvidence} from '../../content/evidence/types';
import type {ReadingBand} from '../../content/english/chapter';
export function EvidenceCopy({text,vietnamese}:{text:LearningCopy;vietnamese:boolean}){
 return <span className="evidence-copy"><span lang="en">{text.en}</span>{vietnamese&&<span lang="vi">{text.vi}</span>}</span>;
}
const label=(en:string,vi:string):LearningCopy=>({en,vi});
export const evidenceClassLabels:Record<EvidenceClass,LearningCopy>={
 'verified-fact':label('Verified scientific fact','Kiến thức khoa học có nguồn'),
 'real-measurement':label('Real-world measurement','Số đo thực tế'),
 'fictional-scenario':label('Fictional scenario','Tình huống hư cấu'),
 'simulated-data':label('Simulated game data','Dữ liệu trò chơi giả lập'),
 'unconfirmed-hypothesis':label('Not confirmed yet','Chưa được xác nhận'),
 'case-inference':label('Conclusion within this fictional case','Kết luận trong tình huống hư cấu này'),
};
export function EvidenceTag({kind,vietnamese}:{kind:EvidenceClass;vietnamese:boolean}){return <span className={`evidence-tag evidence-${kind}`}><EvidenceCopy text={evidenceClassLabels[kind]} vietnamese={vietnamese}/></span>;}
function Citations({citations,evidence,vietnamese}:{citations:EvidenceCitation[];evidence:MissionEvidence;vietnamese:boolean}){
 return <ul className="claim-citations">{citations.map((c,i)=>{const s=evidence.sources.find(s=>s.id===c.sourceId);return s?<li key={`${c.sourceId}-${i}`}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.organization} · {s.title} <ExternalLink size={12}/></a><small>{c.locator}</small>{c.relationship==='background-only'&&<small><EvidenceCopy text={label('Method/background only; this source did not measure or confirm the game event.','Chỉ hỗ trợ phương pháp/kiến thức nền; nguồn này không đo hay xác nhận sự kiện trong trò chơi.')} vietnamese={vietnamese}/></small>}</li>:null;})}</ul>;
}
export function EvidenceFigure({visual,evidence,vietnamese}:{visual:VisualEvidence;evidence:MissionEvidence;vietnamese:boolean}){
 return <figure className="evidence-figure" data-visual-id={visual.id}>
 {/* SVG contains no externally loaded media; bilingual alt text and an HTML table accompany quantitative charts. */}
 <img src={visual.src} width={720} height={visual.id==='lake-comparison'?460:visual.id==='oxygen-concept'?340:300} alt={vietnamese?`${visual.alt.en} ${visual.alt.vi}`:visual.alt.en} loading="lazy"/>
 <figcaption><EvidenceCopy text={visual.caption} vietnamese={vietnamese}/><details className="visual-credit"><summary><EvidenceCopy text={label('Visual credit & scientific references','Tác giả hình và nguồn khoa học')} vietnamese={vietnamese}/></summary><p>{visual.attribution.creator} · <a href={visual.attribution.licenseUrl} target="_blank" rel="noopener noreferrer">{visual.attribution.license}</a> · <a href={visual.attribution.sourceUrl} target="_blank" rel="noopener noreferrer"><EvidenceCopy text={label('Original local SVG','Tệp SVG gốc của dự án')} vietnamese={vietnamese}/></a></p><p>{visual.attribution.modifications}</p><Citations citations={visual.citations} evidence={evidence} vietnamese={vietnamese}/></details></figcaption>
 </figure>;
}
/** Reusable presentation. Reveal status comes from the caller's server result;
 * this component does not evaluate answers, issue rewards or assign proficiency. */
export function EvidencePanel({evidence,band,vietnamese,revealExplanation=false,measurementsReady=false}:{evidence:MissionEvidence;band:ReadingBand;vietnamese:boolean;revealExplanation?:boolean;measurementsReady?:boolean}){
 const id=useId();
 const visible=evidence.claims.filter(c=>revealExplanation||(c.reveal==='inspection'&&(c.classification!=='simulated-data'||measurementsReady)));
 return <aside className="evidence-panel" aria-labelledby={`${id}-title`} data-evidence-mission={evidence.missionId}>
 <details className="lake-learn-more"><summary><EvidenceCopy text={label('Learn More · the science & sources (optional)','Tìm hiểu thêm · khoa học và nguồn (không bắt buộc)')} vietnamese={vietnamese}/></summary>
 <div className="evidence-panel-heading"><ShieldCheck size={23}/><div><p className="overline">EVIDENCE NOTEBOOK</p><h2 id={`${id}-title`}><EvidenceCopy text={label('What do we actually know?','Chúng ta thực sự biết gì?')} vietnamese={vietnamese}/></h2></div></div>
 <div className="evidence-notice"><FlaskConical size={20}/><div><EvidenceTag kind="fictional-scenario" vietnamese={vietnamese}/><p><EvidenceCopy text={label('Every site, instrument reading and fish response in this mission is fictional. No real-world measurements are used. The scientific concepts below have separate references.','Mọi địa điểm, số đo và phản ứng của cá trong nhiệm vụ này đều là hư cấu. Không sử dụng số đo thực tế. Các khái niệm khoa học có nguồn tham khảo riêng bên dưới.')} vietnamese={vietnamese}/></p></div></div>
 <section className="evidence-claims" aria-label={vietnamese?'Phân loại bằng chứng':'Evidence classifications'}>{visible.map(c=><article key={c.id} data-claim-id={c.id}><EvidenceTag kind={c.classification} vietnamese={vietnamese}/><p><EvidenceCopy text={c.explanation[band]} vietnamese={vietnamese}/></p>{c.provenance&&<details><summary><EvidenceCopy text={label('Origin & limits','Nguồn gốc và giới hạn')} vietnamese={vietnamese}/></summary><p>{c.provenance.origin}</p><p>{c.provenance.method}</p><p>{c.provenance.limitations}</p></details>}<Citations citations={c.citations} evidence={evidence} vietnamese={vietnamese}/></article>)}</section>
 {revealExplanation?<section className="evidence-explanation" aria-label="Visual scientific explanation"><h3><EvidenceCopy text={label('Why this connection is plausible','Vì sao mối liên hệ này hợp lý')} vietnamese={vietnamese}/></h3>{evidence.visuals.filter(v=>v.reveal==='after-attempt').map(v=><EvidenceFigure key={v.id} visual={v} evidence={evidence} vietnamese={vietnamese}/>)}</section>:<p className="evidence-reveal-note"><EvidenceCopy text={label('Inspect, compare and submit your own conclusion first. The scientific explanation opens after a fieldwork attempt; the supporting sources are available now.','Hãy quan sát, so sánh rồi gửi kết luận của bạn trước. Phần giải thích khoa học mở sau một lần nộp nhiệm vụ; bạn có thể đọc nguồn ngay bây giờ.')} vietnamese={vietnamese}/></p>}
 <section className="evidence-vocabulary"><h3><BookOpen size={18}/> <EvidenceCopy text={label('Words for this investigation','Từ vựng cho cuộc điều tra')} vietnamese={vietnamese}/></h3>{evidence.vocabulary.map(v=><details key={v.word}><summary lang="en">{v.word}</summary><p><EvidenceCopy text={v.meaning} vietnamese={vietnamese}/></p><p><em><EvidenceCopy text={v.example} vietnamese={vietnamese}/></em></p><Citations citations={evidence.claims.filter(c=>v.claimIds.includes(c.id)).flatMap(c=>c.citations)} evidence={evidence} vietnamese={vietnamese}/></details>)}</section>
 <details className="evidence-sources"><summary><EvidenceCopy text={label('Open the source library · USGS & EPA','Mở thư viện nguồn · USGS và EPA')} vietnamese={vietnamese}/></summary><p><EvidenceCopy text={label('Links open the original pages in a new tab. These sources support general science and methods, not the fictional values.','Liên kết mở trang gốc trong tab mới. Nguồn hỗ trợ khoa học và phương pháp chung, không xác nhận số liệu hư cấu.')} vietnamese={vietnamese}/></p>{evidence.sources.map(s=><article key={s.id}><strong>{s.organization}</strong><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title} <ExternalLink size={14}/></a><span className="source-url">{s.url}</span><dl><dt><EvidenceCopy text={label('Publication date','Ngày xuất bản')} vietnamese={vietnamese}/></dt><dd>{s.publishedAt??(vietnamese?'Không nêu ngày xuất bản gốc':'Original date not stated')}</dd>{s.updatedAt&&<><dt><EvidenceCopy text={label('Page updated','Trang cập nhật')} vietnamese={vietnamese}/></dt><dd>{s.updatedAt}</dd></>}<dt><EvidenceCopy text={label('Last verified','Kiểm tra nguồn gần nhất')} vietnamese={vietnamese}/></dt><dd>{s.lastVerifiedAt}</dd></dl><p>{s.dateNote}</p><p>{s.verificationNote}</p></article>)}</details>
 <details className="lake-original-notes"><summary><EvidenceCopy text={label('Original technical field notes','Ghi chú chuyên sâu gốc')} vietnamese={vietnamese}/></summary><p>{lakeAdvanced.mission.narrative}</p>{lakeAdvanced.mission.challenge.observations.map(o=><p key={o.id}><strong>{o.title}: </strong>{o.detail}</p>)}<p>{lakeAdvanced.variants[band].passage}</p>{vietnamese&&<p lang="vi">{lakeAdvanced.variants[band].vi}</p>}</details></details>
 </aside>;
}
