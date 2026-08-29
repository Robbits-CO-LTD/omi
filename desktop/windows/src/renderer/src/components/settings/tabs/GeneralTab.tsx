import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Languages,
  MessageSquarePlus,
  MessagesSquare,
  Mic,
  Monitor,
  Power,
  Presentation,
  ScanEye,
  Zap
} from 'lucide-react'
import type { MeetingMode, RewindSettings } from '../../../../../shared/types'
import { getPreferences, onPreferencesChange, setPreferences } from '../../../lib/preferences'
import { SettingRow } from '../SettingRow'
import { Toggle } from '../Toggle'
import { FontSizeCard } from '../FontSizeCard'
import { useI18n } from '../../../lib/i18n'

export function GeneralTab(): React.JSX.Element {
  const [chatHistoryMode, setChatHistoryMode] = useState(getPreferences().chatHistoryMode)
  const { t } = useI18n()

  return (
    <>
      <UiLanguageRow />
      {/* macOS General leads with the capture-status cards (spec §3.1). */}
      <ScreenCaptureRow />
      <AudioRecordingRow />
      <ActionAutomationRow />
      <ScreenAnalysisRow />
      <SettingRow
        icon={MessagesSquare}
        title={t('settings.general.chatHistory')}
        subtitle={t('settings.general.chatHistorySubtitle')}
        keywords="conversation thread floating bar history infinite"
        control={
          <select
            value={chatHistoryMode}
            onChange={(e) => {
              const v = e.target.value as 'per-launch' | 'infinite'
              setChatHistoryMode(v)
              setPreferences({ chatHistoryMode: v })
            }}
            className="rounded-md bg-white/10 px-2 py-1.5 text-sm text-white focus:outline-none"
          >
            <option value="infinite" className="bg-neutral-900">
              {t('settings.general.chatHistoryInfinite')}
            </option>
            <option value="per-launch" className="bg-neutral-900">
              {t('settings.general.chatHistoryPerLaunch')}
            </option>
          </select>
        }
      />
      <MultiChatRow />
      <LegacyHomeRow />
      <MeetingDetectionRow />
      <LaunchAtLoginRow />
      <FontSizeCard />
    </>
  )
}

function UiLanguageRow(): React.JSX.Element {
  const { language, setLanguage, t } = useI18n()

  return (
    <SettingRow
      icon={Languages}
      title={t('settings.uiLanguage.title')}
      subtitle={t('settings.uiLanguage.subtitle')}
      keywords="interface language English Japanese UI 日本語 英語 表示言語"
      control={
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value as 'en' | 'ja')}
          aria-label={t('settings.uiLanguage.title')}
          className="rounded-md bg-white/10 px-2 py-1.5 text-sm text-white focus:outline-none"
        >
          <option value="en" className="bg-neutral-900">
            {t('settings.uiLanguage.english')}
          </option>
          <option value="ja" className="bg-neutral-900">
            {t('settings.uiLanguage.japanese')}
          </option>
        </select>
      }
    />
  )
}

function ActionAutomationRow(): React.JSX.Element {
  const { t } = useI18n()
  const automationAvailable = window.omi.automationEnabled
  const [autoConsent, setAutoConsent] = useState<boolean>(!!getPreferences().automationConsentedAt)
  const toggleAutomation = (on: boolean): void => {
    setAutoConsent(on)
    setPreferences({ automationConsentedAt: on ? Date.now() : undefined })
  }

  return (
    <SettingRow
      icon={Zap}
      dot={automationAvailable && autoConsent ? 'on' : 'off'}
      title={t('settings.general.automation')}
      subtitle={
        !automationAvailable
          ? t('settings.general.automationDisabled')
          : autoConsent
            ? t('settings.general.automationOn')
            : t('settings.general.automationOff')
      }
      keywords="automation actions desktop control agent take action flaui approve"
      control={
        <Toggle
          on={automationAvailable && autoConsent}
          onChange={toggleAutomation}
          disabled={!automationAvailable}
          label={t('settings.general.automation')}
        />
      }
    />
  )
}

