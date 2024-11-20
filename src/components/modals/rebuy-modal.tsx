'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import playerApi from '@/services/api/modules/player-api'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import tableApi from '@/services/api/modules/table-api'
import { Table } from '@/types'
import { cn } from '@/lib/utils'
import { formatChipsAmount } from '@/utils/formatting'

const formSchema = z.object({
  buyIn: z.number().min(0, {
    message: 'Buy in must be greater than 0.',
  }),
})

export const RebuyModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()
  const user = useCurrentUser()
  const { tableId } = data
  const { update } = useSession()

  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState<Table | null>(null)

  const isModalOpen = isOpen && type === 'rebuy'

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buyIn: 1000,
    },
  })

  useEffect(() => {
    if (tableData) {
      form.setValue('buyIn', tableData.minBuyIn)
    }
  }, [form, tableData])

  useEffect(() => {
    const getTableById = async () => {
      if (!tableId) return

      const { response, error } = await tableApi.getTableById({
        tableId,
      })

      if (error) {
        console.log(error)
        return
      }

      setTableData(response)
    }
    if (isModalOpen) {
      getTableById()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user) return router.push('/auth/login')
      if (!tableData) return

      const currentPlayer = tableData.players.find(
        item => item.userId === user.id
      )

      if (!currentPlayer) return

      setIsLoading(true)

      const { response, error } = await playerApi.rebuy({
        id: currentPlayer.id,
        tableId: tableData.id,
        buyIn: values.buyIn,
        userId: user.id,
      })

      if (error) {
        console.log(error)
        toast.error('Error rebuy ')
        return
      }

      onClose()
      update()
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = async () => {
    onClose()
    form.reset()
  }

  return (
    <div className={cn('modal', isModalOpen && 'show')} id="modal_cash">
      <div className="modal_dark modal_close" onClick={handleClose}></div>
      <div className="modal_dialog sz-sm">
        <div className="modal_content ">
          <div className="modal_head">
            REBUY
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
                <div className="col color-primary fz-14">
                  최소한도:{' '}
                  <span className="fw-16 fw-500">
                    {formatChipsAmount(tableData?.minBuyIn || 0)}
                  </span>
                </div>
                <div className="col color-primary fz-14 text-right">
                  최고:{' '}
                  <span className="fz-16 fw-500">
                    {formatChipsAmount(tableData?.maxBuyIn || 0)}
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
                            <div className="wrap-input flex justify-center">
                              <Input
                                className="w-full py-0 text-center"
                                type="number"
                                min={tableData?.minBuyIn}
                                max={tableData?.maxBuyIn}
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
                    <span>충전</span>
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
