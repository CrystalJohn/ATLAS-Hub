import { Compass } from 'lucide-react';
export function AuthGate({ provider, vietnamese }: { provider: 'google' | 'chatgpt'; vietnamese: boolean }) {
  const google = provider === 'google';
  return <section className="auth-gate" aria-labelledby="sign-in-title">
    <span className="auth-compass" aria-hidden="true"><Compass size={48}/></span>
    <span className="pill purple">YOUR NEXT ADVENTURE</span>
    <h1 id="sign-in-title">A world to explore.<br/>A place to call yours.</h1>
    <p>Sign in to save your discoveries, collect travel stamps, and continue your adventure when you return.</p>
    {vietnamese && <p lang="vi">Đăng nhập để lưu hành trình, sưu tầm dấu hộ chiếu và tiếp tục khám phá khi quay lại.</p>}
    <a className="play-button purple" href={google ? '/auth/google' : '/signin-with-chatgpt?return_to=%2F'}>
      Continue with {google ? 'Google' : 'ChatGPT'}
      {vietnamese && <span lang="vi">Đăng nhập bằng {google ? 'Google' : 'ChatGPT'}</span>}
    </a>
    <p className="micro-copy">No password to create.{vietnamese && <span lang="vi"> Không cần tạo mật khẩu.</span>}</p>
    {google && <p className="micro-copy">Google profiles begin a new adventure. Progress from the original pilot stays on the original site.
      {vietnamese && <span lang="vi"> Tài khoản Google bắt đầu hành trình mới. Tiến trình bản thử nghiệm cũ vẫn được giữ trên site cũ.</span>}
    </p>}
  </section>;
}
