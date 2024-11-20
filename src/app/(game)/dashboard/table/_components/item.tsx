'use client'

import { useCurrentUser } from '@/hooks/use-current-user'
import { useModal } from '@/store/use-modal-store'
import { Table } from '@/types'
import { formatChipsAmount } from '@/utils/formatting'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ItemProps {
  table: Table
  totalPlayersByMinBuyIn: number
}

export const Item = ({ table, totalPlayersByMinBuyIn }: ItemProps) => {
  const router = useRouter()
  const user = useCurrentUser()
  const { onOpen } = useModal()

  const onClick = () => {
    if (!user) {
      return router.push('/auth/login')
    }

    const isNotEnoughChips = user.chipsAmount < table.minBuyIn

    if (isNotEnoughChips) {
      return onOpen('buyChips', { table })
    }

    onOpen('buyIn', { table })
  }

  return (
    <div className="room" onClick={onClick}>
      <div className="icon icon-color-white">
        <Image
          src="/images/icon/icon_poker.png"
          alt="image alt"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
        />
      </div>
      <div className="room_name fz-10">
        테이블 - <span className="fz-18 fw-600">{table.name}</span>
      </div>
      <div className="info fz-12 mt-8">
        <dl>
          <dt className="flex flex-midle gap-8">
            <span className="icon sz-12 icon-color-white">
              <i className="icon-dolar"></i>
            </span>
            최소바인:
          </dt>
          <dd>{formatChipsAmount(table.minBuyIn)}$</dd>
        </dl>
        <dl>
          <dt className="flex flex-midle gap-8">
            <span className="icon sz-12 icon-color-white">
              <i className="icon-dolar"></i>
            </span>
            블라인드:
          </dt>
          <dd>{formatChipsAmount(table.ante)}$</dd>
        </dl>
        <dl>
          <dt className="flex flex-midle gap-8">
            <span className="icon sz-12 icon-color-white">
              <i className="icon-group"></i>
            </span>
            인원:
          </dt>
          <dd>
            {table.players.length}/{totalPlayersByMinBuyIn}
          </dd>
        </dl>
      </div>
    </div>
  )
}
