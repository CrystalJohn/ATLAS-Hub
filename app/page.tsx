import Game from "./components/Game";
export const dynamic = "force-dynamic";
export default function Page(){return <><div className="pilot-banner">PRIVATE REVIEW · Bilingual content is a draft awaiting educator review.</div><Game authProvider={process.env.VERCEL==='1'?'google':'chatgpt'}/></>;}
