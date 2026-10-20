 'use client';
import type {Copy} from '../../../content/travel/types';
import {useInterfaceLanguage} from '../Bilingual';
export function TravelCopy({text,vi,learning=false}:{text:Copy;vi:boolean;learning?:boolean}){const {locale,t}=useInterfaceLanguage();return learning?<span className="travel-copy"><span lang="en">{text.en}</span>{vi&&<small lang="vi">{text.vi}</small>}</span>:<span className="travel-copy" lang={locale}>{t(text.en,text.vi)}</span>;}
