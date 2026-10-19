/** Presentation metadata only; authored examples and Vietnamese remain in the lesson glossary. */
export type WordDetail={partOfSpeech:string;definition:string;chunk:string;image:string;alt:string;position?:string;scene?:boolean};
const scene=(alt:string,position='50% 58%')=>({image:'/assets/regions/nature-realm/shaded-stream-480.webp',alt,position,scene:true});
const diagram=(name:string,alt:string)=>({image:`/assets/vocabulary/${name}.svg`,alt});
export const wordDetails:Record<string,WordDetail>={
 shade:{partOfSpeech:'noun · uncountable',definition:'An area sheltered from direct sunlight.',chunk:'give the stream shade',...scene('Illustrated tree branches sheltering part of a forest stream.','22% 35%')},
 stream:{partOfSpeech:'noun · countable',definition:'A small, naturally flowing body of water.',chunk:'follow the stream',...scene('Illustrated flowing stream winding between mossy rocks.','55% 76%')},
 insects:{partOfSpeech:'plural noun · singular: insect',definition:'Small animals with six legs and three main body sections.',chunk:'insects near the water',...diagram('insects','Learning illustration of an insect with six legs, antennae and wings.')},
 canopy:{partOfSpeech:'noun · countable',definition:'The layer of branches and leaves above the forest floor.',chunk:'the canopy keeps … in shade',...scene('Illustrated overhead branches and leaves forming a forest canopy.','45% 0%')},
 measurement:{partOfSpeech:'noun · countable',definition:'A value obtained by checking something with an instrument.',chunk:'the oxygen measurement',...diagram('measurement','Concept diagram of a probe and a measurement display; no real reading is shown.')},
 compare:{partOfSpeech:'verb',definition:'Look at two or more things to find similarities and differences.',chunk:'compare … with …',...diagram('compare','Two observation cards side by side, joined by comparison arrows.')},
 evidence:{partOfSpeech:'noun · uncountable',definition:'Information used to check or support an explanation.',chunk:'use evidence to check …',...diagram('evidence','A magnifying glass inspecting recorded observations.')},
 reference:{partOfSpeech:'noun · countable',definition:'Something used as a starting point for a comparison.',chunk:'our reference',...diagram('reference','A marked reference observation alongside a second observation.')},
 before:{partOfSpeech:'preposition · before + -ing',definition:'Earlier than the action that follows.',chunk:'before adding fish',...diagram('before','A water check comes first, followed by adding fish in a sequence.')},
 pause:{partOfSpeech:'verb',definition:'Stop an activity for a short time before continuing.',chunk:'pause the plan',...diagram('pause','A pause symbol next to a fieldwork plan.')},
 monitoring:{partOfSpeech:'verb · -ing form of monitor',definition:'Repeated checking and recording to follow changes over time.',chunk:'keep monitoring',...diagram('monitoring','Repeated observations recorded along a timeline, with no actual measurement values.')},
 recovery:{partOfSpeech:'noun · uncountable here',definition:'The process of returning to a better condition.',chunk:'recovery takes …',image:'/assets/regions/nature-realm/sunlit-bay-480.webp',alt:'Illustrated lake landscape as context for the recovery plan; appearance alone does not confirm recovery.',position:'50% 56%',scene:true},
};
