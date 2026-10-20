'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { atlasApi, AtlasApiError } from './chapter-types';
import type { PlayerProfile, ProfilePatch } from '../../lib/atlas/profile';

export function useAccountProfile(enabled: boolean, onPreferences: (profile: PlayerProfile) => void) {
  const [result, setResult] = useState<{ key: string; profile: PlayerProfile | null; error: string; errorCode?: string } | null>(null);
  const [saving, setSaving] = useState(false), [saveError, setSaveError] = useState('');
  const [retry, setRetry] = useState(0);
  const key = `${enabled}:${retry}`;
  const locked = useRef(false), generation = useRef(0);
  useEffect(() => {
    const current = ++generation.current;
    if (!enabled) return;
    let active = true;
    atlasApi<{ profile: PlayerProfile }>('profile').then(({ profile: next }) => {
      if (active && generation.current === current) { setResult({ key, profile: next, error: '' }); onPreferences(next); }
    }).catch(error => { if (active) setResult({ key, profile: null, error: error.message, errorCode: error instanceof AtlasApiError ? error.code : undefined }); });
    return () => { active = false; };
  }, [enabled, key, onPreferences]);
  const save = useCallback(async (patch: ProfilePatch) => {
    if (!enabled || locked.current) return false;
    const current = generation.current;
    locked.current = true; setSaving(true); setSaveError('');
    try {
      const { profile: next } = await atlasApi<{ profile: PlayerProfile }>('profile', patch);
      if (current !== generation.current) return false;
      setResult({ key, profile: next, error: '' }); onPreferences(next); return true;
    } catch (error) { if (current === generation.current) setSaveError(error instanceof Error ? error.message : 'Please try again.'); return false; }
    finally { locked.current = false; setSaving(false); }
  }, [enabled, key, onPreferences]);
  const current = enabled && result?.key === key ? result : null;
  return { profile: current?.profile ?? null, loading: enabled && !current, saving, error: saveError || current?.error || '', errorCode: current?.errorCode, save, reload: () => { setSaveError(''); setRetry(value => value + 1); } };
}
