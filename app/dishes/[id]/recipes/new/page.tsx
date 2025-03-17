"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// この関数は実際の実装では非同期でデータを取得します
function getDishData(id: string) {
  // 仮のデータ
  return {
    id: Number.parseInt(id),
    name: "カレーライス",
  }
}

// 並べ替え可能な手順アイテムコンポーネント
function SortableStepItem({
  id,
  order,
  description,
  onDescriptionChange,
  onRemove,
}: {
  id: string
  order: number
  description: string
  onDescriptionChange: (id: string, value: string) => void
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex gap-4 items-start border-b pb-4 ${isDragging ? "opacity-50 bg-accent" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center bg-muted rounded-full h-8 w-8 text-center flex-shrink-0 mt-1 cursor-grab"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex items-center justify-center bg-muted rounded-full h-8 w-8 text-center flex-shrink-0 mt-1">
        {order}
      </div>
      <div className="flex-grow space-y-2">
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(id, e.target.value)}
          rows={2}
          placeholder={`手順 ${order} の説明`}
        />
        <Input type="file" accept="image/*" />
      </div>
      <Button type="button" variant="ghost" size="icon" className="mt-1" onClick={() => onRemove(id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function NewRecipe({ params }: { params: { id: string } }) {
  const dish = getDishData(params.id)

  // 手順のステート管理
  const [steps, setSteps] = useState([
    { id: "step-1", order: 1, description: "" },
    { id: "step-2", order: 2, description: "" },
    { id: "step-3", order: 3, description: "" },
  ])

  // センサーの設定
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // ドラッグ終了時の処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        // 順序番号を更新
        return newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }))
      })
    }
  }

  // 手順の説明を更新
  const handleStepDescriptionChange = (id: string, value: string) => {
    setSteps((prevSteps) => prevSteps.map((step) => (step.id === id ? { ...step, description: value } : step)))
  }

  // 手順を削除
  const handleRemoveStep = (id: string) => {
    setSteps((prevSteps) => {
      const filteredSteps = prevSteps.filter((step) => step.id !== id)
      // 順序番号を更新
      return filteredSteps.map((step, index) => ({
        ...step,
        order: index + 1,
      }))
    })
  }

  // 手順を追加
  const handleAddStep = () => {
    const newStepId = `step-${Date.now()}`
    setSteps((prevSteps) => [
      ...prevSteps,
      {
        id: newStepId,
        order: prevSteps.length + 1,
        description: "",
      },
    ])
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href={`/dishes/${params.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {dish.name}に戻る
        </Link>
      </Button>

      <h1 className="text-2xl font-bold mb-6">新しいレシピを追加</h1>

      <form className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block font-medium">
              レシピ名
            </label>
            <Input id="title" placeholder="例: 基本のカレーライス" />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block font-medium">
              ステータス
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="ステータスを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">開発中</SelectItem>
                <SelectItem value="testing">テスト済み</SelectItem>
                <SelectItem value="approved">承認済み</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="version" className="block font-medium">
              バージョン
            </label>
            <Input id="version" placeholder="例: 1.0" />
          </div>

          <div className="space-y-2">
            <label htmlFor="servings" className="block font-medium">
              人数
            </label>
            <Input id="servings" type="number" min="1" placeholder="例: 4" />
          </div>

          <div className="space-y-2">
            <label htmlFor="cookingTime" className="block font-medium">
              調理時間
            </label>
            <Input id="cookingTime" placeholder="例: 60分" />
          </div>

          <div className="space-y-2">
            <label htmlFor="difficulty" className="block font-medium">
              難易度
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="難易度を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">簡単</SelectItem>
                <SelectItem value="medium">普通</SelectItem>
                <SelectItem value="hard">難しい</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block font-medium">
            説明
          </label>
          <Textarea id="description" placeholder="レシピの説明を入力してください" rows={3} />
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="block font-medium">
            メイン画像
          </label>
          <Input id="image" type="file" accept="image/*" />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">材料</h2>
            <Button type="button" variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              材料を追加
            </Button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-grow">
                  <Input placeholder="材料名" className="mb-2" />
                </div>
                <div className="w-24">
                  <Input placeholder="分量" className="mb-2" />
                </div>
                <div className="w-24">
                  <Input placeholder="単位" className="mb-2" />
                </div>
                <Button type="button" variant="ghost" size="icon" className="mt-1">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">調理手順</h2>
            <Button type="button" variant="outline" size="sm" onClick={handleAddStep}>
              <Plus className="mr-2 h-4 w-4" />
              手順を追加
            </Button>
          </div>

          <div className="space-y-6">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={steps.map((step) => step.id)} strategy={verticalListSortingStrategy}>
                {steps.map((step) => (
                  <SortableStepItem
                    key={step.id}
                    id={step.id}
                    order={step.order}
                    description={step.description}
                    onDescriptionChange={handleStepDescriptionChange}
                    onRemove={handleRemoveStep}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="block font-medium">
            メモ（オプション）
          </label>
          <Textarea id="notes" placeholder="特記事項やコツなどを入力してください" rows={3} />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" asChild>
            <Link href={`/dishes/${params.id}`}>キャンセル</Link>
          </Button>
          <Button type="submit">保存</Button>
        </div>
      </form>
    </div>
  )
}

