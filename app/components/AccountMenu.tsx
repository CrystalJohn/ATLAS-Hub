'use client';
import { useRef, useState } from 'react';
import { Dialog, DropdownMenu } from 'radix-ui';
import { Check, ChevronDown, Landmark, LogOut, Plane, Settings, TreePine, UserRound, Utensils, X } from 'lucide-react';
import {explorationInterests,type ExplorationInterest} from '../../content/interests';
import { readingBands } from '../../content/english/chapter';
import { playerInitials, playerName, type PlayerProfile } from '../../lib/atlas/profile';
import {useInterfaceLanguage} from './Bilingual';
import {AdventureRecovery} from './AdventureRecovery';
import type { useAccountProfile } from './useAccountProfile';

type Account = ReturnType<typeof useAccountProfile>;
function Avatar({ profile }: { profile: PlayerProfile }) {
  const [failed, setFailed] = useState<string | null>(null);
  return <span className="account-avatar" aria-hidden="true">{profile.avatarUrl && failed !== profile.avatarUrl
    ? <img src={profile.avatarUrl} alt="" width={36} height={36} referrerPolicy="no-referrer" onError={() => setFailed(profile.avatarUrl)}/>
    : playerInitials(profile.displayName)}</span>;
}

const interestIcons={nature:TreePine,travel:Plane,food:Utensils,culture:Landmark};
function InterestPicker({value,onChange,disabled}:{value:ExplorationInterest[];onChange:(value:ExplorationInterest[])=>void;disabled:boolean}){
 const {t}=useInterfaceLanguage();
 return <fieldset className="exploration-picker" disabled={disabled}><legend>{t('What do you like exploring?','Bạn thích khám phá điều gì?')}</legend><p className="interest-picker-hint">{t('Choose any topics or skip. You can change these in Profile.','Chọn nhiều chủ đề hoặc bỏ qua. Có thể đổi trong Hồ sơ.')}</p><div className="interest-options">{explorationInterests.map(interest=>{const selected=value.includes(interest.id),Icon=interestIcons[interest.id];return <button type="button" key={interest.id} aria-pressed={selected} onClick={()=>onChange(selected?value.filter(id=>id!==interest.id):[...value,interest.id])}><Icon size={20} aria-hidden="true"/><span>{t(interest.en,interest.vi)}</span><span className="interest-check" aria-hidden="true">{selected&&<Check size={13}/>}</span></button>;})}</div></fieldset>;
}

function ProfileForm({ account, onboarding, settings, onDone }: { account: Account; onboarding: boolean; settings: boolean; onDone: () => void }) {
  const {t}=useInterfaceLanguage();
  const profile = account.profile!;
  const [name, setName] = useState(profile.displayName ?? ''), [band, setBand] = useState(profile.readingBand), [vi, setVi] = useState(profile.vietnameseSupport);
  const [interests,setInterests]=useState<ExplorationInterest[]>(profile.interests??[]);
  const [validation, setValidation] = useState(''), [saved, setSaved] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return <form className="account-form" onSubmit={async event => {
    event.preventDefault(); setSaved(false);
    const parsed = playerName.safeParse(name);
    if (!settings && !parsed.success) { setValidation(t(parsed.error.issues[0].message)); input.current?.focus(); return; }
    setValidation('');
    const interestsChanged=[...interests].sort().join(',')!==[...(profile.interests??[])].sort().join(',');
    const ok = await account.save(settings ? { readingBand: band, vietnameseSupport: vi } : { displayName: parsed.success ? parsed.data : name, ...(interestsChanged ? { interests } : {}) });
    if (ok) { if (onboarding) onDone(); else setSaved(true); }
  }}>
    {!settings && <>{!onboarding&&<div className="account-identity"><Avatar profile={profile}/><p>{t('Your explorer identity','Tên hiển thị trong hành trình của bạn')}</p></div>}<label htmlFor="player-name">{t('Player name','Tên người chơi')}</label><input ref={input} id="player-name" name="displayName" value={name} maxLength={40} autoComplete="nickname" required aria-invalid={!!validation} aria-describedby={`name-hint${validation?' name-error':''}`} disabled={account.saving} onChange={event => { setName(event.target.value); setSaved(false); setValidation(''); }}/><p id="name-hint" className="micro-copy">{t('1–40 characters. You can change this later.','Từ 1–40 ký tự. Có thể sửa lại sau.')}</p>{validation&&<p id="name-error" role="alert">{validation}</p>}<InterestPicker value={interests} disabled={account.saving} onChange={next=>{setInterests(next);setSaved(false);}}/></>}
    {settings && <fieldset disabled={account.saving}><legend>{t('Reading & language support','Bài đọc & hỗ trợ ngôn ngữ')}</legend><label className="account-support"><input type="checkbox" checked={vi} onChange={event => { setVi(event.target.checked); setSaved(false); }}/><span>{t('Vietnamese learning support','Hỗ trợ tiếng Việt trong bài học')}</span></label><label htmlFor="account-reading">{t('Reading target','Mức độ bài đọc')}</label><select id="account-reading" value={band} onChange={event => { setBand(event.target.value as PlayerProfile['readingBand']); setSaved(false); }}>{readingBands.map(value => <option key={value}>{value}</option>)}</select><p className="micro-copy">{t('Choose the text difficulty you want to practise. This is not a proficiency assessment.','Chọn độ khó bài đọc để luyện tập. Đây không phải đánh giá trình độ.')}</p></fieldset>}
    {account.error && <p role="alert" className="account-error">{t(account.error)}</p>}
    {saved && <p role="status" className="account-saved">{t('Saved to your account.','Đã lưu vào tài khoản.')}</p>}
    <button className="play-button purple" disabled={account.saving} type="submit">{account.saving ? t('Saving…','Đang lưu…') : onboarding ? t('Begin my adventure','Bắt đầu khám phá') : t('Save changes','Lưu thay đổi')}</button>
  </form>;
}

