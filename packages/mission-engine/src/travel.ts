import {z} from 'zod';
import {encounterFor,copy} from '../../../content/travel/japan.ts';
import {emptyTravel,type EncounterProgress,type PlayerTravelProgress,type Copy} from '../../../content/travel/types.ts';
import {travelRules} from '../../../lib/atlas/travel-rules.ts';
export const TravelSubmission=z.object({encounterId:z.string().max(80),version:z.literal(1),stepId:z.string().max(80),expectedRevision:z.number().int().min(0).max(Number.MAX_SAFE_INTEGER-1).optional(),band:z.enum(['A1','A2','B1','B2']),support:z.object({vietnamese:z.boolean(),glossary:z.boolean()}).strict(),action:z.discriminatedUnion('kind',[
 z.object({kind:z.enum(['inspect','target']),target:z.string().max(80)}).strict(),
 z.object({kind:z.literal('say'),choice:z.string().max(80)}).strict(),
 z.object({kind:z.literal('move'),direction:z.enum(['up','right','down','left']),expectedMove:z.number().int().min(0).max(20)}).strict(),
 z.object({kind:z.literal('order'),dish:z.string().max(80),preference:z.string().max(80)}).strict(),
 z.object({kind:z.literal('compose'),tiles:z.array(z.string().max(40)).max(20)}).strict(),
 z.object({kind:z.literal('restart')}).strict(),
])}).strict();
export const initialEncounter=():EncounterProgress=>({step:0,routeIndex:0,seen:[]});
export function travelUnlocked(id:string,travel:PlayerTravelProgress=emptyTravel()){
 const found=encounterFor(id);if(!found)return false;
 const index=found.pack.encounters.findIndex(e=>e.id===id);
 return index===0||!!travel.encounters[found.pack.encounters[index-1].id]?.completedAt;
}
export function evaluateTravel(input:z.infer<typeof TravelSubmission>,travel:PlayerTravelProgress){
 const found=encounterFor(input.encounterId);if(!found)throw new Error('Unknown travel encounter');
 if(!travelUnlocked(input.encounterId,travel))throw new Error('Finish the previous travel stop first');
 const {pack,encounter}=found,p=travel.encounters[encounter.id]??initialEncounter();
 const next:EncounterProgress={...p,seen:[...p.seen]};
 if(input.action.kind==='restart')return {found,next:{...next,step:0,routeIndex:0,position:undefined},correct:true,advanced:false,complete:false,feedback:copy('A fresh look. First-clear rewards are never repeated.','Bắt đầu lại. Phần thưởng lần đầu không được nhận lại.')};
 if(p.step>=encounter.steps.length)return {found,next,correct:true,advanced:false,complete:true,feedback:copy('This stop is already complete. Choose Revisit to practise again.','Điểm dừng đã hoàn thành. Chọn Xem lại để luyện tiếp.')};
 const step=encounter.steps[p.step];
 if(input.stepId!==step.id)return {found,next,correct:false,advanced:false,complete:false,feedback:copy('Your activity has moved on. Try the current step.','Hoạt động đã chuyển bước. Hãy làm bước hiện tại.')};
 const rule=travelRules[encounter.id]?.[step.id];if(!rule)throw new Error('No published evaluation rule');
 const action=input.action;
 let correct=false,advanced=false,feedback:Copy=copy('Look again at your goal and the words in the scene. No XP is lost.','Xem lại mục tiêu và từ trong cảnh. Không bị trừ XP.');
 if(action.kind==='inspect'){
  const location=pack.locations.find(l=>l.id===encounter.locationId)!,hotspot=location.hotspots.find(h=>h.id===action.target);
  if(!hotspot)throw new Error('Unknown scene object');
  next.seen=[...new Set([...next.seen,hotspot.id])];feedback=hotspot.description;correct=true;
  advanced=step.kind==='inspect'&&rule.target===action.target;
 }else if(step.kind==='target'&&action.kind==='target'){correct=action.target===rule.target;advanced=correct;}
 else if(step.kind==='dialogue'&&action.kind==='say'){
  if(!step.dialogue.responses.some(r=>r.id===action.choice))throw new Error('Unknown dialogue choice');
  correct=action.choice===rule.choice;advanced=correct;
  feedback=correct?step.dialogue.reply[input.band]:copy('That sentence belongs to a different situation. Try a request that matches your goal.','Câu đó hợp với tình huống khác. Hãy chọn lời đề nghị phù hợp mục tiêu.');
 }else if(step.kind==='route'&&action.kind==='move'){
  if(action.expectedMove!==p.routeIndex)feedback=copy('That move was already processed. Look at your current position.','Bước đi đã được xử lý. Hãy xem vị trí hiện tại.');
  else {correct=rule.route?.[p.routeIndex]===action.direction;if(correct){next.routeIndex++;const delta={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]}[action.direction],position=p.position??step.grid.start;next.position=[position[0]+delta[0],position[1]+delta[1]];advanced=next.routeIndex===rule.route!.length;feedback=copy(advanced?'You reached your destination!':'One block closer. Read the next direction.','Bạn đã đi đúng hướng. Hãy đọc chỉ dẫn tiếp theo.');}else feedback=copy('Stay here. Read the next direction: straight means up on this map; right means toward the right edge.','Đứng lại đây. Đọc chỉ dẫn tiếp: thẳng là lên phía trên bản đồ; phải là sang cạnh phải.');}
 }else if(step.kind==='order'&&action.kind==='order'){
  if(!step.dishes.some(d=>d.id===action.dish)||!step.preferences.some(p=>p.id===action.preference))throw new Error('Unknown menu selection');
  correct=action.dish===rule.dish&&action.preference===rule.preference;advanced=correct;
  feedback=correct?copy('Your order is ready to send. Thank you!','Đã ghi nhận đúng yêu cầu gọi món. Cảm ơn bạn!'):copy('Check the goal, dish and preference. You can change the order.','Xem lại mục tiêu, món và yêu cầu. Bạn có thể đổi lựa chọn.');
 }else if(step.kind==='compose'&&action.kind==='compose'){
  if(new Set(action.tiles).size!==action.tiles.length||action.tiles.some(t=>!step.tiles.some(a=>a.id===t)))throw new Error('Unknown phrase tile');
  correct=JSON.stringify(action.tiles)===JSON.stringify(rule.tiles);advanced=correct;
  feedback=correct?copy('Your description is clear. Thank you for sharing your visit!','Bạn đã mô tả rõ ràng. Cảm ơn bạn đã kể về chuyến tham quan!'):copy('Try this order: who, enjoyed, what, and, what. Use all five pieces.','Thử thứ tự: ai, enjoyed, điều gì, and, điều gì. Dùng đủ năm mảnh.');
 }
 if(advanced){next.step++;if(action.kind!=='move'&&action.kind!=='say'&&action.kind!=='order'&&action.kind!=='compose')feedback=copy('Good discovery. Your next goal is ready.','Khám phá tốt lắm. Mục tiêu tiếp theo đã sẵn sàng.');}
 return {found,next,correct,advanced,complete:next.step===encounter.steps.length,feedback,skill:advanced?step.skill:undefined,itemId:step.id};
}
