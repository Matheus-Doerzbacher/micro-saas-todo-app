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

export default function Page() {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Uso do Plano</CardTitle>
        <CardDescription>
          Você está atualmente em um plano gratuito. Faça um upgrade para
          desbloquear mais recursos e liberar o poder dos seus dados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <header className="flex justify-between items-center pt-6">
            <span className="text-muted-foreground text-sm">1/5</span>
            <span className="text-muted-foreground text-sm">20%</span>
          </header>
          <main>
            <Progress value={20} />
          </main>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t border-border pt-6">
        <span>Para um maior limite assine o PRO</span>
        <Button>Faça upgrade para PRO</Button>
      </CardFooter>
    </Card>
  )
}
