import { currentUser } from '@/lib/auth'
import { CardActionContent } from './_components/card-action-content'
import { redirect } from 'next/navigation'
import bankApi from '@/services/api/modules/bank-api'
import { BsCashCoin } from 'react-icons/bs'

const WithdrawPage = async () => {
  const user = await currentUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { response: bank } = await bankApi.getBankByUserId({
    userId: user.id,
  })

  if (!bank) {
    redirect('/settings/cash')
  }

  return (
    <div className="form_custom">
      <h2 className="ttl_main fz-18">
        <span>
          <BsCashCoin size={24} className="text-white" />
          Cash Actions
        </span>
      </h2>
      <CardActionContent bank={bank} user={user} />
    </div>
  )
}

export default WithdrawPage
