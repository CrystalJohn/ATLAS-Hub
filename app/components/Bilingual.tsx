'use client';
import {createContext,useContext} from 'react';
import {translateVietnamese} from '../../content/localization/vi';

export const VietnameseSupport=createContext(false);

/** Presentation assistance only. Never changes an answer id, evaluation or reward. */
export function Bilingual({text}:{text:string}){
 const enabled=useContext(VietnameseSupport);
 const translation=enabled?translateVietnamese(text):undefined;
 return <span className="bilingual-text"><span lang="en">{text}</span>{translation&&<span className="translation-copy" lang="vi">{translation}</span>}</span>;
}
