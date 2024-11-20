'use client'

import { LogoutButton } from '@/components/auth/logout-button'

import { useCurrentUser } from '@/hooks/use-current-user'

import { usePathname, useRouter } from 'next/navigation'
import { formatChipsAmount } from '@/utils/formatting'
import Link from 'next/link'
import Image from 'next/image'
import { BoardItem } from '../board-item'
import { BsCashCoin } from 'react-icons/bs'
import { RotateCcw } from 'lucide-react'

type Props = {
  type?: 'game' | 'default'
}

export const UserButton = ({ type = 'default' }: Props) => {
  const router = useRouter()
  const user = useCurrentUser()
  const pathname = usePathname()

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <>
      <div className="item flex flex-midle gap-12 item_account">
        <div className="avatar icon sz-36 flex-shrink mx-0">
          <div className="images">
            <div className="imgDrop">
              <Image
                src={user.image}
                alt="image alt"
                width={0}
                height={0}
                sizes="100vw"
                className="w-auto h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="content">
          {user.name}
          <div className="flex flex-midle gapx-4">
            <span className="icon sz-12">
              <i className="icon-coin"> </i>
            </span>
            <span className="text-money fw-600">
              {formatChipsAmount(user.chipsAmount)} $
            </span>
          </div>
        </div>

        {type !== 'game' ? (
          <>
            <span className="icon sz-20 icon-color-white flex-shrink ml-auto">
              <i className="icon-down2"></i>
            </span>
            <div className="dropdown_content">
              <div className="info_profile mt-8">
                <div className="avatar mx-auto">
                  <div className="images">
                    <div className="imgDrop">
                      <Image
                        src="/images/avt/1.jpg"
                        alt="image alt"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-auto h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="name text-center mt-8 fw-500">
                  Lorem ipsum dolor
                </div>
                <div className="rank flex gap-8 flex-center fz-10 flex-midle mt-8">
                  등급:
                  <div>
                    {/* <!--.flex.gap-8.flex-midle
                      .icon.sz-12 
                      	i.icon-silver
                      .rank_silver (SILVER Gamer)
                      -->
                      <!--.flex.gap-8.flex-midle
                      .icon.sz-12 
                      	i.icon-gold
                      .rank_gold (GOLD Gamer)
                      --> */}
                    <div className="flex gapx-4 flex-midle">
                      <div className="icon sz-12">
                        {' '}
                        <i className="icon-daimond"></i>
                      </div>
                      <div className="rank_daimond">(DAIMOND Gamer)</div>
                    </div>
                  </div>
                </div>
                <div className="money flex flex-center gap-12 flex-midle mt-12">
                  <span className="icon sz-16">
                    {' '}
                    <i className="icon-coin"></i>
                  </span>
                  <div className="number">20.000 $</div>
                </div>
                <div className="row info_more fz-10 mt-12">
                  <div className="col-4">
                    <dl className="text-center">
                      <dt>
                        <div className="icon sz-20 icon-color-white mx-auto">
                          <i className="icon-points"></i>
                        </div>
                        <span>포인트</span>
                      </dt>
                      <dd>1000</dd>
                    </dl>
                  </div>
                  <div className="col-4">
                    <dl className="text-center">
                      <dt>
                        <div className="icon sz-20 icon-color-white mx-auto">
                          <i className="icon-win"></i>
                        </div>
                        <span>총 승리</span>
                      </dt>
                      <dd>30/120</dd>
                    </dl>
                  </div>
                  <div className="col-4">
                    <dl className="text-center">
                      <dt>
                        <div className="icon sz-20 icon-color-white mx-auto">
                          <i className="icon-lose"></i>
                        </div>
                        <span>총 패배</span>
                      </dt>
                      <dd>50/120</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="list_menu">
                <ul>
                  <BoardItem
                    label="마이 정보"
                    icon={<i className="icon-user"></i>}
                    href="/settings/profile"
                  />
                  <BoardItem
                    label="입출금"
                    icon={<i className="icon-cash"></i>}
                    href="/settings/cash"
                  />
                  <BoardItem
                    label="현금 조치"
                    icon={<BsCashCoin size={20} />}
                    href="/settings/cash-action"
                  />
                  {/* <BoardItem
                    label="포인트"
                    icon={<i className="icon-points"></i>}
                    href="/settings/point"
                  /> */}

                  <BoardItem
                    label="게임 기록"
                    icon={<i className="icon-history"></i>}
                    href="/settings/history"
                  />

                  <BoardItem
                    label="새 비밀번호"
                    icon={<RotateCcw size={20} />}
                    href="/settings/new-password"
                  />

                  <li>
                    <LogoutButton>
                      <a>
                        <span className="icon sz-16 icon-color-red">
                          <i className="icon-logout"></i>
                        </span>
                        <span className="icon-color-red">로그오웃</span>
                      </a>
                    </LogoutButton>
                  </li>
                  {/* <li>
                <a href="">
                  <span className="icon sz-16 icon-color-red">
                    <i className="icon-remove_acc"></i>
                  </span>
                  <span className="icon-color-red">Remove account</span>
                </a>
              </li> */}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="px-2" />
        )}
      </div>
    </>
  )
}
