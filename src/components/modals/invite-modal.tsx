'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useModal } from '@/store/use-modal-store'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export const InviteModal = () => {
  const { isOpen, onClose, type, data } = useModal()

  const isModalOpen = isOpen && type === 'invite'
  const { tableId } = data

  const [copied, setCopied] = useState(false)

  const inviteCode = tableId

  const onCopy = () => {
    navigator.clipboard.writeText(`${inviteCode}`)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden  p-0 ">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Invite Players
          </DialogTitle>
        </DialogHeader>
        <div className="p-[24px]">
          <Label className="text-sm font-bold text-zinc-500 dark:text-zinc-300">
            Table invite link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <div className="input-group">
              <div className="wrap-input">
                <Input className=" py-0 " value={inviteCode} readOnly />
              </div>
            </div>

            <Button onClick={onCopy} size="icon">
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
