import { Chat } from './_components/chat'
import { currentUser } from '@/lib/auth'
import { Navbar } from './_components/navbar'
import { Statistical } from './_components/statistical'
import playerApi from '@/services/api/modules/player-api'
import { redirect } from 'next/navigation'
import { FixedSidebar } from './_components/fixed-sidebar'

const TableIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tableId: string }
}) => {
  const user = await currentUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { tableId } = params

  const { response: player } = await playerApi.getCurrentPlayerOfTable({
    tableId,
    userId: user.id,
  })

  return (
    <>
      <Navbar />
      <div className="game_body">
        {children}
        {player && (
          <>
            <Chat tableId={tableId} player={player} />
            <Statistical tableId={tableId} />
            <FixedSidebar />
          </>
        )}
      </div>
    </>
  )
}

export default TableIdLayout
