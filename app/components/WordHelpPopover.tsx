'use client';
import {BookOpen,X} from 'lucide-react';
import {Popover} from '@base-ui/react/popover';
import {Bilingual} from './Bilingual';
import type {GlossaryEntry} from '../../content/english/chapter';
import {Pronunciation,SaveWordButton} from './SavedVocabulary';

/** Contextual assistance only. Detached triggers share one accessible popup. */
export function WordHelpPopover({handle,vietnamese,lessonId,version}:{handle:Popover.Handle<GlossaryEntry>;vietnamese:boolean;lessonId:string;version:1}){
 return <Popover.Root handle={handle} modal={false}>{({payload:entry})=><Popover.Portal>
 <Popover.Positioner className="word-help-positioner" side="top" sideOffset={12} collisionPadding={12} arrowPadding={22} positionMethod="fixed" collisionAvoidance={{side:'flip',align:'shift'}}>
 <Popover.Popup className="word-help-popover" initialFocus={true}>
 <Popover.Arrow className="word-help-arrow"><svg width="22" height="12" viewBox="0 0 22 12" aria-hidden="true"><path d="M0 0H22L12.5 10.5Q11 12 9.5 10.5Z"/></svg></Popover.Arrow>
 {entry&&<div className="word-help-body"><div className="word-help-topline"><span><BookOpen size={15} aria-hidden="true"/><Bilingual text="Word help"/></span><Popover.Close className="word-help-close" aria-label={vietnamese?'Đóng phần giải nghĩa':'Close word help'}><X size={20}/></Popover.Close></div>
 <Popover.Title className="word-help-title" lang="en">{entry.word}</Popover.Title>
 <Pronunciation word={entry.word}/>
 {vietnamese&&<><p className="word-help-meaning" lang="vi">{entry.meaning}</p><p className="word-help-explanation" lang="vi">{entry.explanation}</p></>}
 <SaveWordButton lessonId={lessonId} version={version} word={entry.word}/>
 <div className="word-help-example"><p lang="en"><em>{entry.example}</em></p>{vietnamese&&<p lang="vi">{entry.exampleVi}</p>}</div>
 </div>}
 </Popover.Popup></Popover.Positioner></Popover.Portal>}</Popover.Root>;
}
