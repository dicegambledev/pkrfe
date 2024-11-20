import { Actions } from './actions'
import { Logo } from './logo'

export const Navbar = () => {
  return (
    <header
      className="game_heading !h-[56px] !py-0 !px-[16px] !z-50"
      style={{ backgroundImage: 'url(/images/header_bg.png)' }}
    >
      <Logo />
      <Actions />
    </header>
  )
}
