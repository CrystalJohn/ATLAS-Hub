export type GuideInput={type:'DISCOVERY'|'REASONING'|'PUZZLE';started:boolean;complete:boolean;observed:number;totalClues:number;hasAnswer:boolean;evidenceCount:number;sequenceCount:number;hasTransfer:boolean};
export type GuideAction='begin'|'clue'|'question'|'evidence'|'plan'|'transfer'|'submit'|'next';
export function missionGuidance(p:GuideInput){
 const step=(current:number,title:string,vi:string,button:string,buttonVi:string,action:GuideAction,ready=false)=>({current,title,vi,button,buttonVi,action,ready});
 if(p.complete)return step(3,'Mission complete. A new trail is waiting.','Bạn đã hoàn thành. Chọn khu tiếp theo để khám phá.','Next trail','Đi tiếp','next');
 if(!p.started)return step(0,'Your first move: enter the mission.','Bắt đầu nhiệm vụ, đọc manh mối rồi chọn câu trả lời.','Begin expedition','Bắt đầu','begin');
 if(p.type!=='PUZZLE'&&p.observed<p.totalClues)return step(1,`Read the clues · ${p.observed}/${p.totalClues}`,`Chạm vào từng manh mối để đọc. Còn ${p.totalClues-p.observed} manh mối chưa xem.`,'Read the next clue','Đọc manh mối tiếp theo','clue');
 if(p.type==='PUZZLE'&&p.sequenceCount!==4)return step(1,`Build your plan · ${p.sequenceCount}/4 steps`,'Chọn 4 hành động theo đúng thứ tự. Chạm vào bước đã chọn để bỏ nó.','Go to the plan','Đến phần xếp kế hoạch','plan');
 if(p.type==='PUZZLE'&&!p.hasTransfer)return step(2,'Answer the new scenario.','Kế hoạch đã đủ 4 bước. Trả lời tình huống bên dưới.','Go to the question','Đến câu hỏi','transfer');
 if(p.type!=='PUZZLE'&&!p.hasAnswer)return step(2,'Clues ready. Choose your answer.','Đã đọc đủ manh mối. Chọn một đáp án cho câu hỏi.','Go to the question','Đến câu hỏi','question');
 if(p.type==='REASONING'&&p.evidenceCount!==2)return step(2,`Select supporting evidence · ${p.evidenceCount}/2`,'Chọn đúng 2 số liệu làm bằng chứng cho câu trả lời.','Choose two measurements','Chọn 2 bằng chứng','evidence');
 return step(2,'Your answer is ready to check.','Gửi câu trả lời để nhận phản hồi. Nếu sai, bạn có thể thử lại.','Check my answer','Kiểm tra câu trả lời','submit',true);
}
