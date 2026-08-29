// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { I18nProvider, useI18n } from './i18n'
import { setPreferences } from './preferences'

function Probe(): React.JSX.Element {
  const { language, setLanguage, t } = useI18n()

  return (
    <button type="button" onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}>
      {t('common.settings')}
    </button>
  )
}

describe('I18nProvider', () => {
  beforeEach(() => {
    setPreferences({ uiLanguage: 'en' })
  })

  it('switches the interface immediately and persists the selection', async () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }))

    await waitFor(() => expect(screen.getByRole('button', { name: '設定' })).toBeTruthy())
    expect(document.documentElement.lang).toBe('ja')
    expect(JSON.parse(localStorage.getItem('omi-windows-prefs-v1') ?? '{}').uiLanguage).toBe('ja')
  })
})
