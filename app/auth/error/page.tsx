import Link from 'next/link';
import {LanguageToggle,UiText} from '../../components/Bilingual';
export default async function SignInError({searchParams}:{searchParams:Promise<{reason?:string}>}) {
  const unavailable=(await searchParams).reason==='unavailable';
  return <main className="auth-page"><section className="auth-gate" aria-labelledby="auth-error-title">
    <LanguageToggle/>
    <p><span className="pill purple"><UiText en="ATLAS · ACCOUNT" vi="ATLAS · TÀI KHOẢN"/></span></p>
    <h1 id="auth-error-title"><UiText en={unavailable?'Google sign-in will be ready soon.':'Let’s try signing in again.'} vi={unavailable?'Tính năng đăng nhập sắp sẵn sàng.':'Mình thử đăng nhập lại nhé.'}/></h1>
    <p><UiText en={unavailable?'We’re getting account sign-in ready. Please return shortly.':'The sign-in window may have closed, or your link may have expired. Your saved adventure has not been changed.'} vi={unavailable?'Tính năng đăng nhập đang được chuẩn bị. Bạn quay lại sau một chút nhé.':'Có thể cửa sổ đăng nhập đã đóng hoặc liên kết đã hết hạn. Tiến trình đã lưu của bạn vẫn được giữ.'}/></p>
    <a className="play-button purple" href="/auth/google"><UiText en="Try Google again" vi="Thử đăng nhập Google lại"/></a>
    <Link className="quiet-button" href="/"><UiText en="Back to ATLAS" vi="Về ATLAS"/></Link>
  </section></main>;
}
