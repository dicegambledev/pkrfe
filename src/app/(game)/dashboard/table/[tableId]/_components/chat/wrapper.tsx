'use client'

import { useChatQuery } from '@/hooks/use-chat-query'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface WrapperProps {
  children: React.ReactNode
}

export const Wrapper = ({ children }: WrapperProps) => {
  const [newMessageDate, setNewMessageDate] = useState()
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const params = useParams()

  const queryKey = `chat:${params?.tableId}`

  const [isChatBoxVisible, setChatBoxVisible] = useState(false)

  const { data } = useChatQuery({
    queryKey,
    type: 'table',
    tableId: (params?.tableId as string) || '',
    conversationId: '',
  })

  useEffect(() => {
    if (data && !isChatBoxVisible) {
      const firstMessageCreatedAt = data.pages[0]?.items[0]?.createdAt

      if (!firstMessageCreatedAt) {
        setHasNewMessage(false)
        return
      }

      if (newMessageDate !== firstMessageCreatedAt) {
        setHasNewMessage(true)
        setNewMessageDate(firstMessageCreatedAt)
      }
    }
  }, [data])

  useEffect(() => {
    if (isChatBoxVisible) {
      setHasNewMessage(false)
    }
  }, [isChatBoxVisible])

  return (
    <div className="group_chat">
      <div
        className={cn('chat_box', isChatBoxVisible && 'is-show')}
        id="chat_box"
      >
        <div
          className="btn_close icon sz-24"
          id="close_chat"
          onClick={() => setChatBoxVisible(false)}
        >
          <i className="icon-down"></i>
        </div>
        <div className="body ">
          <div className="wrap scrollbar mb-[40px]">{children}</div>
        </div>
      </div>

      <div
        className={cn(
          'btn_chat m-[12px] relative',
          isChatBoxVisible ? 'is-hide' : 'is-show'
        )}
        id="btn_chat"
        onClick={() => setChatBoxVisible(true)}
      >
        <div className="icon sz-24">
          <i className="icon-chat"></i>
        </div>
        <span>Chat</span>
        {hasNewMessage && (
          <div className="absolute size-2 rounded-full right-0 top-0 bg-rose-500" />
        )}
      </div>
    </div>
  )
}
