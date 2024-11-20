import { currentUser } from '@/lib/auth'
import bankApi from '@/services/api/modules/bank-api'
import { redirect } from 'next/navigation'
import { BankForm } from './_components/bank-form'
import withdrawApi from '@/services/api/modules/withdraw-api'
import rechargeApi from '@/services/api/modules/recharge-api'
import { CashesClient } from './_components/client'
import { CashColumn } from './_components/columns'
import { formatChipsAmount } from '@/utils/formatting'
import { Recharge, Withdraw } from '@/types'
import { format } from 'date-fns'

const CashPage = async () => {
  const user = await currentUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { response: bank } = await bankApi.getBankByUserId({
    userId: user.id,
  })

  const { response: withdraws } = await withdrawApi.getAllByBankId({
    bankId: bank?.id,
  })
  const { response: recharges } = await rechargeApi.getAllByBankId({
    bankId: bank?.id,
  })

  const data = [
    ...recharges.map((item: Recharge) => {
      return { ...item, action: 'RECHARGE' }
    }),
    ...withdraws.map((item: Withdraw) => {
      return { ...item, action: 'WITHDRAW' }
    }),
  ]

  const formattedData: CashColumn[] = data.map((item: any) => ({
    id: item.id,
    action: item.action,
    amount: `${item.action === 'WITHDRAW' ? '-' : '+'}$${formatChipsAmount(+item.amount)}`,
    status: item.status,
    createdAt: format(item.createdAt, 'dd/MM/yyyy'),
  }))

  return (
    <div className="form_custom">
      <h2 className="ttl_main fz-18">
        <span>
          <strong className="icon sz-24 icon-color-white flex-shrink">
            <i className="icon-cash"></i>
          </strong>
          입출금
        </span>
      </h2>
      <div className="row flex flex-center gapy-40 mt-16">
        <div className="col-12 col-md-12 col-xl-5 col-history">
          <h2 className="text-up mb-16 ttl_sub">계좌 정보</h2>
          <BankForm bank={bank} />
        </div>
        <div className="col-12 col-md-12 col-xl-7">
          <h2 className="text-up mb-16 ttl_sub">입출금 내역</h2>
          <CashesClient data={formattedData} />
        </div>
      </div>
    </div>
  )
}

export default CashPage
