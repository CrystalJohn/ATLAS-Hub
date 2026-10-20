import Game from "./components/Game";
export const dynamic = "force-dynamic";
export default function Page(){return <Game authProvider={process.env.VERCEL==='1'?'google':'chatgpt'}/>;}
