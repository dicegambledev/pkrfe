import { Navbar } from '@/components/navbar'

import '@/styles/css/styles.css'
import '@/styles/css/layout.css'
interface ExternalLayoutProps {
  children: React.ReactNode
}

const ExternalLayout = ({ children }: ExternalLayoutProps) => {
  return (
    <div className="page-sub">
      <div className="inner_page">
        <main>{children}</main>
      </div>
    </div>
  )
}

export default ExternalLayout
