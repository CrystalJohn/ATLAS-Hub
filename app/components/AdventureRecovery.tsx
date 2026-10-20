'use client';
import {CloudOff,Compass,RefreshCw} from 'lucide-react';
import {useInterfaceLanguage} from './Bilingual';

export function AdventureRecovery({code,retrying,onRetry,signedIn=false}:{code?:string;retrying:boolean;onRetry:()=>void;signedIn?:boolean}){
 const {t}=useInterfaceLanguage();
 const preparing=['ACCOUNT_CONFIGURATION_REQUIRED','DATABASE_SETUP_REQUIRED','PROFILE_SETUP_REQUIRED'].includes(code??'');
 return <section className="adventure-recovery" aria-labelledby="recovery-title" aria-busy={retrying}>
  <div className="recovery-illustration" aria-hidden="true"><Compass size={44}/><span><CloudOff size={20}/></span></div>
  <h1 id="recovery-title">{preparing?t('Your adventure is almost ready.','Hành trình của bạn sắp sẵn sàng.'):t('Let’s reconnect to your adventure.','Mình kết nối lại hành trình nhé.')}</h1>
  <p>{preparing?t('ATLAS needs a little more time to get things ready. Please check back shortly.','ATLAS cần thêm một chút thời gian để chuẩn bị. Bạn quay lại sau ít phút nhé.'):t('We couldn’t open your adventure right now. Check your connection, then give it another try.','Hiện chưa thể mở hành trình của bạn. Kiểm tra kết nối rồi thử lại nhé.')}</p>
  <button type="button" className="play-button purple" disabled={retrying} onClick={onRetry}><RefreshCw size={17} className={retrying?'recovery-spinning':undefined}/>{retrying?t('Reconnecting…','Đang kết nối…'):t('Try again','Thử lại')}</button>
  {signedIn&&<form action="/auth/logout" method="post"><button type="submit" className="quiet-button" disabled={retrying}>{t('Sign out','Đăng xuất')}</button></form>}
  <p className="recovery-note">{t('Retrying won’t reset your saved progress.','Thử lại sẽ không đặt lại tiến trình đã lưu của bạn.')}</p>
  <span className="sr-only" role="status">{retrying?t('Connecting to ATLAS.','Đang kết nối với ATLAS.'):t('Connection needs another try.','Cần thử kết nối lại.')}</span>
 </section>;
}
