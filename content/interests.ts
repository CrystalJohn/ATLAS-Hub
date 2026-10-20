export const interestIds=['nature','travel','food','culture'] as const;
export type ExplorationInterest=typeof interestIds[number];
export const explorationInterests=[
 {id:'nature',en:'Nature & environment',vi:'Thiên nhiên & môi trường'},
 {id:'travel',en:'Travel & places',vi:'Du lịch & địa điểm'},
 {id:'food',en:'Food & cuisine',vi:'Ẩm thực'},
 {id:'culture',en:'Culture & everyday life',vi:'Văn hóa & đời sống'},
] as const;
