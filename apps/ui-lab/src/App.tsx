import { Button, Card, CardHeader, CardTitle, CardContent, Input, Badge, Skeleton, Separator } from '@account-book/ui'
import { formatCurrency } from '@account-book/ui'

export default function App() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">UI Lab - 组件演示</h1>

      <section>
        <h2 className="text-lg font-semibold mb-4">Button</h2>
        <div className="flex gap-4 flex-wrap">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-4">Card</h2>
        <Card className="w-[350px]">
          <CardHeader><CardTitle>卡片标题</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">这是卡片内容区域</p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-4">Badge</h2>
        <div className="flex gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-4">Input</h2>
        <div className="w-[300px] space-y-2">
          <Input placeholder="输入框" />
          <Input type="number" placeholder="数字输入" />
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-4">Skeleton</h2>
        <div className="space-y-2 w-[300px]">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      </section>
    </div>
  )
}
