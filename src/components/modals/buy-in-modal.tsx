'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useModal } from '@/store/use-modal-store'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { useCurrentUser } from '@/hooks/use-current-user'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSocket } from '@/providers/socket-provider'
import playerApi from '@/services/api/modules/player-api'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { formatChipsAmount } from '@/utils/formatting'

const formSchema = z.object({
  buyIn: z.number().min(0, {
    message: 'Buy in must be greater than 0.',
  }),
})

export const BuyInModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()
  const user = useCurrentUser()
  const { socket } = useSocket()
  const { table } = data
  const { update } = useSession()

  const [isLoading, setIsLoading] = useState(false)

  const isModalOpen = isOpen && type === 'buyIn'

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buyIn: 1000,
    },
  })

  useEffect(() => {
    if (table) {
      form.setValue('buyIn', table.minBuyIn)
    }
  }, [form, table])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user) return router.push('/auth/login')
      if (!table) return

      setIsLoading(true)

      const { response, error } = await playerApi.createPlayer({
        tableId: table.id,
        userId: user.id,
        socketId: socket.id,
        buyIn: values.buyIn,
      })

      if (error) {
        return
      }

      router.push(`/dashboard/table/${table.id}`)
      update()
      onClose()
      // router.refresh()
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <div className={cn('modal', isModalOpen && 'show')}>
      <div className="modal_dark modal_close" onClick={handleClose}></div>
      <div className="modal_dialog sz-sm">
        <div className="modal_content ">
          <div className="modal_head">
            매입금
            <div className="btn_close modal_close" onClick={handleClose}>
              <span className="icon sz-24">
                <i className="icon_close"></i>
              </span>
            </div>
          </div>
          <div className="modal_body">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="row flex flex-space"
              >
                <div className="col-12 my-12 text-center color-primary fz-14">
                  자금:{' '}
                  <span className="fw-16 fw-500">
                    {formatChipsAmount(table?.ante || 0)}
                  </span>
                </div>
                <div className="col color-primary fz-14">
                  최소한도:{' '}
                  <span className="fw-16 fw-500">
                    {formatChipsAmount(table?.minBuyIn || 0)}
                  </span>
                </div>
                <div className="col color-primary fz-14 text-right">
                  최고:{' '}
                  <span className="fz-16 fw-500">
                    {formatChipsAmount(table?.maxBuyIn || 0)}
                  </span>
                </div>

                <div className="col-12 mt-12">
                  <FormField
                    control={form.control}
                    name="buyIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="input-group">
                            <div className="wrap-input ">
                              <Input
                                className="w-full py-0 text-center"
                                type="number"
                                min={table?.minBuyIn}
                                max={table?.maxBuyIn}
                                disabled={isLoading}
                                {...field}
                                onChange={e =>
                                  field.onChange(+e.target.value || ' ')
                                }
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn_submit w-full"
                    disabled={isLoading}
                  >
                    <span>매입금</span>
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
