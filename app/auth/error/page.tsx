import Link from 'next/link';
export default async function SignInError({searchParams}:{searchParams:Promise<{reason?:string}>}) {
  const unavailable=(await searchParams).reason==='unavailable';
  return <main className="auth-page"><section className="auth-gate" aria-labelledby="auth-error-title">
    <span className="pill purple">ATLAS · ACCOUNT</span>
    <h1 id="auth-error-title">{unavailable?'Google sign-in will be ready soon.':'Let’s try signing in again.'}</h1>
    <p>{unavailable?'We’re getting account sign-in ready. Please return shortly.':'The sign-in window may have closed, or your link may have expired. Your saved adventure has not been changed.'}</p>
    <p lang="vi">{unavailable?'Tính năng đăng nhập đang được chuẩn bị. Bạn quay lại sau một chút nhé.':'Có thể cửa sổ đăng nhập đã đóng hoặc liên kết đã hết hạn. Tiến trình đã lưu của bạn vẫn được giữ.'}</p>
    <a className="play-button purple" href="/auth/google">Try Google again <span lang="vi">· Thử lại</span></a>
    <Link className="quiet-button" href="/">Back to ATLAS</Link>
  </section></main>;
}