// Screen Capture status card (macOS General §3.1). Mirrors the Sidebar's "Screen
// recording" toggle: both bind to the persistent Rewind `captureEnabled` setting.
// We subscribe to the `rewind:settings` broadcast so flipping the switch in the
// Sidebar (or another window) live-updates this card without a refetch.
function ScreenCaptureRow(): React.JSX.Element {
  const { t } = useI18n()
  const [rewind, setRewind] = useState<RewindSettings | null>(null)

  useEffect(() => {
    void window.omi?.rewindGetSettings?.().then(setRewind)
    return window.omi?.onRewindSettings?.(setRewind)
  }, [])

  const on = !!rewind?.captureEnabled
  const change = (next: boolean): void => {
    if (!rewind) return
    const updated = { ...rewind, captureEnabled: next }
    setRewind(updated) // optimistic
    void window.omi?.rewindSetSettings?.(updated).then(setRewind)
  }

  return (
    <SettingRow
      icon={Monitor}
      dot={on ? 'on' : 'off'}
      title={t('settings.general.screenCapture')}
      subtitle={on ? t('settings.general.screenCaptureOn') : t('settings.general.screenCaptureOff')}
      keywords="screen capture rewind record monitor recording"
      control={
        <Toggle
          on={on}
          onChange={change}
          disabled={rewind === null}
          label={t('settings.general.screenCapture')}
        />
      }
    />
  )
}

// Audio Recording status card (macOS General §3.1). Bound to the `continuousRecording`
// preference — the same state the Sidebar's "Microphone" toggle drives — and live-syncs
// through the preferences listener when flipped elsewhere.
function AudioRecordingRow(): React.JSX.Element {
  const { t } = useI18n()
  const [on, setOn] = useState<boolean>(() => !!getPreferences().continuousRecording)

  useEffect(() => onPreferencesChange((p) => setOn(!!p.continuousRecording)), [])

  const change = (next: boolean): void => {
    setOn(next) // optimistic; setPreferences notifies subscribers to reconcile
    setPreferences({ continuousRecording: next })
  }

  return (
    <SettingRow
      icon={Mic}
      dot={on ? 'on' : 'off'}
      title={t('settings.general.audioRecording')}
      subtitle={
        on ? t('settings.general.audioRecordingOn') : t('settings.general.audioRecordingOff')
      }
      keywords="audio recording microphone transcribe listening voice"
      control={<Toggle on={on} onChange={change} label={t('settings.general.audioRecording')} />}
    />
  )
}

// Screen Analysis master (macOS General "Screen Capture" consent, Windows-named
// "Screen Analysis" to avoid colliding with the local-Rewind "Screen Capture" row
// above). This is the single consent gate for the whole proactive screen loop —
// Focus, memory/task extraction, and insights. Today it is only reachable from the
// tray checkbox; this row exposes it in Settings. It reads/writes through the same
// scoped assistant bridge the tray and the Notifications tab use, and subscribes to
// the broadcast so it and the tray checkbox can never disagree.
export function ScreenAnalysisRow(): React.JSX.Element {
  const { t } = useI18n()
  const [on, setOn] = useState<boolean | null>(null)

  useEffect(() => {
    void window.omi?.assistantsGetSettings?.().then((s) => setOn(s.screenAnalysisEnabled))
    return window.omi?.onAssistantSettingsChanged?.((s) => setOn(s.screenAnalysisEnabled))
  }, [])

  const change = (next: boolean): void => {
    setOn(next) // optimistic; the coordinator re-syncs off the settings write
    void window.omi?.assistantsSetSettings?.({ screenAnalysisEnabled: next })
  }

  return (
    <SettingRow
      icon={ScanEye}
      dot={on ? 'on' : 'off'}
      title={t('settings.general.screenAnalysis')}
      subtitle={t('settings.general.screenAnalysisSubtitle')}
      keywords="screen analysis proactive focus memory task insight vision master consent"
      control={
        <Toggle
          on={!!on}
          onChange={change}
          disabled={on === null}
          label={t('settings.general.screenAnalysis')}
        />
      }
    />
  )
}

// Multi-chat sessions (macOS "Multiple Chat Sessions"). Off = the single Synced
// Chat thread shared with mobile; on = separate desktop chat threads with a
// history switcher. The multi-chat header also requires the pi_mono chat engine
// (a dark flag), so flipping this on under the default legacy engine has no
// visible effect yet — matching Mac, where multi-chat is kernel-backed.
function MultiChatRow(): React.JSX.Element {
  const { t } = useI18n()
  const [on, setOn] = useState(() => getPreferences().multiChatEnabled === true)

  useEffect(() => onPreferencesChange((p) => setOn(p.multiChatEnabled === true)), [])

  const change = (next: boolean): void => {
    setOn(next) // optimistic; setPreferences notifies subscribers to reconcile
    setPreferences({ multiChatEnabled: next })
  }

  return (
    <SettingRow
      icon={MessageSquarePlus}
      title={t('settings.general.multiChat')}
      subtitle={on ? t('settings.general.multiChatOn') : t('settings.general.multiChatOff')}
      keywords="multi chat sessions threads history switcher conversations separate"
      control={<Toggle on={on} onChange={change} label={t('settings.general.multiChat')} />}
    />
  )
}