export function AccountMenu({ account, busy }: { account: Account; busy: boolean }) {
  const {t}=useInterfaceLanguage();
  const [panel, setPanel] = useState<'profile' | 'settings' | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const logout = useRef<HTMLFormElement>(null);
  const profile = account.profile;
  if (!profile?.displayName) return null;
  return <><form ref={logout} action="/auth/logout" method="post" hidden/><DropdownMenu.Root><DropdownMenu.Trigger asChild><button ref={trigger} className="account-trigger" disabled={busy || account.saving} aria-label={`Account: ${profile.displayName}`}><Avatar profile={profile}/><span className="account-player-name">{profile.displayName}</span><ChevronDown size={15}/></button></DropdownMenu.Trigger><DropdownMenu.Portal><DropdownMenu.Content className="account-dropdown" sideOffset={8} align="end"><DropdownMenu.Label className="account-menu-label">{t('Account','Tài khoản')}</DropdownMenu.Label><DropdownMenu.Item onSelect={() => setPanel('profile')}><UserRound size={17}/> {t('Profile','Hồ sơ')}</DropdownMenu.Item><DropdownMenu.Item onSelect={() => setPanel('settings')}><Settings size={17}/> {t('Settings','Cài đặt')}</DropdownMenu.Item><DropdownMenu.Separator/><DropdownMenu.Item onSelect={() => logout.current?.requestSubmit()}><LogOut size={17}/> {t('Sign out','Đăng xuất')}</DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root>
    <Dialog.Root open={panel !== null} onOpenChange={open => { if (!open && !account.saving) setPanel(null); }}><Dialog.Portal><Dialog.Overlay className="account-overlay"/><Dialog.Content className="account-dialog" onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus(); }} onEscapeKeyDown={event => { if (account.saving) event.preventDefault(); }} onInteractOutside={event => { if (account.saving) event.preventDefault(); }}><Dialog.Title>{panel === 'settings' ? t('Settings','Cài đặt') : t('Profile','Hồ sơ')}</Dialog.Title><Dialog.Description>{panel === 'settings' ? t('Make your learning trail feel right for you.','Điều chỉnh tùy chọn học tập của bạn.') : t('Make your explorer profile your own.','Chọn tên và sở thích cho hành trình của bạn.')}</Dialog.Description><Dialog.Close className="account-close" aria-label={t('Close account panel','Đóng bảng tài khoản')} disabled={account.saving}><X size={21}/></Dialog.Close>{panel && <ProfileForm key={panel} account={account} onboarding={false} settings={panel === 'settings'} onDone={() => setPanel(null)}/>}</Dialog.Content></Dialog.Portal></Dialog.Root>
  </>;
}

export function AccountSetup({ account }: { account: Account }) {
  const {t}=useInterfaceLanguage();
  if (account.loading) return <section className="auth-gate" aria-live="polite"><h1>{t('Getting your profile ready…','Đang tải hồ sơ của bạn…')}</h1></section>;
  if (!account.profile) return <AdventureRecovery code={account.errorCode} retrying={account.loading} onRetry={account.reload} signedIn/>;
  return <section className="auth-gate account-onboarding" aria-labelledby="onboarding-title"><span className="pill purple">{t('WELCOME TO ATLAS','CHÀO MỪNG ĐẾN ATLAS')}</span><h1 id="onboarding-title">{t('What should we call you?','Bạn muốn được gọi là gì?')}</h1><p>{t('Your adventure starts with a name.','Đặt tên để bắt đầu hành trình của bạn.')}</p><ProfileForm account={account} onboarding settings={false} onDone={() => {}}/><form action="/auth/logout" method="post"><button className="quiet-button" disabled={account.saving}>{t('Sign out','Đăng xuất')}</button></form></section>;
}
