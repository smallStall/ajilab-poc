import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from "lucide-react"

// この関数は実際の実装では非同期でデータを取得します
function getDishData(id: string) {
  // 仮のデータ
  return {
    id: Number.parseInt(id),
    name: "カレーライス",
    evaluationSettings: {
      customItems: [
        {
          id: 1,
          name: "スパイス感",
          description: "スパイスの香りや風味の強さ",
          type: "slider",
          scale: 5,
          enabled: true,
          order: 1,
        },
        {
          id: 2,
          name: "とろみ",
          description: "ルーのとろみ具合",
          type: "slider",
          scale: 7,
          enabled: true,
          order: 2,
        },
        {
          id: 3,
          name: "具材のバランス",
          description: "肉と野菜のバランスが良いか",
          type: "star",
          scale: 5,
          enabled: true,
          order: 3,
        },
        {
          id: 4,
          name: "甘さ",
          description: "甘みの強さ",
          type: "slider",
          scale: 5,
          enabled: true,
          order: 4,
        },
        {
          id: 5,
          name: "塩味",
          description: "塩味の強さ",
          type: "slider",
          scale: 5,
          enabled: true,
          order: 5,
        },
        {
          id: 6,
          name: "旨味",
          description: "旨味の強さ",
          type: "slider",
          scale: 5,
          enabled: true,
          order: 6,
        },
        {
          id: 7,
          name: "辛さ",
          description: "辛さの強さ",
          type: "slider",
          scale: 10,
          enabled: true,
          order: 7,
        },
        {
          id: 8,
          name: "酸味",
          description: "酸味の強さ",
          type: "number",
          scale: 5,
          enabled: true,
          order: 8,
        },
      ],
    },
  }
}

export default function EvaluationSettings({ params }: { params: { id: string } }) {
  const dish = getDishData(params.id)
  const settings = dish.evaluationSettings

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href={`/dishes/${params.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {dish.name}に戻る
        </Link>
      </Button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">評価項目設定</h1>
          <p className="text-muted-foreground">{dish.name}の評価に使用する項目をカスタマイズできます</p>
        </div>
      </div>

      <form className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">評価項目</h2>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                項目を追加
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {settings.customItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  評価項目がありません。「項目を追加」ボタンから追加できます。
                </p>
              ) : (
                settings.customItems.map((item) => (
                  <div key={item.id} className="flex items-start p-3 border rounded-md">
                    <div className="flex items-center self-center mr-2 cursor-move">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label htmlFor={`name-${item.id}`} className="text-sm font-medium">
                            項目名
                          </label>
                          <Input id={`name-${item.id}`} defaultValue={item.name} />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor={`type-${item.id}`} className="text-sm font-medium">
                            評価タイプ
                          </label>
                          <Select defaultValue={item.type}>
                            <SelectTrigger id={`type-${item.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="slider">スライダー</SelectItem>
                              <SelectItem value="star">星評価</SelectItem>
                              <SelectItem value="number">数値入力</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {item.type !== "number" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label htmlFor={`scale-${item.id}`} className="text-sm font-medium">
                              段階数
                            </label>
                            <Select defaultValue={item.scale.toString()}>
                              <SelectTrigger id={`scale-${item.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((scale) => (
                                  <SelectItem key={scale} value={scale.toString()}>
                                    {scale}段階
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      <div className="space-y-1">
                        <label htmlFor={`description-${item.id}`} className="text-sm font-medium">
                          説明
                        </label>
                        <Textarea
                          id={`description-${item.id}`}
                          defaultValue={item.description}
                          rows={2}
                          placeholder="この評価項目の説明を入力してください"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center ml-3 space-y-2">
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center space-x-1">
                        <Switch id={`enabled-${item.id}`} checked={item.enabled} />
                        <label htmlFor={`enabled-${item.id}`} className="text-xs">
                          有効
                        </label>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" asChild>
            <Link href={`/dishes/${params.id}`}>キャンセル</Link>
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            設定を保存
          </Button>
        </div>
      </form>
    </div>
  )
}

