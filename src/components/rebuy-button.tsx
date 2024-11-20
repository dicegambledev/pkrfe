import { cn } from '@/lib/utils'
import { useAutoRebuy } from '@/store/use-auto-rebuy'
import { useModal } from '@/store/use-modal-store'

type RebuyButtonProps = {
  tableId: string
  className?: string
}

export const RebuyButton = ({ tableId, className }: RebuyButtonProps) => {
  const { onOpen } = useModal()
  const { isAutoRebuy } = useAutoRebuy()

  return (
    <div
      className={cn('btn_cash_chip', className)}
      id="btn_cash"
      onClick={() =>
        onOpen(`${isAutoRebuy ? 'autoRebuy' : 'rebuy'}`, { tableId })
      }
    >
      충전
      <span className="icon sz-16 icon-color-white">
        <i className="icon-cash"></i>
      </span>
    </div>
  )
}
