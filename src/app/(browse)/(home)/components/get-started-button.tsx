import { RegisterButton } from '@/components/auth/register-button'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/auth'
import playerApi from '@/services/api/modules/player-api'
import { redirect } from 'next/navigation'

interface GetStartedButtonProps {}

export const GetStartedButton = async ({}: GetStartedButtonProps) => {
  const user = await currentUser()
  if (user) {
    redirect(`/dashboard`)
  }

  return (
    <div>
      <RegisterButton mode="modal">
        <Button variant="destructive">Get started</Button>
      </RegisterButton>
    </div>
  )
}
