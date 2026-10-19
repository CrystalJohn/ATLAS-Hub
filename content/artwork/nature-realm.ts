import type {LearningCopy} from '../evidence/types';
export interface EnvironmentArtwork {
 siteId:'stream'|'bay';src:string;webpSrcSet:string;fullWebp:string;
 width:number;height:number;focalPoint:string;alt:LearningCopy;
 origin:LearningCopy;usage:LearningCopy;
}
const directory='/assets/regions/nature-realm';
function files(name:string){return {src:`${directory}/${name}.png`,webpSrcSet:[480,960,1448].map(w=>`${directory}/${name}-${w}.webp ${w}w`).join(', '),fullWebp:`${directory}/${name}-1448.webp`};}
// Environment illustrations have no scientific-evidence role. The citation and
// measurement registry remains unchanged and continues to render separately.
export const environmentArtwork:Record<'stream'|'bay',EnvironmentArtwork>={
 stream:{siteId:'stream',...files('shaded-stream'),width:1448,height:1086,focalPoint:'50% 58%',alt:{en:'Illustrated forest stream with a leafy canopy, mossy rocks and small cascades. Fictional Shaded Stream artwork.',vi:'Tranh dòng suối trong rừng có tán lá, đá phủ rêu và thác nhỏ. Bối cảnh hư cấu Suối có bóng râm.'},origin:{en:'Official artwork supplied by the ATLAS project owner.',vi:'Artwork chính thức do chủ dự án ATLAS cung cấp.'},usage:{en:'Fictional scene artwork, not a field photograph. Game measurements are simulated.',vi:'Tranh bối cảnh hư cấu, không phải ảnh thực địa. Số đo trong trò chơi là giả lập.'}},
 bay:{siteId:'bay',...files('sunlit-bay'),width:1448,height:1086,focalPoint:'58% 50%',alt:{en:'Illustrated turquoise forest lake with an open sky, sunlit water, rocky shore and distant mountains. Fictional Sunlit Bay artwork.',vi:'Tranh hồ xanh ngọc trong rừng có bầu trời rộng, mặt nước đầy nắng, bờ đá và núi xa. Bối cảnh hư cấu Vịnh có nắng.'},origin:{en:'Official artwork supplied by the ATLAS project owner.',vi:'Artwork chính thức do chủ dự án ATLAS cung cấp.'},usage:{en:'Fictional scene artwork, not a field photograph. Game measurements are simulated.',vi:'Tranh bối cảnh hư cấu, không phải ảnh thực địa. Số đo trong trò chơi là giả lập.'}},
};
