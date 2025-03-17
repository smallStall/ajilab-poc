import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// この関数は実際の実装では非同期でデータを取得します
function getLotData(dishId: string, lotId: string) {
  // 仮のデータ
  return {
    id: Number.parseInt(lotId),
    dishId: Number.parseInt(dishId),
    dishName: "カレーライス",
    lotNumber: "CR-2023-001",
    status: "評価済み",
    testDate: "2023-10-15",
    assignee: "田中太郎",
    memo: "基本のカレーレシピを試作。玉ねぎの甘みを引き出すために、炒め時間を長めにとった。ルーは市販品を使用。",
    baselineLot: {
      id: 2,
      lotNumber: "CR-2023-002",
      recipeTitle: "スパイシーカレー",
    },
  }
}

// この関数は実際の実装では非同期でデータを取得します
function getDishLots(dishId: string, currentLotId: string) {
  // 仮のデータ
  return [
    {
      id: 1,
      lotNumber: "CR-2023-001",
      status: "評価済み",
      testDate: "2023-10-15",
      assignee: "田中太郎",
      recipeTitle: "基本のカレーライス",
    },
    {
      id: 2,
      lotNumber: "CR-2023-002",
      status: "調理済み",
      testDate: "2023-11-02",
      assignee: "鈴木花子",
      recipeTitle: "スパイシーカレー",
    },
    {
      id: 3,
      lotNumber: "CR-2023-003",
      status: "未調理",
      testDate: "2023-11-10",
      assignee: "佐藤次郎",
      recipeTitle: "野菜たっぷりカレー",
    },
  ].filter((lot) => lot.id.toString() !== currentLotId)
}

export default function EditLot({ params }: { params: { id: string; lotId: string } }) {
  const lot = getLotData(params.id, params.lotId)
  const availableLots = getDishLots(params.id, params.lotId)

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href={`/dishes/${params.id}/lots/${params.lotId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          ロット {lot.lotNumber} に戻る
        </Link>
      </Button>

      <h1 className="text-2xl font-bold mb-6">ロットを編集</h1>

      <form className="space-y-8">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">基準ロット</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">このロットの基準となるロットを選択できます。</p>
              <div className="space-y-2">
                <label htmlFor="baselineId" className="block font-medium">
                  基準ロット
                </label>
                <Select defaultValue={lot.baselineLot ? lot.baselineLot.id.toString() : "none"}>
                  <SelectTrigger id="baselineId">
                    <SelectValue placeholder="基準ロットを選択（任意）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">基準ロットなし</SelectItem>
                    {availableLots.map((availableLot) => (
                      <SelectItem key={availableLot.id} value={availableLot.id.toString()}>
                        {availableLot.lotNumber} - {availableLot.recipeTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">ロット情報</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="lotNumber" className="block font-medium">
                ロット番号
              </label>
              <Input id="lotNumber" defaultValue={lot.lotNumber} />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block font-medium">
                ステータス
              </label>
              <Select
                defaultValue={
                  lot.status === "評価済み" ? "評価済み" : lot.status === "調理済み" ? "調理済み" : "未調理"
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="未調理">未調理</SelectItem>
                  <SelectItem value="調理済み">調理済み</SelectItem>
                  <SelectItem value="評価済み">評価済み</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="testDate" className="block font-medium">
                試作日
              </label>
              <Input id="testDate" type="date" defaultValue={lot.testDate} />
            </div>

            <div className="space-y-2">
              <label htmlFor="assignee" className="block font-medium">
                担当者
              </label>
              <Input id="assignee" defaultValue={lot.assignee} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="memo" className="block font-medium">
              メモ
            </label>
            <Textarea id="memo" defaultValue={lot.memo} rows={3} />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" asChild>
            <Link href={`/dishes/${params.id}/lots/${params.lotId}`}>キャンセル</Link>
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        </div>
      </form>
    </div>
  )
}

