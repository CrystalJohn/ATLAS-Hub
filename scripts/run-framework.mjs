import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const [command,...args]=process.argv.slice(2);
if(!['dev','build','start'].includes(command))throw new Error('Expected dev, build or start.');
if(command==='build'){
 const result=spawnSync(process.execPath,[fileURLToPath(new URL('./validate-evidence.mts',import.meta.url))],{stdio:'inherit'});
 if(result.error)throw result.error;
 if(result.status!==0)process.exit(result.status??1);
}
// Supabase PostgreSQL is the sole active persistence provider on every host.
const cli=new URL('../node_modules/next/dist/bin/next',import.meta.url);
process.argv=[process.execPath,fileURLToPath(cli),command,...args];
await import(cli.href);