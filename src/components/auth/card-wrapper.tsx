import { BackButton } from '@/components/auth/back-button'
import { Header } from '@/components/auth/header'
import { Social } from '@/components/auth/social'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  headerDescription?: string
  backButtonLabel: string
  backButtonHref: string
  showSocial?: boolean
  type?: 'login' | 'signup' | 'verify-email'
}

export const CardWrapper = ({
  children,
  headerLabel,
  headerDescription = '',
  backButtonHref,
  backButtonLabel,
  showSocial,
  type = 'login',
}: CardWrapperProps) => {
  return (
    <Card className="max-w-[460px] w-full  shadow-md p-[32px] z-20 bg-black/60 border-solid border-2 border-white/30">
      <CardHeader className="p-0">
        <Header label={headerLabel} description={headerDescription} />
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
      {showSocial ? (
        <CardFooter>
          <Social />
        </CardFooter>
      ) : null}
      <CardFooter className="p-0">
        <BackButton label={backButtonLabel} href={backButtonHref}></BackButton>
      </CardFooter>
    </Card>
  )
}
