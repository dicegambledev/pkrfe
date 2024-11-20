import '@/styles/css/layout.css'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="relative flex h-dvh before:absolute flex-col items-center justify-center space-y-6 loginPage bg-cover bg-center bg-fixed before:content-[''] before:inset-0 before:bg-black/50 before:z-10 before:pointer-events-none"
      style={{ backgroundImage: 'url(/images/bg_body.jpg)' }}
    >
      {children}
    </div>
  )
}

export default AuthLayout
