import { CreditCard, Loader2, RefreshCw } from 'lucide-react'
import { BillingCard } from './BillingCard'
import {
  resolvePlanTitle,
  currentPlanSubtitle,
  currentPlanPeriodText,
  hasPaidSubscription
} from '../../../lib/billing'
import type { UserSubscriptionResponse } from '../../../lib/omiApi.generated'
import { useI18n } from '../../../lib/i18n'
import { localizeSettingsText } from '../../../lib/settingsText'

/**
 * Current-plan card (AccountBilling "planusage.current"): plan title + billing
 * detail, a renew/access-ends caption, and a Manage (paid → Stripe portal) or
 * Refresh (free) action.
 */
export function CurrentPlanCard(props: {
  sub: UserSubscriptionResponse
  portalBusy: boolean
  refreshing: boolean
  onManage: () => void
  onRefresh: () => void
}): React.JSX.Element {
  const { language } = useI18n()
  const { sub, portalBusy, refreshing, onManage, onRefresh } = props
  const subscription = sub.subscription
  const paid = hasPaidSubscription(subscription)
  const periodText = currentPlanPeriodText(subscription)

  return (
    <BillingCard
      icon={CreditCard}
      title={localizeSettingsText(language, resolvePlanTitle(subscription, sub.available_plans))}
      subtitle={localizeSettingsText(
        language,
        currentPlanSubtitle(subscription, sub.available_plans)
      )}
      trailing={
        paid ? (
          <button
            onClick={onManage}
            disabled={portalBusy}
            className="btn-ghost disabled:opacity-50"
          >
            {portalBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {language === 'ja' ? '管理' : 'Manage'}
          </button>
        ) : (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="btn-ghost disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {language === 'ja' ? '更新' : 'Refresh'}
          </button>
        )
      }
    >
      {periodText ? (
        <div className="text-sm text-text-tertiary">
          {localizeSettingsText(language, periodText)}
        </div>
      ) : null}
    </BillingCard>
  )
}
