'use client';
import {ArrowRight,Plane,TreePine} from 'lucide-react';
import {explorationInterests,type ExplorationInterest} from '../../content/interests';
import {suggestionsFor} from '../../lib/atlas/recommendations';
import type {AtlasState} from './chapter-types';
import type {MissionId} from '../../packages/domain/src/index';
import {Bilingual,useInterfaceLanguage} from './Bilingual';

export function InterestSuggestions({interests,state,busy,onNature,onTravel}:{interests:readonly ExplorationInterest[];state:AtlasState;busy:boolean;onNature:(id:MissionId)=>void;onTravel:()=>void}){
 const {t}=useInterfaceLanguage(),suggestions=suggestionsFor(interests,state);
 if(!suggestions.length)return null;
 return <section className="interest-suggestions" aria-labelledby="interest-suggestions-title"><header><h2 id="interest-suggestions-title">{t('Picked for your interests','Gợi ý theo sở thích của bạn')}</h2><p>{t('Explore your interests, at your own pace.','Khám phá theo sở thích, tiếp tục theo nhịp của bạn.')}</p></header><div className="interest-suggestion-grid">{suggestions.map(item=><article key={item.kind}><span className="suggestion-icon" aria-hidden="true">{item.kind==='nature'?<TreePine size={24}/>:<Plane size={24}/>}</span><div><p className="suggestion-topics">{item.matches.map(id=>{const label=explorationInterests.find(i=>i.id===id)!;return t(label.en,label.vi);}).join(' · ')}</p><h3>{item.kind==='nature'?<Bilingual text={item.title}/>:t(item.title.en,item.title.vi)}</h3><p>{item.kind==='nature'?t(item.review?'Revisit an open trail.':'Your next open nature mission.',item.review?'Ghé lại một chặng đã mở.':'Nhiệm vụ thiên nhiên tiếp theo đang mở.'):item.laterInterest?t('Follow the open route to reach your favourite topics.','Đi theo hành trình đang mở để tới các chủ đề bạn thích.'):`${t('Open stop','Điểm đang mở')}: ${t(item.stop.en,item.stop.vi)}`}</p><button type="button" className="quiet-button" disabled={busy} onClick={()=>item.kind==='nature'?onNature(item.missionId as MissionId):onTravel()}>{item.kind==='nature'?t(item.review?'Revisit mission':'Explore mission',item.review?'Xem lại nhiệm vụ':'Khám phá nhiệm vụ'):t('Open travel map','Mở bản đồ du lịch')}<ArrowRight size={16}/></button></div></article>)}</div></section>;
}
