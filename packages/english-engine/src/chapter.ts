import {z} from 'zod';
import {lessonById,readingBands} from '../../../content/english/chapter.ts';
export const EnglishItemSchema=z.object({lessonId:z.string().max(80),version:z.literal(1),band:z.enum(readingBands),itemId:z.enum(['read','word']),answer:z.string().max(30),support:z.object({vietnamese:z.boolean(),glossary:z.boolean()}).strict()}).strict();
const forestAnswers={A1:'water',A2:'inspect',B1:'sites',B2:'qualified'} as const;
const forestQuotes={A1:'Look at the water first.',A2:'Elara asks you to look at the water first.',B1:'She then asks you to compare your observations with a shaded site.',B2:'The evidence may support a connection without establishing the complete causal chain.'};
export function evaluateEnglishItem(input:unknown){
 const s=EnglishItemSchema.parse(input),lesson=lessonById(s.lessonId,s.version),variant=lesson.variants[s.band],question=variant.questions.find(q=>q.id===s.itemId)!;
 const option=question.options.find(o=>o.id===s.answer);if(!option)throw new Error('Unknown English answer option');
 let expected:string,explanation:string,explanationVi:string,quote:string;
 if(lesson.missionId==='silent-forest'){
  expected=s.itemId==='read'?forestAnswers[s.band]:'cover';
  quote=s.itemId==='read'?forestQuotes[s.band]:variant.passage.split('. ').find(t=>t.toLowerCase().includes('shade'))??variant.passage;
  if(s.band==='B2'&&s.itemId==='word')quote='The thinning canopy has reduced shade over the stream';
  if(s.band==='B1'&&s.itemId==='word')quote='the stream receives less shade and more sunlight';
  explanation=s.itemId==='word'?'Here, shade is shelter from sunlight. Trees and sunlight set the context; the colour or doubt meanings do not fit.':s.band==='B1'?'“This comparison” points back to comparing your observations with a shaded site.':s.band==='B2'?'The writer suggests a connection while leaving the full cause open. “May support” is weaker than “proves”.':'The instruction names the water as the first thing to inspect.';
  explanationVi=s.itemId==='word'?'Ở đây shade là bóng râm. Ngữ cảnh có cây và ánh nắng, nên nghĩa sắc độ hay chút nghi ngờ không phù hợp.':s.band==='B1'?'“This comparison” chỉ việc so sánh quan sát với nơi có bóng râm ở câu ngay trước.':s.band==='B2'?'“May support” là có thể hỗ trợ, không phải đã chứng minh đầy đủ nguyên nhân.':'Lời chỉ dẫn nói rõ cần quan sát nước trước.';
 }else if(lesson.missionId==='disappearing-lake'){
  expected=s.itemId==='read'?'evidence':'measure';quote=s.itemId==='read'?s.band==='A1'?'Compare the numbers.':'compare the measured values before deciding':'Use a measurement, not a story.';
  // Use an actual excerpt from each published draft.
  quote=s.itemId==='word'?variant.passage.split('. ').find(t=>t.toLowerCase().includes('measurement'))??variant.passage:variant.passage.split('. ').find(t=>t.toLowerCase().includes('compare'))??variant.passage;
  explanation=s.itemId==='read'?'Elara says to compare the numbers first. Hearing a story is not the same as checking.':'A measurement is a number from a check. It is not a story or a guess.';
  explanationVi=s.itemId==='read'?'Elara yêu cầu so sánh số đo. Lời đồn hay bề ngoài nước trong không thay thế được việc kiểm tra.':'Measurement là kết quả đo, chẳng hạn số đo oxy; khác với lời kể hoặc một phỏng đoán chưa kiểm tra.';
 }else{
  expected=s.itemId==='read'?'pause':'order';quote=s.itemId==='read'?variant.passage.split('. ').find(t=>t.toLowerCase().includes('if '))??variant.passage:variant.passage.split('. ').find(t=>t.toLowerCase().includes('before'))??variant.passage;
  explanation=s.itemId==='read'?'The if-condition tells the team to pause when oxygen falls. Clear-looking water does not cancel that condition.':'“Before” sets the order: checking the water happens first; adding fish can only come later.';
  explanationVi=s.itemId==='read'?'Điều kiện “if” yêu cầu tạm dừng khi oxy giảm. Nước trông trong không làm mất điều kiện đó.':'“Before” xác định thứ tự: kiểm tra nước trước, việc thả cá chỉ có thể diễn ra sau.';
 }
 return {itemId:s.itemId,skill:question.skill,correct:s.answer===expected,selectedText:option.text,correctText:question.options.find(o=>o.id===expected)!.text,explanation,explanationVi,quote,awardedXp:0};
}
