'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Compass,GraduationCap,LockKeyhole,MapPinned,X} from 'lucide-react';
import {Dialog} from 'radix-ui';
import {useInterfaceLanguage} from './Bilingual';

function WelcomeInformation({kind}:{kind:'privacy'|'terms'}){
  const {t}=useInterfaceLanguage();
  const privacy=kind==='privacy';
  return <Dialog.Root>
    <Dialog.Trigger className="welcome-footer-link">{privacy?t('Privacy','Quyền riêng tư'):t('Terms','Điều khoản')}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="welcome-dialog-overlay"/>
      <Dialog.Content className="welcome-dialog">
        <Dialog.Title>{privacy?t('Your account & privacy','Tài khoản & quyền riêng tư'):t('About your adventure','Về hành trình của bạn')}</Dialog.Title>
        <Dialog.Description>{privacy
          ?t('ATLAS uses Google sign-in to identify your account. Your player profile, preferences and saved progress are stored in Supabase and linked to your account.','ATLAS sử dụng đăng nhập Google để xác định tài khoản. Hồ sơ, tùy chọn và tiến trình đã lưu được lưu trữ trong Supabase, gắn với tài khoản của bạn.')
          :t('ATLAS is an English-learning exploration game. XP, levels and collectibles reflect your progress in the game; they do not certify English proficiency.','ATLAS là trò chơi khám phá và học tiếng Anh. XP, cấp độ và vật phẩm thể hiện tiến trình trong trò chơi; không chứng nhận trình độ tiếng Anh.')}</Dialog.Description>
        <p>{privacy?t('ATLAS never asks you to create or share a Google password.','ATLAS không yêu cầu bạn tạo hay chia sẻ mật khẩu Google.'):t('Features and learning content may change as the project develops.','Tính năng và nội dung học có thể thay đổi khi dự án được phát triển.')}</p>
        <Dialog.Close className="welcome-dialog-close" aria-label={t('Close','Đóng')}><X size={21}/></Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

export function AuthGate({checkingSession=false}:{checkingSession?:boolean}) {
  const {locale,setLocale,t}=useInterfaceLanguage();
  return <div className="welcome-page" lang={locale}>
    <a className="welcome-skip" href="#welcome-content">{t('Skip to sign in','Đến phần đăng nhập')}</a>
    <div className="welcome-hero">
      <div className="welcome-art" aria-hidden="true">
        <Image src="/assets/welcome/adventure-world.webp" alt="" fill preload sizes="(max-width: 767px) 100vw, 75vw"/>
      </div>
      <header className="welcome-header">
        <Link className="welcome-brand" href="/" aria-label="ATLAS home">
          <Compass size={61} strokeWidth={1.3} aria-hidden="true"/>
          <span>ATLAS<small>WORLD EXPLORER RPG</small></span>
        </Link>
        <nav className="welcome-languages" aria-label={t('Interface language','Ngôn ngữ giao diện')}>
          <button type="button" lang="en" aria-pressed={locale==='en'} aria-label={t('Switch interface to English','Chuyển giao diện sang tiếng Anh')} onClick={()=>setLocale('en')}>EN</button>
          <span aria-hidden="true">|</span>
          <button type="button" lang="vi" aria-pressed={locale==='vi'} aria-label={t('Switch interface to Vietnamese','Chuyển giao diện sang tiếng Việt')} onClick={()=>setLocale('vi')}>VI</button>
        </nav>
      </header>
      <main className="welcome-content" id="welcome-content">
        <p className="welcome-eyebrow">{t('YOUR ADVENTURE STARTS HERE','HÀNH TRÌNH CỦA BẠN BẮT ĐẦU TỪ ĐÂY')}</p>
        <h1 id="sign-in-title">{locale==='en'?<><span>A little English.</span><span>A world of</span><span className="welcome-accent">adventure.</span></>:<><span>Một chút tiếng Anh.</span><span>Cả thế giới</span><span className="welcome-accent">để khám phá.</span></>}</h1>
        <div className="welcome-introduction">
          <p>{t('Explore new places, meet friendly faces, and learn English along the way.','Khám phá những vùng đất mới, gặp gỡ bạn bè và học tiếng Anh trên mỗi chặng đường.')}</p>
          {locale==='en'&&<p className="welcome-vietnamese" lang="vi">Khám phá thế giới. Học tiếng Anh mỗi ngày.</p>}
        </div>
        <a className="welcome-google" href="/auth/google" aria-disabled={checkingSession||undefined} aria-busy={checkingSession||undefined} onClick={event=>{if(checkingSession)event.preventDefault();}}>
          <Image src="/assets/welcome/google.svg" alt="" width={118} height={120}/>
          <span>{t('Continue with Google','Đăng nhập bằng Google')}</span>
        </a>
        <p className="welcome-account-note"><LockKeyhole size={20} aria-hidden="true"/><span>{t('Your adventure, saved to your account.','Hành trình được lưu vào tài khoản của bạn.')}<br/>{t('No password needed.','Không cần tạo mật khẩu.')}</span></p>
        <ul className="welcome-features" aria-label={t('Your ATLAS adventure','Hành trình ATLAS của bạn')}>
          <li><MapPinned aria-hidden="true"/><span>{t('Explore','Khám phá')}</span></li>
          <li><GraduationCap aria-hidden="true"/><span>{t('Learn','Học hỏi')}</span></li>
          <li><Compass aria-hidden="true"/><span>{t('Collect','Sưu tầm')}</span></li>
        </ul>
      </main>
      <p className="welcome-art-caption">{t('ONE WORLD. ENDLESS ADVENTURES.','MỘT THẾ GIỚI. VÔ VÀN HÀNH TRÌNH.')}<span/></p>
    </div>
    <footer className="welcome-footer"><p>{t('Learn at your pace. Keep every discovery.','Học theo nhịp của bạn. Giữ lại mọi khám phá.')}</p><div><WelcomeInformation kind="privacy"/><span aria-hidden="true">|</span><WelcomeInformation kind="terms"/></div></footer>
  </div>;
}
