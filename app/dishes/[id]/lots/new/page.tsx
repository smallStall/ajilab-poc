"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
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
    lots: [
      {
        id: 1,
        lotNumber: "CR-2023-001",
        status: "完了",
        testDate: "2023-10-15",
        assignee: "田中太郎",
        recipeTitle: "基本のカレーライス",
      },
      {
        id: 2,
        lotNumber: "CR-2023-002",
        status: "テスト中",
        testDate: "2023-11-02",
        assignee: "鈴木花子",
        recipeTitle: "スパイシーカレー",
      },
      {
        id: 3,
        lotNumber: "CR-2023-003",
        status: "開発中",
        testDate: "2023-11-10",
        assignee: "佐藤次郎",
        recipeTitle: "野菜たっぷりカレー",
      },
    ],
  }
}

// 材料の型定義
interface Ingredient {
  id: string
  name: string
  amount: string
  unit: string
}

// 手順の型定義
interface Step {
  id: string
  order: number
  description: string
  image?: File | null
}

// 並べ替え可能な手順アイテムコンポーネント
function SortableStepItem({
  id,
  order,
  description,
  onDescriptionChange,
  onRemove,
  onImageChange,
}: {
  id: string
  order: number
  description: string
  onDescriptionChange: (id: string, value: string) => void
  onRemove: (id: string) => void
  onImageChange: (id: string, file: File | null) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null
    onImageChange(id, file)
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
        <Input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <Button type="button" variant="ghost" size="icon" className="mt-1" onClick={() => onRemove(id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function NewLot({ params }: { params: { id: string } }) {
  const dish = getDishData(params.id)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // フォームの状態
  const [baselineLotId, setBaselineLotId] = useState<string>("")
  const [lotInfo, setLotInfo] = useState({
    lotNumber: `${dish.name.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
    status: "未調理",
    testDate: new Date().toISOString().split("T")[0],
    assignee: "",
    memo: "",
  })

  // レシピ情報の状態
  const [recipeInfo, setRecipeInfo] = useState({
    description: "",
    image: null as File | null,
  })

  // 材料の状態
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: `ing-${Date.now()}-1`, name: "", amount: "", unit: "" },
    { id: `ing-${Date.now()}-2`, name: "", amount: "", unit: "" },
  ])

  // 手順の状態
  const [steps, setSteps] = useState<Step[]>([
    { id: `step-${Date.now()}-1`, order: 1, description: "", image: null },
    { id: `step-${Date.now()}-2`, order: 2, description: "", image: null },
  ])

  // センサーの設定
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // ロット情報の入力処理
  const handleLotInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLotInfo((prev) => ({ ...prev, [name]: value }))
  }

  // レシピ情報の入力処理
  const handleRecipeInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRecipeInfo((prev) => ({ ...prev, [name]: value }))
  }

  // レシピ画像の入力処理
  const handleRecipeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null
    setRecipeInfo((prev) => ({ ...prev, image: file }))
  }

  // 材料の入力処理
  const handleIngredientChange = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients((prev) => prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)))
  }

  // 材料の追加
  const handleAddIngredient = () => {
    const newIngredient: Ingredient = {
      id: `ing-${Date.now()}`,
      name: "",
      amount: "",
      unit: "",
    }
    setIngredients((prev) => [...prev, newIngredient])
  }

  // 材料の削除
  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id))
  }

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

  // 手順の画像を更新
  const handleStepImageChange = (id: string, file: File | null) => {
    setSteps((prevSteps) => prevSteps.map((step) => (step.id === id ? { ...step, image: file } : step)))
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
        image: null,
      },
    ])
  }

  // 基準ロットの選択処理
  const handleBaselineLotChange = (value: string) => {
    setBaselineLotId(value)

    // 実際の実装では、ここで基準ロットのデータを取得して
    // 材料や手順などを自動的に設定する処理を追加します
  }

  // フォームの送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 必須項目のバリデーション
    if (!lotInfo.lotNumber || !lotInfo.status || !lotInfo.testDate) {
      toast({
        title: "入力エラー",
        description: "ロット番号、ステータス、試作日は必須項目です",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 実際の実装ではここでAPIリクエストを行います
      // 例: await fetch(`/api/dishes/${params.id}/lots`, { method: 'POST', body: formData })

      // 成功したことをシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "ロットを追加しました",
        description: `ロット ${lotInfo.lotNumber} が正常に追加されました`,
      })

      // 料理詳細ページにリダイレクト
      router.push(`/dishes/${params.id}`)
    } catch (error) {
      console.error("ロットの追加に失敗しました", error)
      toast({
        title: "エラーが発生しました",
        description: "ロットの追加に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href={`/dishes/${params.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {dish.name}に戻る
        </Link>
      </Button>

      <h1 className="text-2xl font-bold mb-6">新しいロットを追加</h1>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">基準ロット</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                既存のロットを基準として選択すると、そのロットのレシピ情報が自動的に読み込まれます。
              </p>
              <div className="space-y-2">
                <label htmlFor="baselineId" className="block font-medium">
                  基準ロット
                </label>
                <Select value={baselineLotId} onValueChange={handleBaselineLotChange}>
                  <SelectTrigger id="baselineId">
                    <SelectValue placeholder="基準ロットを選択（任意）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">基準ロットなし（新規作成）</SelectItem>
                    {dish.lots.map((lot) => (
                      <SelectItem key={lot.id} value={lot.id.toString()}>
                        {lot.lotNumber} - {lot.recipeTitle}
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
                ロット番号 <span className="text-red-500">*</span>
              </label>
              <Input
                id="lotNumber"
                name="lotNumber"
                value={lotInfo.lotNumber}
                onChange={handleLotInfoChange}
                placeholder="例: CR-2023-004"
                required
              />
              <p className="text-xs text-muted-foreground">自動生成されますが、必要に応じて変更できます</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block font-medium">
                ステータス <span className="text-red-500">*</span>
              </label>
              <Select
                value={lotInfo.status}
                onValueChange={(value) => setLotInfo((prev) => ({ ...prev, status: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="ステータスを選択" />
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
                試作日 <span className="text-red-500">*</span>
              </label>
              <Input
                id="testDate"
                name="testDate"
                type="date"
                value={lotInfo.testDate}
                onChange={handleLotInfoChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="assignee" className="block font-medium">
                担当者
              </label>
              <Input
                id="assignee"
                name="assignee"
                value={lotInfo.assignee}
                onChange={handleLotInfoChange}
                placeholder="担当者名を入力"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="memo" className="block font-medium">
              メモ
            </label>
            <Textarea
              id="memo"
              name="memo"
              value={lotInfo.memo}
              onChange={handleLotInfoChange}
              placeholder="ロットに関するメモを入力してください"
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">レシピ情報</h2>

          <div className="space-y-2">
            <label htmlFor="description" className="block font-medium">
              説明
            </label>
            <Textarea
              id="description"
              name="description"
              value={recipeInfo.description}
              onChange={handleRecipeInfoChange}
              placeholder="レシピの説明を入力してください"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="block font-medium">
              メイン画像
            </label>
            <Input id="image" name="image" type="file" accept="image/*" onChange={handleRecipeImageChange} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">材料</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddIngredient}>
                <Plus className="mr-2 h-4 w-4" />
                材料を追加
              </Button>
            </div>

            <div className="space-y-4">
              {ingredients.map((ingredient) => (
                <div key={ingredient.id} className="flex gap-4 items-start">
                  <div className="flex-grow">
                    <Input
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(ingredient.id, "name", e.target.value)}
                      placeholder="材料名"
                      className="mb-2"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      value={ingredient.amount}
                      onChange={(e) => handleIngredientChange(ingredient.id, "amount", e.target.value)}
                      placeholder="分量"
                      className="mb-2"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(ingredient.id, "unit", e.target.value)}
                      placeholder="単位"
                      className="mb-2"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-1"
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">調理手順</h3>
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
                      onImageChange={handleStepImageChange}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" asChild>
            <Link href={`/dishes/${params.id}`}>キャンセル</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </div>
      </form>
    </div>
  )
}

