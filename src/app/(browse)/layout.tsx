import { Navbar } from '@/components/navbar'

import '@/styles/css/styles.css'
import '@/styles/css/layout.css'
interface BrowseLayoutProps {
  children: React.ReactNode
}

const BrowseLayout = ({ children }: BrowseLayoutProps) => {
  return (
    <div className="page-sub">
      <div className="inner_page">
        <main>
          <Navbar />
          {children}
        </main>
      </div>
    </div>
  )
}

export default BrowseLayout
