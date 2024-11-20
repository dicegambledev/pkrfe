import React from 'react'
import { UserBoard } from '@/components/user-board'

interface SettingsLayoutProps {
  children: React.ReactNode
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  return (
    <div className="boding_main">
      <div className="sidebar_left">
        <UserBoard hasMenu />
      </div>
      <div className="content_main">
        <div className="inner">{children}</div>
      </div>
    </div>
  )
}

export default SettingsLayout
