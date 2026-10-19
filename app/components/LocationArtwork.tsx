'use client';
import {useId,useRef} from 'react';
import {Maximize2,X} from 'lucide-react';
import {EvidenceCopy} from './EvidencePanel';
import type {EnvironmentArtwork} from '../../content/artwork/nature-realm';
import type {LearningCopy} from '../../content/evidence/types';
/** Artwork is scene context; opening it never inspects evidence or calls an API. */
export function LocationArtwork({artwork,name,vietnamese}:{artwork:EnvironmentArtwork;name:LearningCopy;vietnamese:boolean}){
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null),id=useId();
 const expand=vietnamese?`Xem toàn cảnh: ${name.vi}`:`Expand scene: ${name.en}`;
 const close=()=>dialog.current?.close();
 return <figure className="location-artwork" data-artwork-site={artwork.siteId}>
 <button ref={trigger} className="location-artwork-trigger" type="button" aria-label={expand} aria-haspopup="dialog" aria-controls={id} onClick={()=>dialog.current?.showModal()}>
 <picture><source type="image/webp" srcSet={artwork.webpSrcSet} sizes="(max-width: 600px) calc(100vw - 106px), 300px"/><img src={artwork.src} alt={vietnamese?`${artwork.alt.en} ${artwork.alt.vi}`:artwork.alt.en} width={artwork.width} height={artwork.height} style={{objectPosition:artwork.focalPoint}} loading="lazy" decoding="async"/></picture>
 <span className="location-expand-icon" aria-hidden="true"><Maximize2 size={19}/></span>
 </button>
 <figcaption><span className="scene-art-label"><EvidenceCopy text={{en:'FOREST OF ORIGINS · SCENE ART',vi:'KHU RỪNG KHỞI NGUYÊN · TRANH BỐI CẢNH'}} vietnamese={vietnamese}/></span><details className="location-artwork-credit"><summary><EvidenceCopy text={{en:'About this artwork',vi:'Về tranh bối cảnh này'}} vietnamese={vietnamese}/></summary><p><EvidenceCopy text={artwork.origin} vietnamese={vietnamese}/></p><p><EvidenceCopy text={artwork.usage} vietnamese={vietnamese}/></p></details></figcaption>
 <dialog ref={dialog} id={id} className="location-art-dialog" aria-labelledby={`${id}-title`} aria-describedby={`${id}-caption`} onClose={()=>trigger.current?.focus({preventScroll:true})} onClick={e=>{if(e.target===e.currentTarget)close();}}>
 <div className="location-dialog-content"><header><h2 id={`${id}-title`}><EvidenceCopy text={name} vietnamese={vietnamese}/></h2><button type="button" autoFocus className="location-dialog-close" onClick={close} aria-label={vietnamese?'Đóng ảnh toàn cảnh':'Close full scene'}><X size={22}/></button></header><picture><source type="image/webp" srcSet={artwork.fullWebp}/><img src={artwork.src} width={artwork.width} height={artwork.height} alt={vietnamese?artwork.alt.vi:artwork.alt.en} decoding="async" loading="lazy"/></picture><p id={`${id}-caption`}><EvidenceCopy text={artwork.usage} vietnamese={vietnamese}/></p></div>
 </dialog>
 </figure>;
}
