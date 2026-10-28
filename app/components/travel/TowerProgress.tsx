'use client';

import {useState} from 'react';
import {Check, ChevronDown, Crown, Flag, Footprints, Lock, Map, Ticket, MessageCircle, TriangleAlert} from 'lucide-react';
import type {TowerPresentation} from '../../../content/tower/types';
import {useInterfaceLanguage} from '../Bilingual';

type FloorStatus = 'complete' | 'current' | 'locked' | 'failed';
type Props = {run: TowerPresentation | undefined; personalBest: number};
const icons = [Footprints, Ticket, MessageCircle, Flag, Crown];

/** Presentation derives only from the current run, never from the personal best. */
export function TowerProgress({run, personalBest}: Props) {
  const {t} = useInterfaceLanguage();
  const [expanded, setExpanded] = useState(run?.status === 'NOT_STARTED');
  const cleared = run?.clearedFloors ?? 0;
  const status = run?.status ?? 'NOT_STARTED';
  const floor = Math.min(cleared + 1, 5);
  const floorState = (n: number): FloorStatus => n <= cleared ? 'complete' : n === floor && status === 'FAILED' ? 'failed' : n === floor && (status === 'IN_PROGRESS' || status === 'NOT_STARTED') ? 'current' : 'locked';
  const floorName = (n: number) => n === 5 ? t('Boss · Final gate', 'Boss · Cổng cuối') : t(`Floor ${n}`, `Tầng ${n}`);
  const stateName = (s: FloorStatus) => s === 'complete' ? t('Cleared', 'Đã vượt') : s === 'current' ? t('Current', 'Hiện tại') : s === 'failed' ? t('Run ended', 'Lượt kết thúc') : t('Locked', 'Chưa mở');
  const currentLabel = status === 'COMPLETED' ? t('Tower cleared', 'Đã vượt tháp') : status === 'FAILED' ? t(`Run ended · Floor ${floor}`, `Lượt kết thúc · Tầng ${floor}`) : floor === 5 ? t('Floor 5 / 5 · Boss gate', 'Tầng 5 / 5 · Cổng Boss') : t(`Floor ${floor} / 5`, `Tầng ${floor} / 5`);

  return <section className="tower-progress" aria-label={t('Tower progress', 'Tiến độ tháp')} data-testid="tower-progress">
    <div className="tower-progress-heading"><div><span className="tower-progress-eyebrow">{t('YOUR CLIMB', 'HÀNH TRÌNH')}</span><strong>{currentLabel}</strong></div><div className="tower-progress-best" data-testid="tower-best"><span>{t('Personal best', 'Thành tích tốt nhất')}</span><strong>{personalBest}<small> / 5</small></strong></div></div>
    <ol className="tower-tracker" aria-label={t('Current run floors', 'Các tầng của lượt hiện tại')}>
      {[1,2,3,4,5].map(n => {const s = floorState(n); const Icon = n === 5 ? Crown : s === 'complete' ? Check : s === 'locked' ? Lock : s === 'failed' ? TriangleAlert : icons[n-1]; return <li key={n} className={`tower-tracker-step is-${s} ${n===5?'is-boss':''}`} aria-label={`${floorName(n)}: ${stateName(s)}`} aria-current={s==='current'?'step':undefined} data-testid={`tower-floor-${n}`} data-state={s}><span className="tower-tracker-icon"><Icon size={16} aria-hidden="true"/></span><span className="tower-tracker-label">{n===5?t('Boss','Boss'):n}</span></li>;})}
    </ol>
    <button type="button" className="tower-map-toggle" aria-expanded={expanded} aria-controls="tower-map-overview" data-testid="tower-map-toggle" onClick={()=>setExpanded(value=>!value)}><Map size={17} aria-hidden="true"/>{expanded?t('Hide tower map','Ẩn bản đồ tháp'):t('View tower map','Xem bản đồ tháp')}<ChevronDown size={17} className={expanded?'is-open':''} aria-hidden="true"/></button>
    {expanded&&<div className="tower-map" id="tower-map-overview" data-testid="tower-map-overview"><div className="tower-map-heading"><div><span>{t('NARITA · AIRPORT SURVIVAL','NARITA · SÂN BAY')}</span><h2>{t('The climb ahead','Hành trình lên tháp')}</h2></div><Crown size={24} aria-hidden="true"/></div><p>{t('Five challenges, one step at a time.','Năm thử thách, từng bước một.')}</p><ol className="tower-map-path" aria-label={t('Tower overview from boss to floor 1','Bản đồ tháp từ Boss đến tầng 1')}>
      {[5,4,3,2,1].map(n=>{const s=floorState(n);const Icon=n===5?Crown:icons[n-1];return <li key={n} className={`tower-map-floor is-${s} ${n===5?'is-boss':''}`} aria-label={`${floorName(n)}: ${stateName(s)}`}><span className="tower-map-badge"><Icon size={19} aria-hidden="true"/>{s==='complete'&&<Check className="tower-map-status-icon" size={13} aria-hidden="true"/>}{s==='locked'&&<Lock className="tower-map-status-icon" size={12} aria-hidden="true"/>}{s==='failed'&&<TriangleAlert className="tower-map-status-icon" size={12} aria-hidden="true"/>}</span><span className="tower-map-floor-copy"><strong>{floorName(n)}</strong><small>{stateName(s)}</small></span>{s==='complete'&&<span className="tower-map-stamp" aria-hidden="true">{t('CLEARED','ĐÃ VƯỢT')}</span>}</li>})}
    </ol></div>}
  </section>;
}
