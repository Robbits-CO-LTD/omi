import {
  Settings as SettingsIcon,
  History,
  ShieldCheck,
  CircleUserRound,
  SlidersHorizontal,
  Brain,
  Bot,
  AudioLines,
  CreditCard,
  Keyboard,
  Bell,
  Info,
  type LucideIcon
} from 'lucide-react'
import type { TranslationKey } from '../../lib/i18n'

export type SettingsTabId =
  | 'general'
  | 'memories'
  | 'agents'
  | 'transcription'
  | 'rewind'
  | 'notifications'
  | 'privacy'
  | 'account'
  | 'plan-usage'
  | 'shortcuts'
  | 'advanced'
  | 'about'

export const SETTINGS_TABS: {
  id: SettingsTabId
  label: string
  labelKey: TranslationKey
  Icon: LucideIcon
}[] = [
  { id: 'general', label: 'General', labelKey: 'settings.tabs.general', Icon: SettingsIcon },
  { id: 'memories', label: 'Memories', labelKey: 'settings.tabs.memories', Icon: Brain },
  { id: 'agents', label: 'Agents', labelKey: 'settings.tabs.agents', Icon: Bot },
  {
    id: 'transcription',
    label: 'Transcription',
    labelKey: 'settings.tabs.transcription',
    Icon: AudioLines
  },
  { id: 'rewind', label: 'Rewind', labelKey: 'settings.tabs.rewind', Icon: History },
  {
    id: 'notifications',
    label: 'Notifications',
    labelKey: 'settings.tabs.notifications',
    Icon: Bell
  },
  { id: 'privacy', label: 'Privacy', labelKey: 'settings.tabs.privacy', Icon: ShieldCheck },
  {
    id: 'account',
    label: 'Account',
    labelKey: 'settings.tabs.account',
    Icon: CircleUserRound
  },
  {
    id: 'plan-usage',
    label: 'Plan & Usage',
    labelKey: 'settings.tabs.planUsage',
    Icon: CreditCard
  },
  {
    id: 'shortcuts',
    label: 'Shortcuts',
    labelKey: 'settings.tabs.shortcuts',
    Icon: Keyboard
  },
  {
    id: 'advanced',
    label: 'Advanced',
    labelKey: 'settings.tabs.advanced',
    Icon: SlidersHorizontal
  },
  { id: 'about', label: 'About', labelKey: 'settings.tabs.about', Icon: Info }
]
