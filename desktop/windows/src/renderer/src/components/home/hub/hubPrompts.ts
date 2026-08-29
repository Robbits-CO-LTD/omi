// Starter prompts under the ask bar. The app has no prompt-suggestions source
// (no server feed, no local generator), so these are the fixed three — swap them
// for the feed the day one exists.
import type { TranslationKey } from '../../../lib/i18n'

export const HUB_SUGGESTIONS: TranslationKey[] = [
  'home.suggestion.focus',
  'home.suggestion.time',
  'home.suggestion.leverage'
]
