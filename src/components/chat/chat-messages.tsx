'use client'

import { useChatQuery } from '@/hooks/use-chat-query'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { useChatSocket } from '@/hooks/use-chat-socket'
import { Player, Message, User } from '@/types'
import { format } from 'date-fns'
import { Loader2, ServerCrash } from 'lucide-react'
import { ElementRef, Fragment, useRef } from 'react'

import { ChatItem } from './chat-item'

const DATE_FORMAT = 'HH:mm'

type MessageWithPlayer = Message & {
  user: User
}

interface ChatMessagesProps {
  name: string
  player: Player
  chatId: string
  socketUrl: string
  socketQuery: Record<string, string>
  tableId?: string
  conversationId?: string
  type: 'table' | 'conversation'
}

export const ChatMessages = ({
  name,
  player,
  chatId,
  socketUrl,
  socketQuery,
  tableId,
  conversationId,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      type,
      tableId: tableId || '',
      conversationId: conversationId || '',
    })

  useChatSocket({ queryKey, addKey, updateKey })
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  })

  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 size-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    )
  }

  return (
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto py-4 ">
      {!hasNextPage && <div className="flex-1" />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="my-4 size-6 animate-spin text-zinc-500" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="my-4 text-xs text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="mt-auto flex flex-col-reverse gap-y-2">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items?.map((message: MessageWithPlayer) => {
              if (!message.content && !message.stickerImageSrc) return null
              const isOwner = player.id === message.player?.id
              return (
                <>
                  {isOwner ? (
                    <div className="ml-auto max-w-[85%]" key={message.id}>
                      <ChatItem
                        id={message.id}
                        currentPlayer={player}
                        player={message.player!}
                        content={message.content}
                        stickerImageSrc={message.stickerImageSrc}
                        deleted={message.deleted}
                        timestamp={format(
                          new Date(message.createdAt),
                          DATE_FORMAT
                        )}
                        // isUpdated={message.updatedAt !== message.createdAt}
                        socketUrl={socketUrl}
                        socketQuery={socketQuery}
                      />
                    </div>
                  ) : (
                    <div className="mr-auto max-w-[85%]" key={message.id}>
                      <ChatItem
                        id={message.id}
                        currentPlayer={player}
                        player={message.player!}
                        content={message.content}
                        stickerImageSrc={message.stickerImageSrc}
                        deleted={message.deleted}
                        timestamp={format(
                          new Date(message.createdAt),
                          DATE_FORMAT
                        )}
                        // isUpdated={message.updatedAt !== message.createdAt}
                        socketUrl={socketUrl}
                        socketQuery={socketQuery}
                      />
                    </div>
                  )}
                </>
              )
            })}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
