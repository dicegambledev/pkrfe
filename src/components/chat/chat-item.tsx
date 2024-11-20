'use client'

import { stringToColor } from '@/lib/utils'
import { Player } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { ChatItemSchema } from '@/schemas'

interface ChatItemProps {
  id: string
  content: string
  player: Player
  timestamp: string
  stickerImageSrc: string | null
  deleted: boolean
  currentPlayer: Player
  socketUrl: string
  socketQuery: Record<string, string>
}

export const ChatItem = ({
  id,
  content,
  player,
  timestamp,
  stickerImageSrc,
  currentPlayer,
}: ChatItemProps) => {
  const stringColor = stringToColor(player?.user?.name || '')

  const form = useForm<z.infer<typeof ChatItemSchema>>({
    resolver: zodResolver(ChatItemSchema),
    defaultValues: {
      content: content,
    },
  })

  useEffect(() => {
    form.reset({
      content: content,
    })
  }, [form, content])

  const isImage = stickerImageSrc

  return (
    <>
      <div className="chat_item">
        <div className="wraper">
          <div className="name" style={{ color: stringColor }}>
            {player?.user?.name}
          </div>
          {content && <div className="des">{content}</div>}
          {isImage && (
            <div className="sticker">
              <div className="imgDrop">
                <Image
                  src={stickerImageSrc}
                  alt="stickerImageSrc"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-auto h-full"
                />
              </div>
            </div>
          )}
          <div className="time">{timestamp}</div>
        </div>
      </div>
    </>
  )
}
