'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { BankSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Button } from '@/components/ui/button'
import { Bank } from '@/types'
import bankApi from '@/services/api/modules/bank-api'
import { DatePicker } from '@/components/date-picker'

interface BankFormProps {
  bank: Bank
}

export const BankForm = ({ bank }: BankFormProps) => {
  const user = useCurrentUser()

  const [isPending, startTransition] = useTransition()

  const form = useForm({
    resolver: zodResolver(BankSchema),
    defaultValues: {
      cardNumber: '',
      securityCode: '',
      cardHolderName: '',
      expiryDate: '',
    },
  })

  useEffect(() => {
    if (bank) {
      form.setValue('cardNumber', bank?.cardNumber || '')
      form.setValue('securityCode', bank?.securityCode || '')
      form.setValue('cardHolderName', bank?.cardHolderName || '')
      form.setValue('expiryDate', bank?.expiryDate.toString() || '')
    }
  }, [bank, form])

  const onSubmit = async (values: z.infer<typeof BankSchema>) => {
    if (!user) return

    startTransition(async () => {
      if (!bank) {
        const { response, error } = await bankApi.create({
          ...values,
          expiryDate: new Date(values.expiryDate),
          userId: user?.id as string,
        })

        if (error) {
          toast.error('Something went wrong!')
          return
        }

        toast.success('Bank details saved!')
      } else {
        const { response, error } = await bankApi.update(
          {
            ...values,
            expiryDate: new Date(values.expiryDate),
          },
          bank?.id
        )

        if (error) {
          toast.error('Something went wrong!')
          return
        }

        toast.success('Bank details saved!')
      }
    })
  }
  return (
    <Form {...form}>
      <form className="mt-32" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="input-group">
                  <div className="wrap-input">
                    <Input
                      className="form-control"
                      disabled={isPending}
                      {...field}
                    />
                    <label>계좌번호</label>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="row">
          <div className="col-12 col-xl-6">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <DatePicker
                        date={new Date(field.value ? field.value : new Date())}
                        setDate={date => field.onChange(date?.toString())}
                      />
                      <label className="absolute top-1 left-5 text-[10px] text-white/50">
                        만료일
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-12 col-xl-6">
            <FormField
              control={form.control}
              name="securityCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="input-group">
                      <div className="wrap-input">
                        <Input disabled={isPending} {...field} />
                        <label>보안 코드</label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="cardHolderName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="input-group">
                  <div className="wrap-input">
                    <Input disabled={isPending} {...field} />
                    <label>예금주</label>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="footing flex flex-end gap-8">
          <Button type="submit" className="btn_main" disabled={isPending}>
            저장
          </Button>
        </div>
      </form>
    </Form>
  )
}
