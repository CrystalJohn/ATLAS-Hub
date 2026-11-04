import { z } from 'zod';
const base = {id:z.enum(['silent-forest','disappearing-lake','restore-ecosystem']),version:z.literal(1),title:z.string(),narrative:z.string(),objectives:z.array(z.string()),rewards:z.object({xp:z.number().int().positive(),evidence:z.string()}),unlockEffects:z.array(z.string())};
const observation = z.object({id:z.string(),title:z.string(),reading:z.string(),detail:z.string()});
export const MissionSchema = z.discriminatedUnion('type',[
 z.object({...base,type:z.literal('DISCOVERY'),challenge:z.object({observations:z.array(observation),question:z.string(),options:z.array(z.object({id:z.string(),text:z.string()}))}),evaluation:z.object({answer:z.string()})}),
 z.object({...base,type:z.literal('REASONING'),challenge:z.object({observations:z.array(observation),question:z.string(),options:z.array(z.object({id:z.string(),text:z.string(),feedback:z.string()})),evidenceOptions:z.array(z.object({id:z.string(),text:z.string()}))}),evaluation:z.object({answer:z.string(),evidence:z.array(z.string())})}),
 z.object({...base,type:z.literal('PUZZLE'),challenge:z.object({actions:z.array(z.object({id:z.string(),text:z.string(),detail:z.string()})),transferQuestion:z.string(),transferOptions:z.array(z.object({id:z.string(),text:z.string()}))}),evaluation:z.object({sequence:z.array(z.string()),transfer:z.string()})}),
]);
export type Mission = z.infer<typeof MissionSchema>;
export const missions:Mission[] = [
 {id:'silent-forest',version:1,type:'DISCOVERY',title:'The Silent Forest',narrative:'The birds have gone quiet. Ranger Elara asks you to follow the stream and look for what has changed.',objectives:['Observe environmental changes.','Connect shade, water and aquatic life.'],challenge:{observations:[
 {id:'canopy',title:'The missing canopy',reading:'Shade cover · 20%',detail:'Fresh stumps line the bank. With fewer leaves overhead, more sunlight reaches the stream.'},
 {id:'stream',title:'A warmer stream',reading:'Water · 28°C',detail:'The shaded upstream reference is 18°C. The exposed reach is 10°C warmer, measured at the same time.'},
 {id:'wildlife',title:'Life at the surface',reading:'Fish · gasping',detail:'Fish gather near the moving inlet. Fewer aquatic insects means less food for the forest birds.'}
 ],question:'Which connection best explains why these clues belong together?',options:[{id:'linked',text:'Less shade can warm the water; changes in water conditions can affect fish, insects and birds.'},{id:'unrelated',text:'Trees, water, insects and birds operate independently.'},{id:'certain',text:'The stumps prove that a chemical spill killed all the fish.'}]},evaluation:{answer:'linked'},rewards:{xp:30,evidence:'observation'},unlockEffects:['disappearing-lake']},
 {id:'disappearing-lake',version:1,type:'REASONING',title:'The Disappearing Lake',narrative:'Take a short walk with Elara. Visit the stream and the bay, compare what you find, and ask how to help the fish. All readings are made up for this story.',objectives:['Ask a question and understand Elara’s answer.','Compare two places using warmer and less.'],challenge:{observations:[
 {id:'temperature',title:'Temperature transect',reading:'28°C / 18°C',detail:'Exposed bay: 28°C. Shaded reference: 18°C. Both sampled at dawn, same elevation, with calibrated probes.'},
 {id:'oxygen',title:'Oxygen readings',reading:'3.1 / 8.8 mg/L',detail:'Exposed bay: 3.1 mg/L dissolved oxygen; reference: 8.8 mg/L. A brief controlled aeration in the bay raised oxygen to 6.0 mg/L and fish stopped gasping. Low oxygen is a direct stressor; warming alone does not explain the full deficit.'},
 {id:'screen',title:'Pollution screen',reading:'No spike detected',detail:'Screened nutrients, ammonia and pesticides match reference levels. No spill, algal bloom or unusual organic load was observed. This weakens the tested pollution hypothesis; it does not rule out every contaminant.'}
 ],question:'From Elara’s notes, what is the problem for the fish?',options:[
 {id:'oxygen-stress',text:'The fish have too little oxygen in the warmer bay.',feedback:'The bay has less oxygen, and adding air helped the fish. Elara still needs more checks to find the full cause.'},
 {id:'toxic-spill',text:'We know there was a chemical spill.',feedback:'Elara’s checks did not confirm a spill. The visitor’s story needs more checking.'},
 {id:'water-loss',text:'The lake has no water left.',feedback:'The lake still has water. Look again at Elara’s notes about the fish.'}
 ],evidenceOptions:[{id:'oxygen-response',text:'Elara added air to the water, and the fish improved.'},{id:'warm-reference',text:'The bay is warmer than the stream.'},{id:'spill-rumor',text:'A visitor heard a story about a spill.'}]},evaluation:{answer:'oxygen-stress',evidence:['oxygen-response','warm-reference']},rewards:{xp:60,evidence:'causal-reasoning'},unlockEffects:['restore-ecosystem']},
 {id:'restore-ecosystem',version:1,type:'PUZZLE',title:'Restore the Ecosystem',narrative:'The ranger has approved a small recovery trial. Build a four-step plan: protect life now, repair the habitat, verify recovery, then decide whether fish can return.',objectives:['Sequence emergency, habitat and monitoring actions.','Use measured recovery rather than appearance to guide decisions.'],challenge:{actions:[
 {id:'monitor',text:'Verify sustained recovery',detail:'Monitor dawn oxygen, temperature and wildlife over several weeks against the reference.'},
 {id:'restock',text:'Consider native reintroduction',detail:'Only after sustained safe conditions and an ecological review, consider whether native fish need reintroduction.'},
 {id:'aerate',text:'Stabilize oxygen first',detail:'Under ranger supervision, use temporary aeration to reduce immediate oxygen stress.'},
 {id:'clear',text:'Clear every bank-side tree',detail:'Remove the remaining shade so the water receives more sunlight.'},
 {id:'shade',text:'Restore native bank vegetation',detail:'Protect the bank and replant native shade vegetation. Canopy recovery takes time.'},
 {id:'stock-now',text:'Add fish immediately',detail:'Introduce more fish before oxygen conditions have recovered.'}
 ],transferQuestion:'Weeks later, the lake looks clear but dawn oxygen falls again. What should happen next?',transferOptions:[{id:'reassess',text:'Pause reintroduction, reassess the cause, and continue monitoring and support.'},{id:'looks-clear',text:'Add fish anyway because clear water proves the habitat is healthy.'}]},evaluation:{sequence:['aerate','shade','monitor','restock'],transfer:'reassess'},rewards:{xp:120,evidence:'recovery-transfer'},unlockEffects:['observation-station','restore-world']}
].map(m=>MissionSchema.parse(m));
export function missionById(id:string,version=1):Mission { const m=missions.find(m=>m.id===id&&m.version===version);if(!m)throw new Error('Unknown mission version');return m; }
// Public projections omit evaluation rules. Evaluators remain on the server.
export function publicMission(m:Mission) { const {evaluation,...publicData}=m; void evaluation; return publicData; }
