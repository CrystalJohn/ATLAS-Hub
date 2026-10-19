import map from './world-map.json';
import codes from './region-codes.json';
import {packFor,copy} from './japan';
import type {Country} from './types';
const en=new Intl.DisplayNames(['en'],{type:'region'}),vi=new Intl.DisplayNames(['vi'],{type:'region'});
export const countryCatalog:Country[]=codes.map(id=>packFor(id)?.country??({id,name:copy(en.of(id)??id,vi.of(id)??id),availability:id==='VN'?'PREVIEW':'COMING_SOON',coordinates:(map.find(c=>c.id===id)?.coordinates??[0,0]) as [number,number],destinationIds:[],intro:id==='VN'?copy('A first look at Vietnam: Hanoi in the north and Ho Chi Minh City in the south. English travel encounters have not been published here yet.','Xem trước Việt Nam: Hà Nội ở miền Bắc, Thành phố Hồ Chí Minh ở miền Nam. Chưa có encounter tiếng Anh tại đây.'):copy('A place for a future journey. No playable content pack has been published here yet.','Điểm đến cho hành trình tương lai. Chưa có gói nội dung có thể chơi tại đây.')}));
export const worldPaths=map;
