import { useSocket } from '@/providers/socket-provider'
import messsageApi from '@/services/api/modules/message-api'
import { useInfiniteQuery } from '@tanstack/react-query'

interface ChatQueryProps {
  queryKey: string
  type: 'table' | 'conversation'
  tableId: string
  conversationId: string
}

export const useChatQuery = ({
  queryKey,
  type,
  tableId,
  conversationId,
}: ChatQueryProps) => {
  const { isConnected } = useSocket()

  const fetchMessages = async ({
    pageParam,
  }: {
    pageParam: string | undefined
  }) => {
    let res

    if (type === 'table') {
      res = await messsageApi.getMessages({ tableId, cursor: pageParam })
    }
    // else if (type === "conversation") {
    // res = await getDirectMessageByConversationId({
    //   cursor: pageParam,
    //   conversationId: conversationId,
    // })
    // }

    return res?.response
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      initialPageParam: undefined,
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: lastPage => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  }
}
