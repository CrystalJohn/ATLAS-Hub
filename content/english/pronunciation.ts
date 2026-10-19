import {travelPacks} from '../travel/japan.ts';
/** Reviewed IPA reference data; no copied recordings or generated translations. */
export type Pronunciation={us:string;uk:string;sourceUrl:string;sourceOrganization:string;verifiedAt:string;note?:string};
const reference=(slug:string,us:string,uk:string,note?:string):Pronunciation=>({us,uk,sourceUrl:`https://dictionary.cambridge.org/us/pronunciation/english/${slug}`,sourceOrganization:'Cambridge Dictionary',verifiedAt:'2026-10-19',...(note?{note}:{})});
export const pronunciations:Record<string,Pronunciation>={
 canopy:reference('canopy','ˈkæn.ə.pi','ˈkæn.ə.pi'),
 shade:reference('shade','ʃeɪd','ʃeɪd'),
 stream:reference('stream','striːm','striːm'),
 insects:reference('insect','ˈɪn.sekts','ˈɪn.sekts','Reviewed plural of insect: the final /t/ takes /s/.'),
 measurement:reference('measurement','ˈmeʒ.ɚ.mənt','ˈmeʒ.ə.mənt'),
 compare:reference('compare','kəmˈper','kəmˈpeə(r)'),
 evidence:reference('evidence','ˈev.ə.dəns','ˈev.ɪ.dəns'),
 reference:reference('reference','ˈref.ɚ.əns','ˈref.ər.əns'),
 before:reference('before','bɪˈfɔːr','bɪˈfɔː(r)'),
 pause:reference('pause','pɑːz','pɔːz'),
 monitoring:{...reference('electronic-monitoring','ˈmɑː.nə.t̬ər.ɪŋ','ˈmɒn.ɪ.tər.ɪŋ'),sourceUrl:'https://dictionary.cambridge.org/pronunciation/english/electronic-monitoring',note:'Monitoring portion of the compound pronunciation; inflected form checked against monitor.'},
 recovery:reference('recovery','rɪˈkʌv.ɚ.i','rɪˈkʌv.ər.i'),
};

for(const pack of travelPacks)for(const encounter of pack.encounters)for(const entry of encounter.vocabulary)pronunciations[entry.word]={us:entry.us,uk:entry.uk,sourceUrl:entry.sourceUrl,sourceOrganization:'Cambridge Dictionary',verifiedAt:'2026-10-19',...(entry.word==='ingredients'?{note:'Plural form of ingredient.'}:{})};
