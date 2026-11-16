'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle, ArrowDown, ArrowLeft, ArrowRight, ArrowUp,
  BookOpen, Check, MapPin, MessageCircle, RefreshCw,
  Search, Sparkles, Target, X,
} from 'lucide-react';

import type {
  Copy, CountryPack, EncounterProgress, Hotspot,
  TravelAction, TravelEncounter, TravelStep,
} from '../../../content/travel/types';
import type { ReadingBand } from '../../../content/english/chapter';
import { copy } from '../../../content/travel/japan';
import { useInterfaceLanguage } from '../Bilingual';
import { SaveWordButton, Pronunciation } from '../SavedVocabulary';
import { TravelCopy } from './TravelCopy';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface EncounterViewProps {
  pack:      CountryPack;
  encounter: TravelEncounter;
  progress:  EncounterProgress;
  vi:        boolean;
  band:      ReadingBand;
  busy:      boolean;
  feedback:  Copy | null;
  correct:   boolean;
  onAction:  (action: TravelAction, lookedUp?: boolean) => Promise<void>;
  onBack:    () => void;
  onNext:    () => void;
}

interface OrderErrors {
  dish: string | null;
  pref: string | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Compute per-field errors when an order submission is rejected. */
function computeOrderErrors(
  step: TravelStep & { kind: 'order' },
  band: ReadingBand,
  dish: string,
  preference: string,
  uiVi: boolean,
): OrderErrors {
  const objEn = (step.objective[band]?.en ?? '').toLowerCase();
  const objVi = (step.objective[band]?.vi ?? '').toLowerCase();

  const expectedDish = step.dishes.find(
    d => objEn.includes(d.name.en.toLowerCase()) || (d.name.vi && objVi.includes(d.name.vi.toLowerCase())),
  );
  const expectedPref = step.preferences.find(
    p => objEn.includes(p.text.en.toLowerCase()) || (p.text.vi && objVi.includes(p.text.vi.toLowerCase())),
  );

  let dishError: string | null = null;
  let prefError: string | null = null;

  // Validate dish: ONLY flag if dish was not chosen or does not match requirement
  if (expectedDish && dish !== expectedDish.id) {
    dishError = !dish
      ? (uiVi ? 'Vui lòng chọn món' : 'Please choose a dish')
      : (uiVi ? `Yêu cầu đề bài: "${expectedDish.name.vi}"` : `Required: "${expectedDish.name.en}"`);
  }

  // Validate preference: ONLY flag if preference was not chosen or does not match requirement
  if (expectedPref && preference !== expectedPref.id) {
    prefError = !preference
      ? (uiVi ? 'Vui lòng chọn yêu cầu' : 'Please choose a preference')
      : (uiVi ? `Yêu cầu đề bài: "${expectedPref.text.vi}"` : `Required: "${expectedPref.text.en}"`);
  }

  return { dish: dishError, pref: prefError };
}

const DIRECTION_CONTROLS = [
  { id: 'up',    Icon: ArrowUp,    text: copy('Straight', 'Thẳng') },
  { id: 'left',  Icon: ArrowLeft,  text: copy('Left', 'Trái') },
  { id: 'right', Icon: ArrowRight, text: copy('Right', 'Phải') },
  { id: 'down',  Icon: ArrowDown,  text: copy('Back', 'Quay lại') },
] as const;

function hotspotIcon(kind: Hotspot['kind']) {
  switch (kind) {
    case 'npc':         return <MessageCircle size={19} />;
    case 'destination': return <ArrowRight size={20} />;
    default:            return <Search size={18} />;
  }
}

/* ------------------------------------------------------------------ */
/*  FeedbackCard — identifies *who* said the feedback                  */
/* ------------------------------------------------------------------ */

function FeedbackCard({
  feedback, correct, encounter, location, vi, uiVi,
}: {
  feedback: Copy;
  correct:  boolean;
  encounter: TravelEncounter;
  location:  CountryPack['locations'][number];
  vi:   boolean;
  uiVi: boolean;
}) {
  /* --- Wrong answer ------------------------------------------------ */
  if (!correct) {
    return (
      <div className="travel-feedback retry" role="status">
        <div className="feedback-retry-header">
          <AlertCircle size={15} />
          <span>{uiVi ? 'Xem lại lựa chọn' : 'Check your answer'}</span>
        </div>
        <p><TravelCopy text={feedback} vi={vi} /></p>
      </div>
    );
  }

  /* --- NPC dialogue reply ------------------------------------------ */
  const dialogueStep = encounter.steps.find(
    s => s.kind === 'dialogue'
      && (['A1', 'A2', 'B1', 'B2'] as const).some(b => s.dialogue.reply[b]?.en === feedback.en),
  );

  if (dialogueStep && dialogueStep.kind === 'dialogue') {
    return (
      <div className="travel-feedback positive travel-feedback-dialogue" role="status">
        <div className="feedback-dialogue-header">
          <div className="feedback-npc-avatar">
            {dialogueStep.dialogue.speaker[0]}
          </div>
          <div className="feedback-dialogue-meta">
            <strong>{dialogueStep.dialogue.speaker}</strong>
            <small>{uiVi ? 'Người phục vụ / Trả lời' : 'Server · Response'}</small>
          </div>
          <span className="feedback-dialogue-badge">
            <MessageCircle size={12} />
            {uiVi ? 'Lời thoại' : 'Dialogue'}
          </span>
        </div>
        <blockquote className="feedback-dialogue-quote">
          &ldquo;<TravelCopy text={feedback} vi={vi} />&rdquo;
        </blockquote>
        <div className="feedback-dialogue-tip">
          <Sparkles size={13} />
          <span>
            {uiVi
              ? 'Gợi ý: Dùng thông tin trên để làm tiếp các bước sau'
              : 'Clue: Use this detail for the next steps'}
          </span>
        </div>
      </div>
    );
  }

  /* --- Hotspot / scene object discovery ----------------------------- */
  const hotspot = location.hotspots.find(
    h => h.description.en === feedback.en || h.description.vi === feedback.vi,
  );

  if (hotspot) {
    return (
      <div className="travel-feedback positive travel-feedback-discovery" role="status">
        <div className="feedback-dialogue-header">
          <div className="feedback-npc-avatar" style={{ background: '#0d9488' }}>
            <Search size={15} />
          </div>
          <div className="feedback-dialogue-meta">
            <strong><TravelCopy text={hotspot.label} vi={vi} /></strong>
            <small>{uiVi ? 'Ghi chép quan sát' : 'Observed scene clue'}</small>
          </div>
        </div>
        <p className="feedback-discovery-text">
          <TravelCopy text={feedback} vi={vi} />
        </p>
      </div>
    );
  }

  /* --- Generic correct feedback ------------------------------------ */
  return (
    <div className="travel-feedback positive" role="status">
      <div className="feedback-dialogue-header">
        <div className="feedback-npc-avatar" style={{ background: '#16a34a' }}>
          <Check size={16} />
        </div>
        <div className="feedback-dialogue-meta">
          <strong>{uiVi ? 'Chính xác!' : 'Good job!'}</strong>
        </div>
      </div>
      <p><TravelCopy text={feedback} vi={vi} /></p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step sub-components                                                */
/* ------------------------------------------------------------------ */

function InspectStep({
  object, pack, step, vi,
}: {
  object: Hotspot | null;
  pack: CountryPack;
  step: TravelStep;
  vi: boolean;
}) {
  if (step.kind !== 'inspect' && step.kind !== 'target') return null;
  return (
    <>
      {object && (
        <div className="travel-object-note">
          <strong><TravelCopy text={object.label} vi={vi} /></strong>
          <p><TravelCopy learning text={object.description} vi={vi} /></p>
          {object.sourceIds.map(id => {
            const source = pack.sources.find(s => s.id === id);
            return source
              ? <a key={id} href={source.url} target="_blank" rel="noopener noreferrer">{source.organization} ↗</a>
              : null;
          })}
        </div>
      )}
      <p className="travel-small">
        <TravelCopy
          text={copy(
            'Explore the glowing scene markers, or use the object buttons under the picture.',
            'Khám phá các điểm sáng trong cảnh hoặc dùng nút đồ vật bên dưới ảnh.',
          )}
          vi={vi}
        />
      </p>
    </>
  );
}

function DialogueStep({
  step, dialogueOpen, setDialogueOpen, vi, uiVi, band, busy, send,
}: {
  step: TravelStep & { kind: 'dialogue' };
  dialogueOpen: boolean;
  setDialogueOpen: (open: boolean) => void;
  vi: boolean;
  uiVi: boolean;
  band: ReadingBand;
  busy: boolean;
  send: (action: TravelAction) => void;
}) {
  if (!dialogueOpen) {
    return (
      <button className="travel-primary" disabled={busy} onClick={() => setDialogueOpen(true)}>
        <MessageCircle size={18} />
        <TravelCopy
          text={copy(`Talk to ${step.dialogue.speaker}`, `Nói chuyện với ${step.dialogue.speaker}`)}
          vi={vi}
        />
      </button>
    );
  }

  return (
    <div className="travel-dialogue">
      <div className="npc-avatar">{step.dialogue.speaker[0]}</div>
      <span className="travel-overline">{step.dialogue.speaker}</span>
      <p className="npc-line">
        <TravelCopy learning text={step.dialogue.prompt[band]} vi={vi} />
      </p>
      <p className="travel-small">
        {uiVi ? 'Bạn sẽ nói gì?' : 'What would you say?'}
      </p>
      {step.dialogue.responses.map(r => (
        <button
          type="button"
          key={r.id}
          disabled={busy}
          onClick={() => void send({ kind: 'say', choice: r.id })}
        >
          <TravelCopy learning text={r.text[band]} vi={vi} />
          <ArrowRight size={15} />
        </button>
      ))}
    </div>
  );
}

function RouteStep({
  step, position, progress, vi, uiVi, band, busy, send,
}: {
  step: TravelStep & { kind: 'route' };
  position: [number, number];
  progress: EncounterProgress;
  vi: boolean;
  uiVi: boolean;
  band: ReadingBand;
  busy: boolean;
  send: (action: TravelAction) => void;
}) {
  const { grid } = step;
  const cellCount = grid.width * grid.height;

  return (
    <div className="travel-route">
      <p><TravelCopy learning text={step.instruction[band]} vi={vi} /></p>

      <div
        className="neighborhood-grid"
        style={{ gridTemplateColumns: `repeat(${grid.width}, 1fr)` }}
        aria-label="Fictional neighborhood route map"
      >
        {Array.from({ length: cellCount }, (_, i) => {
          const x = i % grid.width;
          const y = Math.floor(i / grid.width);
          const here = position[0] === x && position[1] === y;
          const goal = grid.goal[0] === x && grid.goal[1] === y;

          return (
            <span key={i} className={here ? 'is-here' : goal ? 'route-goal' : ''}>
              {here ? '●' : goal ? '▤' : (x + y) % 3 === 0 ? '⌂' : '·'}
              {goal && <small><TravelCopy text={grid.goalLabel} vi={vi} /></small>}
            </span>
          );
        })}
      </div>

      <p className="travel-small">
        {uiVi
          ? 'Vị trí của bạn: chấm tím. Bản đồ luyện tập hư cấu.'
          : 'You are the purple dot. This is a fictional practice map.'}
      </p>

      <div className="route-controls">
        {DIRECTION_CONTROLS.map(({ id, Icon, text }) => (
          <button
            key={id}
            disabled={busy}
            onClick={() => void send({
              kind: 'move',
              direction: id as 'up' | 'right' | 'left' | 'down',
              expectedMove: progress.routeIndex,
            })}
          >
            <Icon size={19} />
            <TravelCopy text={text} vi={vi} />
          </button>
        ))}
      </div>
    </div>
  );
}

function OrderStep({
  step, dish, setDish, preference, setPreference, errors,
  dishRef, prefRef, containerRef, vi, uiVi, busy, onSubmit,
}: {
  step: TravelStep & { kind: 'order' };
  dish: string;
  setDish: (v: string) => void;
  preference: string;
  setPreference: (v: string) => void;
  errors: OrderErrors;
  dishRef: React.RefObject<HTMLSelectElement | null>;
  prefRef: React.RefObject<HTMLSelectElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  vi: boolean;
  uiVi: boolean;
  busy: boolean;
  onSubmit: (dish: string, preference: string) => void;
}) {
  const selectedDish = step.dishes.find(d => d.id === dish);
  const selectedPref = step.preferences.find(p => p.id === preference);

  return (
    <div ref={containerRef} className="travel-order">
      {/* Inline selectors */}
      <div className="travel-order-fields">
        {/* Dish selector */}
        <div className="travel-order-field">
          <label className={errors.dish ? 'has-error' : ''}>
            <TravelCopy text={copy('Your bowl', 'Món của bạn')} vi={vi} />
            <select
              ref={dishRef}
              className={errors.dish ? 'has-error' : ''}
              value={dish}
              onChange={e => setDish(e.target.value)}
              disabled={busy}
            >
              <option value="">{uiVi ? 'Chọn món…' : 'Choose a dish…'}</option>
              {step.dishes.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name.en}{uiVi ? ` · ${d.name.vi}` : ''}
                </option>
              ))}
            </select>
          </label>
          {errors.dish && (
            <span className="travel-field-error" role="alert">
              <AlertCircle size={13} />
              <span>{errors.dish}</span>
            </span>
          )}
          {selectedDish && (
            <p className="travel-small order-ingredients">
              <TravelCopy text={selectedDish.ingredients} vi={vi} />
            </p>
          )}
        </div>

        {/* Preference selector */}
        <div className="travel-order-field">
          <label className={errors.pref ? 'has-error' : ''}>
            <TravelCopy text={copy('Your preference', 'Yêu cầu của bạn')} vi={vi} />
            <select
              ref={prefRef}
              className={errors.pref ? 'has-error' : ''}
              value={preference}
              onChange={e => setPreference(e.target.value)}
              disabled={busy}
            >
              <option value="">{uiVi ? 'Chọn yêu cầu…' : 'Choose a preference…'}</option>
              {step.preferences.map(p => (
                <option key={p.id} value={p.id}>
                  {p.text.en}{uiVi ? ` · ${p.text.vi}` : ''}
                </option>
              ))}
            </select>
          </label>
          {errors.pref && (
            <span className="travel-field-error" role="alert">
              <AlertCircle size={13} />
              <span>{errors.pref}</span>
            </span>
          )}
        </div>
      </div>

      {/* Live preview sentence */}
      <blockquote lang="en">
        I&apos;d like a bowl of {selectedDish?.name.en ?? '…'}, {selectedPref?.text.en ?? '…'}, please.
      </blockquote>

      <button
        className="travel-primary"
        disabled={busy || !dish || !preference}
        onClick={() => onSubmit(dish, preference)}
      >
        <TravelCopy text={copy('Place my order', 'Gửi lời gọi món')} vi={vi} />
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

function ComposeStep({
  step, tiles, setTiles, vi, uiVi, busy, send,
}: {
  step: TravelStep & { kind: 'compose' };
  tiles: string[];
  setTiles: React.Dispatch<React.SetStateAction<string[]>>;
  vi: boolean;
  uiVi: boolean;
  busy: boolean;
  send: (action: TravelAction) => void;
}) {
  const removeTile = (index: number) => setTiles(v => v.filter((_, n) => n !== index));
  const addTile    = (id: string)    => setTiles(v => [...v, id]);

  return (
    <div className="travel-compose">
      <div className="sentence-slots" aria-live="polite">
        {tiles.length
          ? tiles.map((t, i) => {
              const tile = step.tiles.find(x => x.id === t)!;
              return (
                <button key={t} disabled={busy} aria-label={`Remove ${tile.text}`} onClick={() => removeTile(i)}>
                  {tile.text}<X size={12} />
                </button>
              );
            })
          : <span>{uiVi ? 'Chạm các mảnh để ghép câu.' : 'Tap the pieces to build your sentence.'}</span>
        }
      </div>

      <div className="word-tiles">
        {step.tiles.map(t => (
          <button key={t.id} disabled={busy || tiles.includes(t.id)} onClick={() => addTile(t.id)}>
            {t.text}
          </button>
        ))}
      </div>

      <button
        className="travel-primary"
        disabled={busy || tiles.length !== step.tiles.length}
        onClick={() => void send({ kind: 'compose', tiles })}
      >
        <TravelCopy text={copy('Share my visit', 'Kể về chuyến tham quan')} vi={vi} />
        <ArrowRight size={16} />
      </button>

      <button
        className="travel-quiet"
        disabled={busy || !tiles.length}
        onClick={() => setTiles([])}
      >
        <RefreshCw size={14} />
        <TravelCopy text={copy('Start sentence again', 'Ghép câu lại')} vi={vi} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Completion card                                                    */
/* ------------------------------------------------------------------ */

function CompletionCard({
  encounter, vi, busy, send, onNext,
}: {
  encounter: TravelEncounter;
  vi: boolean;
  busy: boolean;
  send: (action: TravelAction) => void;
  onNext: () => void;
}) {
  return (
    <div className="travel-completion">
      <span className="travel-stamp-mini">✦</span>
      <h3>
        <TravelCopy text={copy('A new story in your passport.', 'Thêm một câu chuyện trong hộ chiếu.')} vi={vi} />
      </h3>
      <p><TravelCopy text={encounter.stamp.name} vi={vi} /></p>
      <p className="travel-small">
        <TravelCopy
          text={copy(
            'First-clear XP and your stamp are saved by the server. Revisit freely without duplicate rewards.',
            'XP lần đầu và stamp đã được server lưu. Có thể xem lại, không nhận thưởng trùng.',
          )}
          vi={vi}
        />
      </p>
      <button className="travel-primary" disabled={busy} onClick={onNext}>
        <TravelCopy text={copy('Continue exploring', 'Tiếp tục khám phá')} vi={vi} />
        <ArrowRight size={18} />
      </button>
      <button className="travel-quiet" disabled={busy} onClick={() => void send({ kind: 'restart' })}>
        <RefreshCw size={15} />
        <TravelCopy text={copy('Revisit this stop', 'Xem lại điểm dừng')} vi={vi} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Word-help dialog                                                   */
/* ------------------------------------------------------------------ */

function WordHelpDialog({
  encounter, word, vi, uiVi, dialogRef, triggerRef,
}: {
  encounter: TravelEncounter;
  word: string | null;
  vi: boolean;
  uiVi: boolean;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const entry = encounter.vocabulary.find(e => e.word === word);
  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className="travel-word-dialog"
      aria-label={uiVi ? 'Từ vựng du lịch' : 'Travel word help'}
      onClose={() => triggerRef.current?.focus({ preventScroll: true })}
      onClick={e => { if (e.target === e.currentTarget) close(); }}
    >
      <button className="travel-dialog-close" type="button" aria-label={uiVi ? 'Đóng giải nghĩa' : 'Close word help'} onClick={close}>
        <X size={20} />
      </button>

      {entry && (
        <>
          <span className="travel-overline">YOUR TRAVEL ENGLISH</span>
          <h2>{entry.word}</h2>
          <Pronunciation word={entry.word} />

          {vi && (
            <>
              <h3 lang="vi">{entry.meaning}</h3>
              <p lang="vi">{entry.explanation}</p>
            </>
          )}

          <blockquote lang="en">{entry.example}</blockquote>
          {vi && <p lang="vi">{entry.exampleVi}</p>}

          <SaveWordButton lessonId={`travel:${encounter.id}`} version={1} word={entry.word} />
          <p className="travel-small">
            Cambridge IPA · {uiVi ? 'Mở nguồn để nghe phát âm gốc.' : 'Open the source to hear the original pronunciation.'}
          </p>
        </>
      )}
    </dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function TravelEncounterView({
  pack, encounter, progress, vi, band, busy,
  feedback, correct, onAction, onBack, onNext,
}: EncounterViewProps) {
  const { locale } = useInterfaceLanguage();
  const uiVi = locale === 'vi';

  // --- Derived data ---
  const location = pack.locations.find(l => l.id === encounter.locationId)!;
  const destination = pack.destinations.find(d => d.id === encounter.destinationId);
  const step = encounter.steps[progress.step];
  const complete = !step;

  // --- Local state ---
  const [object, setObject]           = useState<Hotspot | null>(null);
  const [word, setWord]               = useState<string | null>(null);
  const [dish, setDish]               = useState('');
  const [preference, setPreference]   = useState('');
  const [tiles, setTiles]             = useState<string[]>([]);
  const [dialogueOpen, setDialogueOpen] = useState(false);

  // --- Refs ---
  const lookedUp        = useRef(false);
  const headingRef      = useRef<HTMLHeadingElement>(null);
  const wordDialogRef   = useRef<HTMLDialogElement>(null);
  const wordTriggerRef  = useRef<HTMLButtonElement | null>(null);
  const dishRef         = useRef<HTMLSelectElement>(null);
  const prefRef         = useRef<HTMLSelectElement>(null);
  const orderRef        = useRef<HTMLDivElement>(null);

  // --- Helpers ---
  const send = (action: TravelAction) => onAction(action, lookedUp.current);

  const position: [number, number] =
    progress.position ?? (step?.kind === 'route' ? step.grid.start : [0, 0]);

  // --- Order validation ---
  const isOrderFailed = Boolean(feedback && !correct && step?.kind === 'order');

  // Compute errors: only flag a field if it is currently wrong or missing
  const orderErrors: OrderErrors =
    isOrderFailed && step?.kind === 'order'
      ? computeOrderErrors(step, band, dish, preference, uiVi)
      : { dish: null, pref: null };

  // --- Effects ---
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!isOrderFailed) return;

    // Trigger shake animation via class toggle.
    const el = orderRef.current;
    if (el) {
      el.classList.remove('shake-error');
      void el.offsetWidth; // force reflow to restart animation
      el.classList.add('shake-error');
    }

    // Focus on the first erroneous field.
    const target = orderErrors.dish ? dishRef.current : prefRef.current;
    target?.focus();
    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [feedback, isOrderFailed, orderErrors.dish, orderErrors.pref]);

  // --- Hotspot interaction ---
  function inspect(h: Hotspot) {
    setObject(h);
    if (h.kind === 'npc') {
      setDialogueOpen(true);
      return;
    }
    void send({ kind: step?.kind === 'target' ? 'target' : 'inspect', target: h.id });
  }

  function openWordHelp(w: string, trigger: HTMLButtonElement) {
    lookedUp.current = true;
    wordTriggerRef.current = trigger;
    setWord(w);
    wordDialogRef.current?.showModal();
  }

  // --- Render ---
  return (
    <section className="travel-encounter">
      {/* ---- Breadcrumb ---- */}
      <div className="travel-location-topline">
        <button className="travel-quiet" disabled={busy} onClick={onBack}>
          <ArrowLeft size={17} />
          <TravelCopy
            text={copy(`${destination?.name.en} trail`, `Hành trình ${destination?.name.vi}`)}
            vi={vi}
          />
        </button>
        <span className="travel-pill">
          {pack.country.name.en} / {encounter.destinationId.toUpperCase()}
        </span>
        <span className="travel-pill">
          {complete ? <Check size={15} /> : `${progress.step + 1}/${encounter.steps.length}`}
          {' '}{complete ? (uiVi ? 'Đã xong' : 'Complete') : (uiVi ? 'bước' : 'steps')}
        </span>
      </div>

      <div className="travel-play-layout">
        {/* ---- Scene column ---- */}
        <div className="travel-scene-column">
          {/* Scene image + hotspots */}
          <div className="travel-scene">
            <img
              src={location.scene}
              srcSet={`${location.scene.replace('.webp', '-768.webp')} 768w, ${location.scene} 1536w`}
              sizes="(max-width: 900px) 100vw, 900px"
              alt={`${location.name.en}. Illustrated fictional training environment; interactive objects have separate buttons.`}
              width={1536}
              height={1024}
            />
            <div className="scene-location-label">
              <MapPin size={14} />
              <TravelCopy text={location.name} vi={vi} />
            </div>
            {location.hotspots.map(h => (
              <button
                key={h.id}
                className={`travel-hotspot ${progress.seen.includes(h.id) ? 'seen' : ''}`}
                style={{ left: `${h.at[0]}%`, top: `${h.at[1]}%` }}
                disabled={busy || complete}
                aria-label={`${h.label.en}${uiVi ? ' · ' + h.label.vi : ''}`}
                onClick={() => inspect(h)}
              >
                <span>{hotspotIcon(h.kind)}</span>
                <small>{h.label.en}</small>
              </button>
            ))}
          </div>

          {/* Object button strip */}
          <div className="scene-object-strip" aria-label="Scene objects">
            {location.hotspots.map(h => (
              <button type="button" key={h.id} disabled={busy || complete} onClick={() => inspect(h)}>
                <TravelCopy text={h.label} vi={vi} />
                {progress.seen.includes(h.id) && <Check size={14} />}
              </button>
            ))}
          </div>

          <p className="travel-scene-note">
            <TravelCopy
              text={copy(
                'Illustrated training scene · invented people, venue and routes. Not a live navigation guide.',
                'Cảnh luyện tập minh họa · nhân vật, quán và tuyến đi hư cấu. Không dùng để dẫn đường thực tế.',
              )}
              vi={vi}
            />
          </p>

          {/* Vocabulary strip */}
          <div className="travel-word-strip">
            <BookOpen size={17} />
            {encounter.vocabulary.map(w => (
              <button type="button" key={w.word} onClick={e => openWordHelp(w.word, e.currentTarget)}>
                {w.word}
              </button>
            ))}
          </div>

          {/* Learn more */}
          <details className="travel-learn-more">
            <summary>
              <TravelCopy text={copy('Learn More · real places & sources', 'Tìm hiểu thêm · địa điểm thật và nguồn')} vi={vi} />
            </summary>
            <p>
              <TravelCopy
                text={copy(
                  'Facts about real places are linked below. Dialogue, route directions and the restaurant menu are fictional learning scenarios. No prices, schedules or entry rules are provided.',
                  'Nguồn dưới đây xác minh thông tin địa điểm thật. Hội thoại, chỉ đường và thực đơn là tình huống học hư cấu. Không cung cấp giá, lịch chạy hay quy định nhập cảnh.',
                )}
                vi={vi}
              />
            </p>
            {pack.sources
              .filter(s => encounter.sourceIds.includes(s.id))
              .map(s => (
                <p key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.organization} · {s.title} ↗
                  </a>
                  <small>
                    {uiVi ? 'Kiểm tra:' : 'Verified:'} {s.verifiedAt} ·{' '}
                    {uiVi ? 'Ngày xuất bản không được ghi rõ' : 'Publication date not stated'}
                  </small>
                </p>
              ))}
            <p>
              <TravelCopy
                text={copy(
                  'Original AI-generated scene illustrations for ATLAS; not photographs or exact architectural reproductions. See asset credits in your passport.',
                  'Tranh bối cảnh tạo riêng cho ATLAS bằng AI; không phải ảnh hay bản sao kiến trúc chính xác. Xem nguồn hình trong hộ chiếu.',
                )}
                vi={vi}
              />
            </p>
          </details>
        </div>

        {/* ---- Interaction panel ---- */}
        <aside
          className={`travel-interaction-panel ${dialogueOpen ? 'dialogue-open' : ''}`}
          aria-label="Current travel activity"
        >
          <span className="travel-overline">YOUR LITTLE ADVENTURE</span>
          <h2 ref={headingRef} tabIndex={-1}>
            <TravelCopy text={encounter.title} vi={vi} />
          </h2>

          {feedback && (
            <FeedbackCard
              feedback={feedback}
              correct={correct}
              encounter={encounter}
              location={location}
              vi={vi}
              uiVi={uiVi}
            />
          )}

          {complete ? (
            <CompletionCard encounter={encounter} vi={vi} busy={busy} send={send} onNext={onNext} />
          ) : (
            <>
              {/* Current goal - Quest card */}
              <div className="travel-objective" role="region" aria-label={uiVi ? 'Mục tiêu hiện tại' : 'Current goal'}>
                <div className="travel-objective-badge">
                  <Target size={13} className="objective-icon" />
                  <span>{uiVi ? 'Mục tiêu hiện tại' : 'Current goal'}</span>
                </div>
                <div className="travel-objective-body">
                  <p><TravelCopy text={step.objective[band]} vi={vi} /></p>
                </div>
              </div>

              {/* Step-specific interaction */}
              <InspectStep object={object} pack={pack} step={step} vi={vi} />

              {step.kind === 'dialogue' && (
                <DialogueStep
                  step={step}
                  dialogueOpen={dialogueOpen}
                  setDialogueOpen={setDialogueOpen}
                  vi={vi} uiVi={uiVi} band={band} busy={busy} send={send}
                />
              )}

              {step.kind === 'route' && (
                <RouteStep step={step} position={position} progress={progress} vi={vi} uiVi={uiVi} band={band} busy={busy} send={send} />
              )}

              {step.kind === 'order' && (
                <OrderStep
                  step={step}
                  dish={dish} setDish={setDish}
                  preference={preference} setPreference={setPreference}
                  errors={orderErrors}
                  dishRef={dishRef} prefRef={prefRef} containerRef={orderRef}
                  vi={vi} uiVi={uiVi} busy={busy}
                  onSubmit={(d, p) => void send({ kind: 'order', dish: d, preference: p })}
                />
              )}

              {step.kind === 'compose' && (
                <ComposeStep step={step} tiles={tiles} setTiles={setTiles} vi={vi} uiVi={uiVi} busy={busy} send={send} />
              )}
            </>
          )}

          {busy && (
            <p role="status" className="travel-small">
              {uiVi ? 'Đang lưu…' : 'Saving…'}
            </p>
          )}
        </aside>
      </div>

      {/* ---- Word help dialog ---- */}
      <WordHelpDialog
        encounter={encounter}
        word={word}
        vi={vi}
        uiVi={uiVi}
        dialogRef={wordDialogRef}
        triggerRef={wordTriggerRef}
      />
    </section>
  );
}
