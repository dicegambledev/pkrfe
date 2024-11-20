'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { CardActionSchema } from '@/schemas'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Bank, User } from '@/types'
import withdrawApi from '@/services/api/modules/withdraw-api'
import { useRouter } from 'next/navigation'
import rechargeApi from '@/services/api/modules/recharge-api'

interface CardActionContentProps {
  bank: Bank
  user: User
}

export const CardActionContent = ({ bank, user }: CardActionContentProps) => {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const form = useForm({
    resolver: zodResolver(CardActionSchema),
    defaultValues: {
      amount: 1000,
      type: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof CardActionSchema>) => {
    if (!bank || !user) return

    if (user.chipsAmount < 1000) {
      toast.error('You must have at least 1000 chips to withdraw or recharge!')
      return
    }

    const { amount, type } = values

    startTransition(async () => {
      if (type === 'WITHDRAW') {
        const { response, error } = await withdrawApi.create({
          amount,
          bankId: bank.id,
        })

        if (error) {
          toast.error('Something went wrong!')
          return
        }

        if (response) {
          form.reset()
          router.push('/settings/cash')
        }
      }

      if (type === 'RECHARGE') {
        const { response, error } = await rechargeApi.create({
          amount,
          bankId: bank.id,
        })

        if (error) {
          toast.error('Something went wrong!')
          return
        }

        if (response) {
          form.reset()
          router.push('/settings/cash')
        }
      }
    })
  }

  return (
    <Form {...form}>
      <form className="mt-32" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="row flex flex-center gapy-60 flex-col lg:flex-row">
          <div className="col-12 col-md-12 col-lg-8 form_content space-y-4">
            <div className="input-group">
              <div className="wrap-input">
                <Input value={bank.cardNumber} disabled={true} />
                <label>카드 번호</label>
              </div>
            </div>
            <div className="input-group">
              <div className="wrap-input">
                <Input value={bank.cardHolderName} disabled={true} />
                <label>카드 소지자 이름</label>
              </div>
            </div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="input-group">
                      <div className="wrap-input">
                        <Input
                          disabled={isPending}
                          type="number"
                          min={1000}
                          max={
                            user.chipsAmount >= 1000 ? user.chipsAmount : 1000
                          }
                          {...field}
                          onChange={e => field.onChange(+e.target.value || ' ')}
                        />
                        <label>양</label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="RECHARGE">재충전</SelectItem>
                      <SelectItem value="WITHDRAW">철회하다</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="footing flex flex-end gap-8">
          <Button type="submit" className="btn_main" disabled={isPending}>
            요구
          </Button>
        </div>
      </form>
    </Form>
  )
}
