'use client'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { useCurrentUser } from '@/hooks/use-current-user'
import { Textarea } from '@/components/ui/textarea'
import { useParams } from 'next/navigation'
import { useSocket } from '@/providers/socket-provider'
import { useEffect, useRef, useState } from 'react'
import { PokerActions, Table } from '@/types'
import tableApi from '@/services/api/modules/table-api'
import { Sticker } from './sticker'
import { useClickAway } from 'react-use'
import { cn } from '@/lib/utils'
import { useChatFocus } from '@/store/use-chat-focus'

interface ChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: 'conversation' | 'table'
}

const formSchema = z.object({
  content: z.string().min(1),
})

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { socket } = useSocket()
  const { setIsChatFocus } = useChatFocus()
  const user = useCurrentUser()
  const params = useParams()
  const router = useRouter()

  const [table, setTable] = useState<Table | null>(null)
  const [showSticker, setShowSticker] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    if (socket) {
      socket.on(PokerActions.TABLE_UPDATED, ({ table }: { table: Table }) => {
        if (table?.id !== params?.tableId) return

        setTable(table)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  useEffect(() => {
    const getTable = async () => {
      if (!params?.tableId) return

      const { response, error } = await tableApi.getTableById({
        tableId: params.tableId as string,
      })

      if (response) {
        setTable(response)
      }
    }
    getTable()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useClickAway(wrapperRef, () => setShowSticker(false))

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })

      await axios.post(url, {
        ...values,
        user,
      })

      form.reset()
      router.refresh()
    } catch (error) {
      // console.log(error)
    }
  }

  const onStickerClick = async (imageSrc: string) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      })

      await axios.post(url, {
        stickerImageSrc: imageSrc,
        user,
      })

      // router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative mx-[12px] " ref={wrapperRef}>
                  <div className="h-[36px] flex">
                    <Sticker
                      show={showSticker}
                      setShow={setShowSticker}
                      onClick={onStickerClick}
                    />
                    <div
                      className="bg-[#181818] p-2 hover:bg-black cursor-pointer"
                      onClick={() => setShowSticker(!showSticker)}
                    >
                      <div className="btn_sticker flex-shrink">
                        <span className="icon sz-20">
                          <i className="icon-sticker"></i>
                        </span>
                      </div>
                    </div>

                    <Textarea
                      disabled={isLoading || (table?.chatBanned ?? false)}
                      className="border-0 border-none resize-none rounded-t-none   text-[12px]  py-[4px] bg-[#181818]  no-scrollbar  text-white min-h-[36px] max-h-[36px] focus-visible:ring-0 focus-visible:ring-offset-0  "
                      placeholder={`메시지 입력...`}
                      onKeyDown={event => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault()
                          form.handleSubmit(onSubmit)()
                        }
                      }}
                      {...field}
                      onFocus={() => setIsChatFocus(true)}
                      onBlur={() => setIsChatFocus(false)}
                    />
                  </div>

                  <div
                    className={cn(
                      'absolute right-0 inset-y-0 w-[60px] flex items-center justify-center hover:bg-black/50 rounded-br-md',
                      isLoading ||
                        ((table?.chatBanned ?? false) &&
                          'opacity-50 pointer-events-none')
                    )}
                    onClick={() => form.handleSubmit(onSubmit)()}
                  >
                    <span className="icon sz-24">
                      <i className="icon-send"></i>
                    </span>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