// Escape hatch back to the original Home screen. The Home page subscribes to this
// preference, so the switch takes effect immediately — no restart.
function LegacyHomeRow(): React.JSX.Element {
  const { t } = useI18n()
  const [legacy, setLegacy] = useState(!!getPreferences().useLegacyHomeDesign)

  const change = (next: boolean): void => {
    setLegacy(next)
    setPreferences({ useLegacyHomeDesign: next })
  }

  return (
    <SettingRow
      icon={LayoutDashboard}
      dot={legacy ? 'off' : 'on'}
      title={t('settings.general.newHome')}
      subtitle={t('settings.general.newHomeSubtitle')}
      keywords="hub home dashboard layout redesign legacy old classic"
      control={
        <Toggle on={!legacy} onChange={(on) => change(!on)} label={t('settings.general.newHome')} />
      }
    />
  )
}
// Meeting detection (Phase 5): off / ask (default) / auto. Per-app overrides
// live in the same settings object (userData/app-settings.json → meeting.perApp,
// keyed by pattern id) — editable as JSON; no dedicated UI yet.
function MeetingDetectionRow(): React.JSX.Element {
  const { t } = useI18n()
  const [mode, setMode] = useState<MeetingMode | null>(null)

  useEffect(() => {
    void window.omi?.meetingGetSettings?.().then((s) => setMode(s.mode))
  }, [])

  const change = (next: MeetingMode): void => {
    setMode(next) // optimistic
    void window.omi?.meetingSetSettings?.({ mode: next })
  }

  return (
    <SettingRow
      icon={Presentation}
      dot={mode === 'off' ? 'off' : 'on'}
      title={t('settings.general.meetingDetection')}
      subtitle={t('settings.general.meetingSubtitle')}
      keywords="meeting zoom teams meet webex discord detect auto capture record"
      control={
        <select
          value={mode ?? 'ask'}
          disabled={mode === null}
          onChange={(e) => change(e.target.value as MeetingMode)}
          className="rounded-md bg-white/10 px-2 py-1.5 text-sm text-white focus:outline-none"
        >
          <option value="ask" className="bg-neutral-900">
            {t('settings.general.meetingAsk')}
          </option>
          <option value="auto" className="bg-neutral-900">
            {t('settings.general.meetingAuto')}
          </option>
          <option value="off" className="bg-neutral-900">
            {t('settings.general.meetingOff')}
          </option>
        </select>
      }
    />
  )
}

// Reflects and controls the OS "start Omi when I sign in" setting. Reads the real
// state from main on mount; the toggle writes it through and updates optimistically.
function LaunchAtLoginRow(): React.JSX.Element {
  const { t } = useI18n()
  const [openAtLogin, setOpenAtLogin] = useState<boolean | null>(null)
  // The OS Run entry is only writable in packaged builds (see the main handler);
  // in unpackaged dev the toggle must not pretend it works.
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    void window.omi?.getLoginItemSettings?.().then((s) => {
      setOpenAtLogin(!!s?.openAtLogin)
      setSupported(!!s?.supported)
    })
  }, [])

  const change = (next: boolean): void => {
    setOpenAtLogin(next) // optimistic
    void window.omi?.setLaunchAtLogin?.(next)
  }

  return (
    <SettingRow
      icon={Power}
      dot={openAtLogin ? 'on' : 'off'}
      title={t('settings.general.launchAtLogin')}
      subtitle={
        supported
          ? t('settings.general.launchAtLoginSubtitle')
          : t('settings.general.launchAtLoginUnsupported')
      }
      keywords="startup autostart launch login boot start"
      control={
        <Toggle
          on={!!openAtLogin}
          onChange={change}
          disabled={openAtLogin === null || !supported}
          label={t('settings.general.launchAtLogin')}
        />
      }
    />
  )
}

// Record hotkey and the "update ready" restart affordance moved to their topical
// tabs: Settings → Shortcuts (ShortcutsTab) and Settings → About (AboutTab).
