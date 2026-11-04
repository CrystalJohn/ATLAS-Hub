import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const root=path.resolve("docs/content-authoring/content-02b-review"), src=path.resolve("docs/content-authoring/content-02a-tokyo");
const read=n=>fs.readFileSync(path.join(src,n),"utf8").replace(/^\uFEFF/,"");
const write=(n,t)=>fs.writeFileSync(path.join(root,n),t+"\n","utf8");
const out=(n,v)=>write(n,JSON.stringify(v,null,2));
const hash=t=>crypto.createHash("sha256").update(t).digest("hex");
const snapshot=Object.fromEntries(fs.readdirSync(src).map(n=>[n,hash(fs.readFileSync(path.join(src,n)))]));
out("CONTENT-02B-source-snapshot.json",snapshot);
const s=JSON.parse(read("TOKYO-scenarios.json")), c=JSON.parse(read("TOKYO-tower-candidates.json")), keys=JSON.parse(read("TOKYO-tower-keys.private.json"));
const changes=[];
const edit=(obj,field,value,id)=>{changes.push({id,field,before:obj[field],after:value});obj[field]=value;};
const get=n=>s[n-1];
edit(get(1).retry,"en","You have collected your bag and now need to leave the terminal. The practice board says EXIT: STRAIGHT; TRAINS: LEFT; BAGGAGE CLAIM: RIGHT. You ask, 'Which way is the exit?' The assistant says, 'Go straight for the exit.'",get(1).retry.id);
edit(get(1).retry,"vi","Bạn đã nhận hành lý và muốn rời nhà ga. Biển luyện tập ghi LỐI RA: ĐI THẲNG; TÀU: TRÁI; NHẬN HÀNH LÝ: PHẢI. Bạn hỏi lối ra ở hướng nào. Nhân viên nói đi thẳng.",get(1).retry.id);
edit(get(6).retry,"en","At checkout, you need a bag and want to pay in cash. You say, 'A bag, please. I'll pay in cash.' After paying, you ask, 'Can I have a receipt, please?' The scene states no bag fee or general store payment rule.",get(6).retry.id);
edit(get(6).retry,"vi","Tại quầy thanh toán, bạn cần túi và muốn trả tiền mặt. Bạn nói: 'Cho tôi một chiếc túi. Tôi trả bằng tiền mặt.' Sau khi trả tiền, bạn xin biên lai. Cảnh không nêu phí túi hay quy định chung của cửa hàng.",get(6).retry.id);
edit(get(7).base,"en",get(7).base.en.replace("You prefer no egg.","You want vegetable noodles and prefer no egg."),get(7).base.id);
edit(get(7).base,"vi",get(7).base.vi.replace("Bạn không muốn trứng","Bạn muốn gọi mì rau và không muốn trứng"),get(7).base.id);
edit(get(7).retry,"en",get(7).retry.en.replace("You prefer no spring onions","You want chicken noodles and prefer no spring onions"),get(7).retry.id);
edit(get(7).retry,"vi",get(7).retry.vi.replace("Bạn không muốn hành lá","Bạn muốn gọi mì gà và không muốn hành lá"),get(7).retry.id);
edit(get(8).feedback,"en","Name the dish you ordered so the server can check the mismatch. When you are ready to pay, ask for the bill or check. Both terms are acceptable in this restaurant context; a receipt records payment.",get(8).id);
edit(get(8).feedback,"vi","Nêu món bạn đã gọi để nhân viên kiểm tra nhầm lẫn. Khi sẵn sàng thanh toán, xin bill hoặc check. Cả hai từ đều chỉ hóa đơn tính tiền trong bối cảnh nhà hàng này; receipt là biên lai thanh toán.",get(8).id);
edit(get(11).base,"vi",get(11).base.vi.replace("tàu thường","tàu dừng ở các ga dọc tuyến"),get(11).base.id);
edit(get(12).base,"en","The staff member says, 'Your meeting is in Room 14.' You think you heard Room 40. You ask, 'Sorry, did you say Room 40?' The staff member replies, 'No, Room 14.' You confirm, 'Room 14, right?' The staff member says, 'That's right.'",get(12).base.id);
edit(get(12).base,"vi","Nhân viên nói cuộc hẹn ở phòng 14. Bạn nghĩ mình nghe được phòng 40 nên hỏi: 'Xin lỗi, có phải phòng 40 không?' Nhân viên sửa: 'Không, phòng 14.' Bạn hỏi lại: 'Phòng 14, đúng không?' Nhân viên xác nhận: 'Đúng rồi.'",get(12).base.id);
edit(get(12).retry,"en","A receptionist says the appointment is at 2:30. You think you heard 3:20. You ask, 'Sorry, did you say 3:20?' The receptionist replies, 'No, 2:30.' You confirm, 'So that's 2:30, right?' The receptionist says, 'Yes.'",get(12).retry.id);
edit(get(12).retry,"vi","Lễ tân nói cuộc hẹn lúc 2:30. Bạn nghĩ mình nghe được 3:20 nên hỏi: 'Xin lỗi, có phải 3:20 không?' Lễ tân sửa: 'Không, 2:30.' Bạn hỏi lại: 'Vậy là 2:30, đúng không?' Lễ tân xác nhận.",get(12).retry.id);
get(12).chunkIds=get(12).chunkIds.filter(x=>x!=="CH-correct-heard-detail");
get(12).vocabularyIds=get(12).vocabularyIds.filter(x=>x!=="VS-mean-intended");
get(12).targetLanguage=["Sorry, did you say Room 40?","No, Room 14.","Room 14, right?"];
get(12).chunks=["did-you-say","so-thats"];get(12).vocabulary=["room","confirm"];
get(12).goal="Check a possibly misheard detail and confirm the corrected information";
for(const item of s){
 item.parentRevision=item.contentRevision;item.contentRevision="TOKYO-DAILY-r2";
 item.aiReview={date:"2026-11-04",status:"AI_ADVERSARIAL_REVIEW",independentHumanSignoff:null};
 item.evidencePolicy={currentModality:"TEXT_ONLY",listeningEligible:false,spokenProductionAssessed:false,viBeforeAnswer:"SUPPORTED_ENGLISH_EVIDENCE",sourceExposure:"MUST_BE_TAUGHT_BEFORE_REVIEW",masteryClaim:false};
 item.sourceLessonRefs=[item.base,item.retry].map(l=>({lessonId:l.id,revision:item.contentRevision,sha256:hash(l.en+"\n--VI--\n"+l.vi),mustBeTaughtBeforeAssessment:true}));
 if(item.skills.includes("listening"))item.skills=item.skills.map(x=>x==="listening"?"reading (audio pending)":x);
 for(const step of item.playerInteractionPlan){
   step.playerAction=step.playerAction.replace("Choose or say","Choose").replace("Listen to","Read");
   if(step.promptEn.startsWith("Listen to")){step.promptEn="Read the cashier's bag and payment questions.";step.promptVi="Đọc câu hỏi của nhân viên về túi và cách thanh toán.";}
   step.modality="TEXT_ONLY";step.audioProductionPending=true;
 }
}
get(11).playerInteractionPlan[0].promptEn="In this practice situation, you missed the time. Select a request that asks the staff member to repeat it.";
get(11).playerInteractionPlan[0].promptVi="Trong tình huống luyện tập, bạn không nghe rõ giờ. Chọn lời nhờ nhân viên nhắc lại.";
get(11).playerInteractionPlan[0].evidence="RECOGNITION";
get(11).playerInteractionPlan[1].promptEn="After reading the repeated time, report it with the text hidden.";
get(11).playerInteractionPlan[1].promptVi="Sau khi đọc giờ được nhắc lại, hãy nêu lại giờ khi văn bản đã ẩn.";
get(11).difficulty.demand="RECOGNITION";
for(const candidate of c){
 candidate.parentRevision=candidate.contentRevision;candidate.contentRevision="TOKYO-DAILY-r2";
 candidate.evidenceType=({RECALL:"RECOGNITION",APPLICATION:"CONTEXTUAL_RECOGNITION",CONTROLLED_APPLICATION:"MULTI_CONSTRAINT_RECOGNITION"})[candidate.evidenceType]||candidate.evidenceType;
 const source=s.find(x=>x.id===candidate.scenarioId);
 for(const v of candidate.variants){
  if(v.id==="TWR-TKY-007-V1"){v.stemEn="You want vegetable noodles with no egg. Which order states both choices?";v.stemViCandidate="Bạn muốn mì rau và không muốn trứng. Cách gọi nào nêu đúng cả hai lựa chọn?";}
  if(v.id==="TWR-TKY-007-V2"){v.stemEn="You want chicken noodles with no spring onions. Which order states both choices?";v.stemViCandidate="Bạn muốn mì gà và không muốn hành lá. Cách gọi nào nêu đúng cả hai lựa chọn?";}
  if(v.id==="TWR-TKY-003-V1")v.options[2].text="Change to Green at Lake, then get off at Pine.";
  if(v.id==="TWR-TKY-010-V1"){v.options[1].text="Sorry, is that the departure time?";v.options[2].text="Sorry, which platform does it leave from?";}
  if(v.id==="TWR-TKY-010-V2"){v.options[0].text="Sorry, where is that table?";v.options[2].text="Sorry, is that my table number?";}
  const ref=source.sourceLessonRefs.find(x=>x.lessonId===v.sourceLessonId);
  v.sourceLessonRevision=ref.revision;v.sourceLessonSha256=ref.sha256;
  v.deliveryRequirement="READ_SOURCE_STIMULUS_WITHOUT_MODELED_ANSWER_THEN_CONFIRM_ONE_CHOICE";
 }
}
keys.find(x=>x.variantId==="TWR-TKY-003-V1").distractorRationale.C="It reverses transfer stop and destination: Pine is where you change, Lake is where you finish.";
keys.find(x=>x.variantId==="TWR-TKY-010-V1").distractorRationale={B:"It checks what kind of time was given; it does not ask the speaker to repeat the time.",C:"It requests a platform rather than repetition of the missing time."};
keys.find(x=>x.variantId==="TWR-TKY-010-V2").distractorRationale={A:"It asks for the location of the table rather than repetition of its number.",C:"It checks whether the number is the learner's, without requesting the number again."};
out("TOKYO-scenarios.r2.json",s);out("TOKYO-tower-candidates.r2.json",c);
out("TOKYO-tower-keys.r2.private.json",keys);
out("CONTENT-02B-change-log.json",changes);
console.log("Created r2 editorial proposals; r1 preserved.");
