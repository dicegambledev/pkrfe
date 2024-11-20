'use client'

import { AutoRebuyModal } from '@/components/modals/auto-rebuy-modal'
import { BuyChipsModal } from '@/components/modals/buy-chips-modal'
import { BuyInModal } from '@/components/modals/buy-in-modal'
import { FeelingModal } from '@/components/modals/feeling-modal'
import { InviteModal } from '@/components/modals/invite-modal'
import { JoinTableModal } from '@/components/modals/join-table-modal'
import { LeaveTableModal } from '@/components/modals/leave-table-modal'
import { QualityModal } from '@/components/modals/quality-modal'

import { RebuyModal } from '@/components/modals/rebuy-modal'
import { RuleModal } from '@/components/modals/rule-modal'
import { useMountedState } from 'react-use'

export const ModalProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) {
    return null
  }

  return (
    <>
      <FeelingModal />
      <QualityModal />
      <RuleModal />
      <RebuyModal />
      <AutoRebuyModal />
      <BuyInModal />
      <BuyChipsModal />
      <JoinTableModal />
      <LeaveTableModal />
      <InviteModal />
    </>
  )
}
