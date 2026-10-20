import {fileURLToPath} from 'node:url';
// Use the existing Supabase route adapter with native Next locally.
// Next loads .env.local; this does not provide or bypass authentication.
process.env.VERCEL='1';
const cli=new URL('../node_modules/next/dist/bin/next',import.meta.url);
process.argv=[process.execPath,fileURLToPath(cli),'dev','--hostname','127.0.0.1','--port','3000',...process.argv.slice(2)];
await import(cli.href);
