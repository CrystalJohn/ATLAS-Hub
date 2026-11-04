'use client';
import {BookOpen,Globe2,HelpCircle,Map,MapPin,Stamp,TreePine} from 'lucide-react';
import type {MouseEvent} from 'react';
import {atlasHref,goAtlas,type AtlasLocation,type AtlasSection} from './atlas-navigation';
import {useInterfaceLanguage} from './Bilingual';
export function NavigationLink({location,children,active=false,busy=false,className='',label}:{location:AtlasLocation;children:React.ReactNode;active?:boolean;busy?:boolean;className?:string;label?:string}){
 function click(event:MouseEvent<HTMLAnchorElement>){if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;event.preventDefault();if(!busy)goAtlas(location)}
 return <a href={atlasHref(location)} onClick={click} className={className} aria-label={label} aria-current={active?'page':undefined} aria-disabled={busy||undefined}>{children}</a>;
}
export function NavigationUtilities({location,busy}:{location:AtlasLocation;busy:boolean}){const {t}=useInterfaceLanguage();return <nav className="nav-v2-utilities" aria-label={t('Player utilities','Tiện ích người chơi')}><NavigationLink location={{world:location.world,section:'journal'}} active={location.section==='journal'} busy={busy}><BookOpen size={18}/><span>{t('My Journal','Sổ tay')}</span></NavigationLink><NavigationLink location={{world:location.world,section:'help'}} active={location.section==='help'} busy={busy}><HelpCircle size={18}/><span>{t('How to Play','Cách chơi')}</span></NavigationLink></nav>}
export function WorldNavigation({location,busy}:{location:AtlasLocation;busy:boolean}){
 const {t}=useInterfaceLanguage();
 const travel=location.world==='travel';
 const section=travel&&['country','encounter','tower'].includes(location.section)?'journey':!travel&&['mission','summary'].includes(location.section)?'journey':location.section;
 const items:{section:AtlasSection;en:string;vi:string;Icon:typeof Map}[]=travel?[{section:'map',en:'World Map',vi:'Bản đồ thế giới',Icon:Globe2},{section:'journey',en:'My Journey',vi:'Chuyến đi của tôi',Icon:MapPin},{section:'passport',en:'Passport',vi:'Hộ chiếu',Icon:Stamp}]:[{section:'map',en:'Realm Map',vi:'Bản đồ thiên nhiên',Icon:Map},{section:'journey',en:'My Journey',vi:'Chuyến đi của tôi',Icon:MapPin},{section:'field-journal',en:'Field Journal',vi:'Nhật ký thực địa',Icon:BookOpen}];
 return <div className={`nav-v2-context world-${location.world}`}><nav className="nav-v2-worlds" aria-label={t('Choose your world','Chọn thế giới')}><NavigationLink location={{world:'travel',section:'map'}} active={travel} busy={busy}><Globe2 size={18}/><span>{t('World Travel','Du lịch thế giới')}</span></NavigationLink><NavigationLink location={{world:'nature',section:'map'}} active={!travel} busy={busy}><TreePine size={18}/><span>{t('Nature Realm','Thế giới tự nhiên')}</span></NavigationLink></nav><nav className="nav-v2-sections" aria-label={travel?t('World Travel navigation','Điều hướng Du lịch thế giới'):t('Nature Realm navigation','Điều hướng Thế giới tự nhiên')}>{items.map(({section:target,en,vi,Icon})=><NavigationLink key={target} location={{world:location.world,section:target}} active={section===target} busy={busy}><Icon size={17}/><span>{t(en,vi)}</span></NavigationLink>)}</nav></div>;
}
