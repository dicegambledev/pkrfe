import { format } from 'date-fns'
import { HistoriesClient } from './_components/client'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import historyApi from '@/services/api/modules/history-api'
import { HistoryColumn } from './_components/columns'
import { formatChipsAmount } from '@/utils/formatting'

const HistoryPage = async () => {
  const user = await currentUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { response: histories } = await historyApi.getAllByUserId({
    userId: user.id,
  })

  const formattedHistories: HistoryColumn[] = histories.map((item: any) => ({
    id: item.id,
    name: item.match?.table?.name,
    amount: `${item.type === 'win' ? '+' : '-'}$${formatChipsAmount(+item.amount)}`,
    status: item.type,
    createdAt: format(item.createdAt, 'dd/MM/yyyy'),
  }))

  return (
    <div className="form_custom">
      <h2 className="ttl_main fz-18">
        <span>
          <strong className="icon sz-24 icon-color-white flex-shrink">
            <i className="icon-history"></i>
          </strong>
          게임 기록
        </span>
      </h2>

      <HistoriesClient data={formattedHistories || []} />
    </div>
  )
}

export default HistoryPage
