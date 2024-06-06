import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { createCheckoutSessionAction } from './actions'
import { auth } from '@/services/auth'
import { getUserCurrentPlan } from '@/services/stripe'

export default async function Page() {
  const session = await auth()
  const plan = await getUserCurrentPlan(session?.user?.id)

  return (
    <form action={createCheckoutSessionAction}>
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle>Uso do Plano</CardTitle>
          <CardDescription>
            Você está atualmente em um plano{' '}
            <span className="font-bold uppercase">{plan.name}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <header className="flex justify-between items-center pt-6">
              <span className="text-muted-foreground text-sm">
                {plan.quota.TASKS.current}/{plan.quota.TASKS.available}
              </span>
              <span className="text-muted-foreground text-sm">
                {plan.quota.TASKS.usage}%
              </span>
            </header>
            <main>
              <Progress value={plan.quota.TASKS.current} />
            </main>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-border pt-6">
          <span>Para um maior limite assine o PRO</span>
          <Button type="submit">Assine por R$9,99 /mes</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
