// Settings → Advanced → "AI profile" subsection. Mac parity with
// aiUserProfileSubsection (SettingsContentView): shows the once-daily synthesized
// "about you" profile with its last-updated date + data-source count, and lets
// the user Regenerate, inline-Edit (Save), or Delete it. The profile is
// generated + stored + backend-synced entirely in the main process; this UI is a
// thin driver over the aiProfile:* IPCs.
//
// There is deliberately NO enable toggle here — Mac generates unconditionally, so
// matching Mac means preview/CRUD only (the aiProfileEnabled setting is owned
// elsewhere).
import { useEffect, useState } from 'react'
import { UserRound } from 'lucide-react'
import { SettingRow } from '../SettingRow'
import { useI18n } from '../../../lib/i18n'
import type { AiUserProfileRecord } from '../../../../../shared/types'

export function AiProfileCard(): React.JSX.Element {
  const { language } = useI18n()
  const [record, setRecord] = useState<AiUserProfileRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Inline edit state.
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)

  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    void window.omi
      .aiProfileGetLatest()
      .then(setRecord)
      .catch(() => setRecord(null))
      .finally(() => setLoading(false))
  }, [])

  const regenerate = async (): Promise<void> => {
    if (generating) return
    setGenerating(true)
    setError(null)
    try {
      // Bare call — main falls back to the session cached by aiProfileHost.
      const next = await window.omi.aiProfileGenerateNow()
      setRecord(next)
      setEditing(false)
    } catch {
      // Never surface a raw Error string (it can echo a backend body / no-data
      // reason). Plain-English line instead.
      setError("Couldn't generate a profile right now. Make sure you're signed in and try again.")
    } finally {
      setGenerating(false)
    }
  }

  const startEdit = (): void => {
    if (!record) return
    setDraft(record.profileText)
    setEditing(true)
    setError(null)
  }

  const saveEdit = async (): Promise<void> => {
    if (!record || saving) return
    setSaving(true)
    setError(null)
    try {
      await window.omi.aiProfileEdit(record.id, draft)
      // Re-read so we reflect the stored text (source of truth) after the write.
      const next = await window.omi.aiProfileGetLatest()
      setRecord(next)
      setEditing(false)
    } catch {
      setError("Couldn't save your changes. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const remove = async (): Promise<void> => {
    if (!record) return
    setError(null)
    try {
      await window.omi.aiProfileDelete(record.id)
      const next = await window.omi.aiProfileGetLatest()
      setRecord(next)
    } catch {
      setError("Couldn't delete the profile. Try again.")
    } finally {
      setConfirmingDelete(false)
    }
  }

  return (
    <SettingRow
      icon={UserRound}
      title="AI profile"
      subtitle="A synthesized “about you” summary Omi builds from your memories, tasks, goals, and conversations — used to personalize proactive help."
      keywords="ai profile about you dossier synthesized personalize regenerate"
    >
      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-text-tertiary">Loading…</p>
        ) : !record ? (
          // Empty state.
          <div className="space-y-3">
            <p className="text-sm text-text-tertiary">No profile yet.</p>
            <button
              onClick={regenerate}
              disabled={generating}
              className="btn-primary px-4 py-2 disabled:opacity-40"
            >
              {generating
                ? language === 'ja'
                  ? '作成中…'
                  : 'Generating…'
                : language === 'ja'
                  ? '今すぐ作成'
                  : 'Generate Now'}
            </button>
          </div>
        ) : editing ? (
          // Inline edit.
          <div className="space-y-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={8}
              className="input-field resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="btn-primary px-4 py-2 disabled:opacity-40"
              >
                {saving
                  ? language === 'ja'
                    ? '保存中…'
                    : 'Saving…'
                  : language === 'ja'
                    ? '保存'
                    : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setError(null)
                }}
                disabled={saving}
                className="btn-ghost disabled:opacity-40"
              >
                {language === 'ja' ? 'キャンセル' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          // Preview.
          <div className="space-y-3">
            <div className="glass-subtle max-h-56 select-text overflow-y-auto whitespace-pre-wrap rounded-lg px-4 py-3 text-sm text-text-secondary">
              {record.profileText}
            </div>
            <p className="text-xs text-text-tertiary">
              {language === 'ja' ? '最終更新' : 'Last updated'}:{' '}
              {new Date(record.generatedAt).toLocaleDateString()} ·{' '}
              {language === 'ja' ? 'データ元' : 'Data sources'}: {record.dataSourcesUsed.length}
              {language === 'ja'
                ? '件'
                : ` ${record.dataSourcesUsed.length === 1 ? 'item' : 'items'}`}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={regenerate}
                disabled={generating}
                className="btn-ghost disabled:opacity-40"
              >
                {generating
                  ? language === 'ja'
                    ? '再作成中…'
                    : 'Regenerating…'
                  : language === 'ja'
                    ? '再作成'
                    : 'Regenerate'}
              </button>
              <button
                onClick={startEdit}
                disabled={generating}
                className="btn-ghost disabled:opacity-40"
              >
                {language === 'ja' ? '編集' : 'Edit'}
              </button>
              {confirmingDelete ? (
                <>
                  <button
                    onClick={remove}
                    className="text-sm font-medium text-red-400 hover:text-red-300"
                  >
                    {language === 'ja' ? '削除を確定' : 'Confirm delete'}
                  </button>
                  <button
                    onClick={() => setConfirmingDelete(false)}
                    className="btn-ghost disabled:opacity-40"
                  >
                    {language === 'ja' ? 'キャンセル' : 'Cancel'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirmingDelete(true)}
                  disabled={generating}
                  className="text-sm font-medium text-red-400 hover:text-red-300 disabled:opacity-40"
                >
                  {language === 'ja' ? '削除' : 'Delete'}
                </button>
              )}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-amber-400">{error}</p>}
      </div>
    </SettingRow>
  )
}
