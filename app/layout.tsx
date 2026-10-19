import type {Metadata} from 'next';
import './globals.css';
import './chapter.css';
import './travel.css';
export const metadata:Metadata={title:'ATLAS — Learn English, Explore the World',description:'Explore the world, meet new people and practise practical English. Begin in the Forest of Origins or travel to Tokyo.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
