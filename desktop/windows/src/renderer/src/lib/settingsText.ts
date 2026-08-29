import type { UiLanguage } from './preferences'

const JAPANESE: Record<string, string> = {
  'Language mode': '言語モード',
  'How Omi transcribes what you say. Applies to your next recording session.':
    'Omiが発話を文字起こしする方法です。次回の録音から適用されます。',
  'Local VAD gate': '端末内の音声検出',
  'On-device voice-activity detection skips silence before it reaches transcription, reducing usage and cost. Turn off to send all captured audio.':
    '端末内で無音部分を除いてから文字起こしへ送るため、利用量と費用を抑えられます。オフにすると録音した音声をすべて送信します。',
  'Continuous recording': '連続録音',
  'Always-on microphone. Omi turns what you hear into conversations automatically.':
    'マイクを常時利用し、聞こえた内容をOmiが自動で会話として記録します。',
  'Auto-cleanup': '自動整理',
  'Remove empty conversations and junk memories. Preview logs what it would delete; switch to Delete to apply.':
    '空の会話や不要な記憶を整理します。プレビューでは削除候補だけを記録し、「削除」にすると実行します。',
  'Capture my screen': '画面を記録',
  'A local, searchable timeline stored only on this PC — never uploaded.':
    'このPC内だけに保存され、検索できる画面履歴です。アップロードはされません。',
  'Capture interval': '記録間隔',
  'How often a frame is sampled.': '画面を取り込む間隔です。',
  'Capture quality': '記録画質',
  'Higher quality makes small on-screen text readable (better search and OCR), and uses more CPU and disk.':
    '高画質ほど小さな文字を読み取りやすくなり、検索と文字認識の精度が上がりますが、CPUとディスクを多く使います。',
  'Keep history for': '履歴の保存期間',
  'Older frames are pruned automatically.': '保存期間を過ぎた画面は自動で削除されます。',
  'Excluded apps': '除外するアプリ',
  'Rewind never screenshots while one of these apps is in focus. Matched loosely (e.g. “chrome” covers Google Chrome).':
    '指定したアプリを使用中は画面を記録しません。名前は部分一致します（例：「chrome」でGoogle Chromeも対象）。',
  'Screen activity → memories': '画面の操作から記憶を作成',
  'Turns recent on-screen text (from Rewind) into memories. On-device redaction first; skips private/incognito windows. Off by default — writes to your Omi account.':
    '最近の画面上の文字を記憶に変換します。端末内で機密情報を除去し、プライベート画面は対象外です。初期設定はオフで、有効にするとOmiアカウントへ保存します。',
  'Proactive insights': '先回りインサイト',
  'Periodically reviews recent screen activity and surfaces a single useful insight (choose the style below). Requires screen capture, and Notifications turned on with a frequency above Off.':
    '最近の画面操作を定期的に確認し、役立つ提案を一つ表示します。画面記録と、通知頻度をオフ以外に設定する必要があります。',
  'Automatically suggest goals': '目標を自動提案',
  'Occasionally reviews your memories, conversations, and tasks on-device and creates a goal it thinks fits you. Off by default; you can always use Suggest on the Goals page.':
    '端末内で記憶、会話、タスクを時々確認し、合いそうな目標を作ります。初期設定はオフで、目標ページからいつでも手動提案できます。',
  Notifications: '通知',
  "Control how often Omi's proactive assistants can notify you.":
    'Omiの先回りアシスタントから通知を受け取る頻度を設定します。',
  Frequency: '頻度',
  'How often to receive notifications.': '通知を受け取る間隔です。',
  'Focus notifications': '集中状態の通知',
  'Show a notification on focus changes.': '集中状態が変わったときに通知します。',
  'Extract memories from your screen': '画面から記憶を抽出',
  'Periodically looks at your screen and saves useful facts to your Omi memories. Runs quietly — no notifications. Requires Screen Analysis (Settings → General).':
    '画面を定期的に確認し、役立つ情報をOmiの記憶へ保存します。通知は表示しません。設定の「一般」で画面分析を有効にする必要があります。',
  'Focus glow': '集中状態の枠表示',
  'Draw a colored ring around the active window when Focus detects a distraction or a refocus.':
    '集中の中断や再開を検出したとき、使用中のウィンドウを色付きの枠で囲みます。',
  'Proactive insights are configured in Settings → Rewind.':
    '先回りインサイトは「設定」→「履歴」で設定できます。',
  'App-usage tracking': 'アプリ利用状況の記録',
  'Records which apps you actively use (app name only, never window titles) — locally — to improve memory ranking.':
    'よく使うアプリ名だけを端末内に記録し、記憶の優先順位を改善します。ウィンドウ名は記録しません。',
  'Hide the Omi bar from screen sharing': '画面共有にOmiバーを映さない',
  'Excludes the top-edge bar from screenshots, recordings, and shared screens. Turn off if you want it visible in captures.':
    '画面上部のOmiバーをスクリーンショット、録画、画面共有から除外します。記録に映したい場合はオフにしてください。',
  'Screen Sharing in Chat': 'チャットで画面を共有',
  "Let Omi capture your screen when you ask about what's on it. Omi only captures when you ask — turning this on doesn't share anything on its own.":
    '画面について質問したとき、Omiが画面を取り込めるようにします。有効にしただけでは共有されず、質問したときだけ取り込みます。',
  'On-device by default': '端末内保存が基本',
  'Your screen timeline, file index, and app usage stay on this PC. Only synthesized facts (memories) are sent to your Omi account, and only for features you turn on.':
    '画面履歴、ファイル索引、アプリ利用状況はこのPC内に残ります。有効にした機能で作られた要約情報（記憶）だけがOmiアカウントへ送られます。',
  'Summon hotkey': '呼び出しショートカット',
  'Global shortcut to reveal the floating bar and ask a question.':
    'フローティングバーを表示して質問するための共通ショートカットです。',
  'Record hotkey': '録音ショートカット',
  'Global shortcut to start and stop recording.':
    '録音を開始・停止するための共通ショートカットです。',
  'Import memories': '記憶を取り込む',
  'Paste a ChatGPT/Claude “everything you remember about me” reply; Omi extracts distinct, durable facts.':
    'ChatGPTやClaudeの「私について覚えていること」の回答を貼り付けると、Omiが長く役立つ情報へ整理します。',
  'Export memories': '記憶を書き出す',
  'Memory maintenance': '記憶の整理',
  'Find and remove legacy app/file-index memories (these belong in the knowledge graph, not memories). Analyze is read-only.':
    '古いアプリ・ファイル索引由来の記憶を検出して整理します。「分析」だけでは削除しません。',
  'File indexing': 'ファイル索引',
  'Knowledge graph': '知識グラフ',
  'Replay onboarding': '初期設定をやり直す',
  'Run the startup wizard again from the beginning.': '起動時の初期設定を最初からやり直します。',
  'Windows Sticky Notes': 'Windows付箋',
  'Reads your Sticky Notes locally and saves durable facts as memories. Your notes are never uploaded — only the synthesized facts.':
    '付箋を端末内で読み、長く役立つ情報を記憶として保存します。付箋そのものは送信せず、要約した情報だけを使います。',
  'Gmail (session)': 'Gmail（セッション）',
  'AI profile': 'AIプロフィール',
  'A synthesized “about you” summary Omi builds from your memories, tasks, goals, and conversations — used to personalize proactive help.':
    '記憶、タスク、目標、会話からOmiが作る「あなたについて」の要約です。先回り支援の個人設定に使います。',
  'Omi for Windows': 'Windows版Omi',
  Links: 'リンク',
  'Learn more about Omi, get help, and read the terms.':
    'Omiの詳しい情報、ヘルプ、利用規約を確認できます。',
  'Software updates': 'ソフトウェア更新',
  'Omi updates itself in the background and installs the next time you restart.':
    'Omiはバックグラウンドで更新を取得し、次回の再起動時にインストールします。',
  'Receive beta updates': 'ベータ版を受け取る',
  'Get pre-release versions early. Beta builds get new features first but may be less stable. Turn off to stay on stable releases.':
    '正式公開前の機能を早く受け取ります。新機能を先に試せますが、不安定な場合があります。安定版だけを使う場合はオフにしてください。',
  'Usage this month': '今月の利用状況',
  Free: '無料',
  'You are currently on the free tier.': '現在は無料プランを利用しています。',
  'Choose a plan': 'プランを選択',
  'Pick one plan first. Billing options appear only after the card is selected.':
    '最初にプランを一つ選んでください。選択すると支払い方法が表示されます。',
  'MOST POPULAR': '一番人気',
  'AUTOMATION + CODING': '自動化＋コーディング',
  'Unlimited listening and transcription': '音声入力と文字起こしが無制限',
  'Unlimited memories and insights': '記憶とインサイトが無制限',
  '500 chat questions per month. Shared with mobile and web.':
    '月500回のチャット質問。モバイル版・Web版と共通です。',
  'Available on Mac, mobile, and web': 'Mac、モバイル、Webで利用可能',
  'Automations and vibe coding': '自動化とAIコーディング',
  'Power-user AI — thousands of chats + agentic automations':
    '大量のチャットとエージェント自動化に対応する上級者向けAI',
  'Power-user AI for heavy agentic workflows and vibe coding.':
    '高度なエージェント作業とAIコーディングに適した上級者向けAIです。',
  'Unlimited listening, memories, and insights': '音声入力、記憶、インサイトが無制限',
  'Priority desktop AI features': 'デスクトップAI機能を優先利用',
  '~$400 of monthly AI compute included': '月約400ドル相当のAI計算量を含む',
  'Included with your current plan.': '現在のプランに含まれています。',
  'Promo code': 'プロモーションコード',
  'Enter promo code': 'プロモーションコードを入力',
  'Choose billing': '支払い方法を選択'
}

export function localizeSettingsText(language: UiLanguage, text: string): string {
  if (language !== 'ja') return text
  const exact = JAPANESE[text]
  if (exact) return exact
  const resetDays = text.match(/^Resets in (\d+) days?$/)
  if (resetDays) return `${resetDays[1]}日後にリセット`
  const questionLimit = text.match(/^(\d+) chat questions per month$/)
  if (questionLimit) return `月${questionLimit[1]}回のチャット質問`
  const questionPlan = text.match(/^Chat questions on (.+) plan$/)
  if (questionPlan) return `${questionPlan[1]}プランのチャット質問`
  return text
}
