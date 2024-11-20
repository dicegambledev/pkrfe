'use client'

import Image from 'next/image'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { NewPasswordSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { useCurrentUser } from '@/hooks/use-current-user'
import userApi from '@/services/api/modules/user-api'
import { Button } from '@/components/ui/button'

interface NewPasswordContentProps {}

export const NewPasswordContent = ({}: NewPasswordContentProps) => {
  const user = useCurrentUser()

  const [isPending, startTransition] = useTransition()
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    user?.image
  )

  const { update } = useSession()

  const form = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    if (!user) return

    startTransition(async () => {
      const { response, error } = await userApi.newPassword(
        values,
        user?.id as string
      )

      if (error) {
        toast.error('Something went wrong!')
        return
      }

      if (response) {
        toast.success('Password updated successfully')
        form.reset()
      }
    })
  }

  return (
    <Form {...form}>
      <form className="mt-32" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="row flex flex-center gapy-60 flex-col lg:flex-row">
          <div className="col-12 col-md-12 col-lg-8 form_content space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="input-group">
                      <div className="wrap-input">
                        <Input
                          disabled={isPending}
                          placeholder="**********"
                          type="password"
                          {...field}
                        />
                        <label>비밀번호</label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="input-group">
                      <div className="wrap-input">
                        <Input
                          disabled={isPending}
                          type="password"
                          placeholder="**********"
                          {...field}
                        />
                        <label>새 비밀번호</label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="input-group">
                      <div className="wrap-input">
                        <Input
                          disabled={isPending}
                          type="password"
                          placeholder="**********"
                          {...field}
                        />
                        <label>비밀번호 확인</label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="footing flex flex-end gap-8">
          <Button type="submit" className="btn_main" disabled={isPending}>
            저장
          </Button>
        </div>
      </form>
    </Form>
  )
}
