import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useI18n, type TranslationKey } from '../../lib/i18n'

// Segmented switcher that lives in the header of both the Tasks and Goals
// pages. Goals no longer has its own sidebar item — it's reached from the Tasks
// tab via this toggle. Both pages stay mounted in MainViews, so switching here
// is just a route change (instant, state preserved).
const tabs = [
  { labelKey: 'pages.tasks', to: '/tasks' },
  { labelKey: 'pages.goals', to: '/goals' }
] satisfies Array<{ labelKey: TranslationKey; to: string }>

export function TasksGoalsToggle(): React.JSX.Element {
  const { t } = useI18n()

  return (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-black/20 p-1">
      {tabs.map(({ labelKey, to }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'rounded-xl px-4 py-1.5 font-display text-base font-bold tracking-tight transition-all duration-200',
              isActive
                ? 'bg-white/15 text-white'
                : 'text-white/45 hover:bg-white/5 hover:text-white/80'
            )
          }
        >
          {t(labelKey)}
        </NavLink>
      ))}
    </div>
  )
}
