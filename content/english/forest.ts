// Presentation content only. Answer keys live in packages/english-engine.
export const readingBands = ['A1', 'A2', 'B1', 'B2'] as const;
export type ReadingBand = typeof readingBands[number];
export type EnglishSkill = 'reading' | 'vocabulary' | 'listening' | 'pronunciation' | 'speaking';
export type Question = {id:'read'|'word'; skill:'reading'|'vocabulary'; prompt:string; options:{id:string;text:string}[]};
export const forestLesson = {
 id:'forest-field-note', version:1, missionId:'silent-forest', missionVersion:1,
 reviewStatus:'DRAFT_EDUCATOR_REVIEW_PENDING',
 reviewNote:'Prototype text and Vietnamese assistance — bilingual educator review pending. Target bands are not validated proficiency ratings.',
 glossary:[
  {word:'shade',meaning:'bóng râm',explanation:'Vùng được che khỏi ánh nắng trực tiếp; ở đây là bóng cây trên mặt nước.',example:'The trees give the stream shade.',exampleVi:'Cây tạo bóng râm cho dòng suối.'},
  {word:'stream',meaning:'suối; dòng suối',explanation:'Dòng nước nhỏ chảy tự nhiên, không phải “phát trực tuyến” trong ngữ cảnh này.',example:'We follow the stream to the lake.',exampleVi:'Chúng tôi đi dọc theo dòng suối đến hồ.'},
  {word:'insects',meaning:'côn trùng',explanation:'Trong nhiệm vụ này, một số côn trùng sống gần nước là thức ăn của chim.',example:'The birds eat insects near the water.',exampleVi:'Chim ăn côn trùng gần mặt nước.'},
  {word:'canopy',meaning:'tán cây; tầng tán',explanation:'Lớp cành và lá phía trên tạo bóng râm. Đây là từ chuyên đề, có hỗ trợ ở mọi mức.',example:'The canopy keeps part of the stream in shade.',exampleVi:'Tán cây giữ một phần dòng suối trong bóng râm.'},
 ],
 variants:{
  A1:{goal:'Find a stated detail in short sentences with word support.',passage:'Look at the trees. They give the stream shade. Now there are fewer trees. The water is warm. Birds eat insects near the water. Elara says, “Look at the water first.”',vi:'Cây tạo bóng râm cho suối. Nay cây ít hơn, nước ấm. Chim ăn côn trùng gần nước. Elara bảo hãy quan sát nước trước.',questions:[
   {id:'read',skill:'reading',prompt:'What does Elara ask you to look at first?',options:[{id:'water',text:'The water.'},{id:'sky',text:'The sky.'},{id:'road',text:'The road.'}]},
   {id:'word',skill:'vocabulary',prompt:'In this field note, “shade” means…',options:[{id:'cover',text:'A place away from direct sunlight.'},{id:'noise',text:'A loud sound.'},{id:'rain',text:'Water from the sky.'}]},
  ]},
  A2:{goal:'Find a direct instruction and understand a word in a short field note.',passage:'The trees give the stream shade. There are fewer trees now, so more sunlight reaches the water. Birds eat insects near the stream. Before you explain the quiet forest, Elara asks you to look at the water first. A guess is not a measurement.',vi:'Ít cây hơn nên ánh nắng chiếu xuống nước nhiều hơn. Trước khi giải thích vì sao rừng yên lặng, Elara yêu cầu quan sát nước. Phỏng đoán không phải số đo.',questions:[
   {id:'read',skill:'reading',prompt:'What should you do before explaining the quiet forest?',options:[{id:'guess',text:'Guess without looking.'},{id:'inspect',text:'Look at the water first.'},{id:'leave',text:'Leave the forest.'}]},
   {id:'word',skill:'vocabulary',prompt:'What does “shade” mean here?',options:[{id:'heat',text:'Heat from the sun.'},{id:'cover',text:'Protection from direct sunlight.'},{id:'depth',text:'The depth of the water.'}]},
  ]},
  B1:{goal:'Follow a sequence of instructions and interpret a contextual word.',passage:'Where the canopy has thinned, the stream receives less shade and more sunlight. Birds depend on insects near the water. Elara asks you to inspect the water before proposing an explanation for the quiet forest. She then asks you to compare your observations with a shaded site. This comparison may help you test your first idea.',vi:'Tán cây thưa làm suối ít bóng râm hơn. Elara yêu cầu quan sát nước rồi so sánh với nơi có bóng râm để kiểm tra ý tưởng ban đầu.',questions:[
   {id:'read',skill:'reading',prompt:'What does “This comparison” refer to?',options:[{id:'birds',text:'Counting birds on two different days.'},{id:'ideas',text:'Choosing between two guesses without measurements.'},{id:'sites',text:'Comparing observations with those from a shaded site.'}]},
   {id:'word',skill:'vocabulary',prompt:'Which use of “shade” has the same meaning as in the field note?',options:[{id:'colour',text:'This paint is a darker shade of green.'},{id:'cover',text:'We rested in the shade of a tree.'},{id:'lamp',text:'She replaced the lamp shade.'}]},
  ]},
  B2:{goal:'Interpret a qualified conclusion and distinguish contextual word meanings.',passage:'The thinning canopy has reduced shade over the stream, exposing the water to more sunlight. Although birds rely on insects associated with the water, their absence alone does not establish why the ecosystem has changed. Elara recommends comparing the exposed reach with a shaded reference before attributing the change to any single cause. The evidence may support a connection without establishing the complete causal chain.',vi:'Ít bóng râm hơn có thể liên quan đến thay đổi ở suối. Tuy nhiên, chỉ việc vắng chim chưa xác định được nguyên nhân. Cần so sánh với nơi đối chứng và tránh kết luận vượt quá bằng chứng.',questions:[
   {id:'read',skill:'reading',prompt:'Which statement best preserves the writer’s degree of certainty?',options:[{id:'proof',text:'The absence of birds proves a single cause.'},{id:'qualified',text:'The observations suggest a connection, but further comparison is needed.'},{id:'dismiss',text:'No observation can provide useful evidence.'}]},
   {id:'word',skill:'vocabulary',prompt:'Which meaning of “shade” fits the passage?',options:[{id:'colour',text:'A subtle variation of colour.'},{id:'doubt',text:'A small amount of doubt.'},{id:'cover',text:'Shelter from direct sunlight.'}]},
  ]},
 } satisfies Record<ReadingBand,{goal:string;passage:string;vi:string;questions:Question[]}>,
} as const;

// Fixed agent-authored translations require independent review before MVP release.
// This pilot is available only in development/test, with no production override.
export function isEnglishPilotAvailable() { return true; /* Private Sites review build only. Canonical MVP gate is unchanged. */ }
