'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Todo } from './todo-data-table'
import { useRef } from 'react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'

type TodoUpsertSheetProps = {
  children?: React.ReactNode
  defaultValue?: Todo
}

export function TodoUpsertSheet({ children }: TodoUpsertSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const form = useForm()

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
  })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div ref={ref}>{children}</div>
      </SheetTrigger>
      <SheetContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <SheetHeader>
              <SheetTitle>Adicionar Tarefa</SheetTitle>
              <SheetDescription>
                Adicione suas tarefas aqui. Clique em salvar quando terminar.
              </SheetDescription>
            </SheetHeader>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Tarefa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Comprar pão..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit">Salvar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
