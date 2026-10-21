// Official PostgREST release, test tooling only. For other platforms supply
// ATLAS_POSTGREST_BIN pointing to an installed compatible PostgREST binary.
import {mkdir,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
if(process.platform!=='win32')throw new Error('Set ATLAS_POSTGREST_BIN to a compatible local PostgREST executable.');
const directory='.sites-runtime/auth02-tools';await mkdir(directory,{recursive:true});
const url='https://github.com/PostgREST/postgrest/releases/download/v12.2.3/postgrest-v12.2.3-windows-x64.zip';
const response=await fetch(url);if(!response.ok)throw new Error(`Official PostgREST download failed: ${response.status}`);
const bytes=Buffer.from(await response.arrayBuffer());await writeFile(`${directory}/postgrest.zip`,bytes);
const extracted=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',"Expand-Archive -LiteralPath '.sites-runtime/auth02-tools/postgrest.zip' -DestinationPath '.sites-runtime/auth02-tools/postgrest' -Force"],{stdio:'inherit',windowsHide:true});
if(extracted.status!==0)process.exit(extracted.status??1);
console.log(`PostgREST v12.2.3 downloaded from official release. SHA256 ${createHash('sha256').update(bytes).digest('hex')}`);
