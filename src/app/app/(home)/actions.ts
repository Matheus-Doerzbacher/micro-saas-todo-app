import { upsertTodoSchema } from './schema'
import { auth } from '@/services/auth'
import { prisma } from '@/services/database'
import { z } from 'zod'

export async function getUserTodos() {
  const session = await auth()

  const todos = await prisma.todo.findMany({
    where: {
      userId: session?.user?.id,
    },
  })
  return todos
}

export async function upsertTodo(input: z.infer<typeof upsertTodoSchema>) {
  const session = await auth()

  if (input.id) {
    const todo = await prisma.todo.findUnique({
      where: { id: input.id, userId: session?.user?.id },
      select: {
        id: true,
      },
    })

    if (!todo) {
      return {
        error: 'Tarefa não encontrada',
        data: null,
      }
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: input.id, userId: session?.user?.id },
      data: {
        title: input.title,
        doneAt: input.doneAt,
      },
    })
    return {
      error: null,
      data: updatedTodo,
    }
  }

  if (!input.title) {
    return {
      error: 'Título é obrigatório',
      data: null,
    }
  }

  const todo = await prisma.todo.create({
    data: {
      title: input.title,
      doneAt: input.doneAt,
      userId: session?.user?.id,
    },
  })

  return todo
}
