'use client';
import {createContext,useContext,useEffect,useSyncExternalStore,type ReactNode} from 'react';
import {Languages} from 'lucide-react';
import {translateVietnamese} from '../../content/localization/vi';

export const VietnameseSupport=createContext(false);
export type InterfaceLocale='en'|'vi';
const languageKey='atlas-interface-language-v1';
let fallbackLocale:InterfaceLocale='en';
const subscribe=(notify:()=>void)=>{window.addEventListener('storage',notify);window.addEventListener('atlas:interface-language',notify);return()=>{window.removeEventListener('storage',notify);window.removeEventListener('atlas:interface-language',notify);};};
const snapshot=():InterfaceLocale=>{try{const saved=window.localStorage.getItem(languageKey);return saved==='vi'?'vi':saved==='en'?'en':fallbackLocale;}catch{return fallbackLocale;}};
const serverSnapshot=():InterfaceLocale=>'en';
const changeLanguage=(locale:InterfaceLocale)=>{fallbackLocale=locale;try{window.localStorage.setItem(languageKey,locale);}catch{/* The current page still supports switching. */}window.dispatchEvent(new Event('atlas:interface-language'));};
export const InterfaceLanguage=createContext({locale:'en' as InterfaceLocale,setLocale:changeLanguage});
export function InterfaceLanguageProvider({children}:{children:ReactNode}){
 const locale=useSyncExternalStore(subscribe,snapshot,serverSnapshot);
 useEffect(()=>{document.documentElement.lang=locale;},[locale]);
 return <InterfaceLanguage value={{locale,setLocale:changeLanguage}}>{children}</InterfaceLanguage>;
}
export function useInterfaceLanguage(){const {locale,setLocale}=useContext(InterfaceLanguage);return {locale,setLocale,t:(en:string,vi?:string)=>locale==='vi'?(vi??translateVietnamese(en)??en):en};}
export function LanguageToggle(){const {locale,setLocale,t}=useInterfaceLanguage();return <button type="button" className="interface-language-toggle" aria-label={t('Switch interface to Vietnamese','Chuyển giao diện sang tiếng Anh')} title={t('Switch interface to Vietnamese','Chuyển giao diện sang tiếng Anh')} onClick={()=>setLocale(locale==='en'?'vi':'en')}><Languages size={17}/><span lang={locale==='en'?'vi':'en'}>{locale==='en'?'VI':'EN'}</span></button>;}
export function UiText({en,vi}:{en:string;vi:string}){const {locale,t}=useInterfaceLanguage();return <span lang={locale}>{t(en,vi)}</span>;}

/** Presentation assistance only. Never changes an answer id, evaluation or reward. */
export function Bilingual({text,learning=false}:{text:string;learning?:boolean}){
 const enabled=useContext(VietnameseSupport);
 const {locale}=useInterfaceLanguage();
 const translation=translateVietnamese(text);
 if(learning)return <span className="bilingual-text"><span lang="en">{text}</span>{enabled&&translation&&<span className="translation-copy" lang="vi">{translation}</span>}</span>;
 return <span className="bilingual-text" lang={locale==='vi'&&translation?'vi':'en'}>{locale==='vi'&&translation?translation:text}</span>;
}
