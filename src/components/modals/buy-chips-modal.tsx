'use client'

import { cn } from '@/lib/utils'
import { useModal } from '@/store/use-modal-store'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const BuyChipsModal = () => {
  const { isOpen, onClose, type } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'buyChips'

  const onClick = () => {
    router.push('/settings/cash-action')
  }

  return (
    <div className={cn('modal', isModalOpen && 'show')}>
      <div className="modal_dark modal_close" onClick={onClose}></div>
      <div className="modal_dialog sz-sm">
        <div className="modal_content  max-w-[700px] flex-grow-0">
          <div className="modal_head">
            칩을 사다
            <div className="btn_close modal_close" onClick={onClose}>
              <X className="mt-3" size={24} />
            </div>
          </div>
          <div className="modal_body space-y-6">
            <div className="text text-center">
              플레이할 칩이 부족합니다. 계속 플레이하려면 칩을 구입하세요.
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn_submit w-full"
                onClick={onClick}
              >
                <span>칩 구매</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
