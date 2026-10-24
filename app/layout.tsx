import type {Metadata} from 'next';
import {InterfaceLanguageProvider} from './components/Bilingual';
import './globals.css';
import './chapter.css';
import './travel.css';
import './auth.css';
import './account.css';
import './welcome.css';
export const metadata:Metadata={title:'ATLAS — Learn English, Explore the World',description:'Explore the world, meet new people and practise practical English. Begin in the Forest of Origins or travel to Tokyo.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><InterfaceLanguageProvider>{children}</InterfaceLanguageProvider></body></html>;}
