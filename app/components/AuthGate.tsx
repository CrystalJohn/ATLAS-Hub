import { Compass } from 'lucide-react';
import {useInterfaceLanguage} from './Bilingual';
export function AuthGate() {
  const {t}=useInterfaceLanguage();
  return <section className="auth-gate" aria-labelledby="sign-in-title">
    <span className="auth-compass" aria-hidden="true"><Compass size={48}/></span>
    <span className="pill purple">{t('YOUR NEXT ADVENTURE','HÀNH TRÌNH TIẾP THEO CỦA BẠN')}</span>
    <h1 id="sign-in-title">{t('A world to explore.','Một thế giới để khám phá.')}<br/>{t('A place to call yours.','Một hành trình của riêng bạn.')}</h1>
    <p>{t('Sign in to save your discoveries, collect travel stamps, and continue your adventure when you return.','Đăng nhập để lưu hành trình, sưu tầm dấu hộ chiếu và tiếp tục khám phá khi quay lại.')}</p>
    <a className="play-button purple" href="/auth/google">
      {t('Continue with','Đăng nhập bằng')} Google
    </a>
    <p className="micro-copy">{t('No password to create.','Không cần tạo mật khẩu.')}</p>
    <p className="micro-copy">{t('Google accounts have their own adventure. Progress from another site stays on that site.','Tài khoản Google có hành trình riêng. Tiến trình trên site khác vẫn được giữ tại đó.')}</p>
  </section>;
}
