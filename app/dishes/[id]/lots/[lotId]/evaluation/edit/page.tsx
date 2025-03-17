"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Save, Star, Trash2, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Image from "next/image"

// 評価データの型に画像配列を追加
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
    recipeTitle: "基本のカレーライス",
    evaluation: {
      overallRating: 4,
      tasteProfiles: {
        スパイス感: 4,
        とろみ: 5,
        甘さ: 3,
        塩味: 4,
        旨味: 5,
        辛さ: 7,
        酸味: 2,
      },
      // 星評価のカスタム項目
      customStarRatings: {
        具材のバランス: 4,
      },
      appearance: 4,
      texture: 3,
      aroma: 4,
      comments:
        "玉ねぎの甘みがよく出ていて美味しい。スパイスの香りがもう少し強くてもよいかも。全体的にバランスが良く、家庭的な味わい。",
      improvements: "- スパイスの種類を増やす\n- 煮込み時間をもう少し長くする\n- 隠し味にチョコレートを少量加えてみる",
      evaluatedBy: "山田花子",
      evaluatedAt: "2023-10-16",
      // 料理画像の配列を追加
      dishImages: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    },
  }
}

// この関数は実際の実装では非同期でデータを取得します
function getDishEvaluationSettings(dishId: string) {
  // 仮のデータ
  return {
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
  }
}

// 星評価コンポーネント
function StarRating({
  value,
  maxValue,
  onChange,
  disabled = false,
}: {
  value: number
  maxValue: number
  onChange?: (value: number) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxValue }).map((_, index) => (
        <Star
          key={index}
          className={`h-5 w-5 ${index < value ? "fill-primary text-primary" : "text-muted-foreground"} ${!disabled ? "cursor-pointer" : ""}`}
          onClick={() => !disabled && onChange && onChange(index + 1)}
        />
      ))}
      <span className="ml-1 text-sm">
        {value}/{maxValue}
      </span>
    </div>
  )
}

export default function EditLotEvaluation({ params }: { params: { id: string; lotId: string } }) {
  const lot = getLotData(params.id, params.lotId)
  const evaluation = lot.evaluation || {
    overallRating: 0,
    tasteProfiles: {},
    customStarRatings: {},
    appearance: 0,
    texture: 0,
    aroma: 0,
    comments: "",
    improvements: "",
    evaluatedBy: "",
    evaluatedAt: "",
    dishImages: [],
  }

  // 料理ごとの評価設定を取得
  const evaluationSettings = getDishEvaluationSettings(params.id)

  // 有効な評価項目を取得し、order順にソート
  const enabledItems = evaluationSettings.customItems.filter((item) => item.enabled).sort((a, b) => a.order - b.order)

  // スライダー評価項目とスター評価項目を分ける
  const sliderItems = enabledItems.filter((item) => item.type === "slider")
  const starItems = enabledItems.filter((item) => item.type === "star")
  const numberItems = enabledItems.filter((item) => item.type === "number")

  // 評価項目の値を取得する関数
  const getItemValue = (itemName: string, itemType: string): number => {
    if (itemType === "star") {
      return evaluation.customStarRatings?.[itemName] || 0
    } else {
      return evaluation.tasteProfiles?.[itemName] || 0
    }
  }

  // 状態管理
  const [overallRating, setOverallRating] = useState(evaluation.overallRating)
  const [appearance, setAppearance] = useState(evaluation.appearance)
  const [texture, setTexture] = useState(evaluation.texture)
  const [aroma, setAroma] = useState(evaluation.aroma)

  // 各評価項目の値を管理するための状態
  const [tasteValues, setTasteValues] = useState<Record<string, number>>({})
  const [starValues, setStarValues] = useState<Record<string, number>>({})

  // 初期値を設定
  useState(() => {
    const initialTasteValues: Record<string, number> = {}
    const initialStarValues: Record<string, number> = {}

    sliderItems.forEach((item) => {
      initialTasteValues[item.name] = getItemValue(item.name, "slider")
    })

    numberItems.forEach((item) => {
      initialTasteValues[item.name] = getItemValue(item.name, "number")
    })

    starItems.forEach((item) => {
      initialStarValues[item.name] = getItemValue(item.name, "star")
    })

    setTasteValues(initialTasteValues)
    setStarValues(initialStarValues)
  })

  // スライダーの値を更新する関数
  const updateTasteValue = (name: string, value: number) => {
    setTasteValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 星評価の値を更新する関数
  const updateStarValue = (name: string, value: number) => {
    setStarValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href={`/dishes/${params.id}/lots/${params.lotId}/evaluation`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          評価ページに戻る
        </Link>
      </Button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">味の評価を編集</h1>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{lot.recipeTitle}</span>
            <Badge>{lot.lotNumber}</Badge>
          </div>
        </div>
      </div>

      <form className="space-y-8">
        <div className="space-y-6 bg-card p-6 rounded-lg border">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">総合評価</h2>
            <StarRating value={overallRating} maxValue={5} onChange={setOverallRating} disabled={false} />
          </div>

          {sliderItems.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">味のプロファイル</h2>
              <div className="grid gap-6">
                {sliderItems.map((item) => {
                  const value = tasteValues[item.name] || 0
                  const maxValue = item.scale

                  return (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between">
                        <label htmlFor={item.id.toString()} className="text-sm font-medium">
                          {item.name}
                          {item.description && (
                            <span className="text-xs text-muted-foreground ml-1">({item.description})</span>
                          )}
                        </label>
                        <span className="text-sm">
                          {value}/{maxValue}
                        </span>
                      </div>
                      <Slider
                        id={item.id.toString()}
                        defaultValue={[value]}
                        max={maxValue}
                        step={1}
                        onValueChange={(values) => updateTasteValue(item.name, values[0])}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {numberItems.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">数値評価</h2>
              <div className="grid gap-6">
                {numberItems.map((item) => {
                  const value = tasteValues[item.name] || 0
                  const maxValue = item.scale

                  return (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between">
                        <label htmlFor={`number-${item.id}`} className="text-sm font-medium">
                          {item.name}
                          {item.description && (
                            <span className="text-xs text-muted-foreground ml-1">({item.description})</span>
                          )}
                        </label>
                        <span className="text-sm">
                          {value}/{maxValue}
                        </span>
                      </div>
                      <Input
                        id={`number-${item.id}`}
                        type="number"
                        min={0}
                        max={maxValue}
                        value={value}
                        onChange={(e) => {
                          const newValue = Math.min(Math.max(0, Number.parseInt(e.target.value) || 0), maxValue)
                          updateTasteValue(item.name, newValue)
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {starItems.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">その他の評価</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {starItems.map((item) => {
                  const value = starValues[item.name] || 0
                  const maxValue = item.scale

                  return (
                    <div key={item.id} className="space-y-2">
                      <label htmlFor={item.id.toString()} className="block text-sm font-medium">
                        {item.name}
                        {item.description && (
                          <span className="text-xs text-muted-foreground ml-1">({item.description})</span>
                        )}
                      </label>
                      <StarRating
                        value={value}
                        maxValue={maxValue}
                        onChange={(newValue) => updateStarValue(item.name, newValue)}
                        disabled={false}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="appearance" className="block text-sm font-medium">
                見た目
              </label>
              <StarRating value={appearance} maxValue={5} onChange={setAppearance} disabled={false} />
            </div>

            <div className="space-y-2">
              <label htmlFor="texture" className="block text-sm font-medium">
                食感
              </label>
              <StarRating value={texture} maxValue={5} onChange={setTexture} disabled={false} />
            </div>

            <div className="space-y-2">
              <label htmlFor="aroma" className="block text-sm font-medium">
                香り
              </label>
              <StarRating value={aroma} maxValue={5} onChange={setAroma} disabled={false} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">料理画像</h2>
            <p className="text-sm text-muted-foreground">調理した料理の写真を複数枚アップロードできます。</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {/* 既存の画像プレビュー */}
              {evaluation.dishImages?.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="relative aspect-square rounded-md overflow-hidden border">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`料理画像 ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      // 実際の実装では、ここで画像を削除する処理を追加
                      // 例: setEvaluation(prev => ({ ...prev, dishImages: prev.dishImages.filter((_, i) => i !== index) }))
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {/* 新規画像アップロード */}
              <div className="relative aspect-square rounded-md border border-dashed flex flex-col items-center justify-center p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  multiple
                  onChange={(e) => {
                    // 実際の実装では、ここで画像をプレビューに追加する処理を追加
                    // 例: const files = Array.from(e.target.files || [])
                    // setEvaluation(prev => ({ ...prev, dishImages: [...(prev.dishImages || []), ...files.map(f => URL.createObjectURL(f))] }))
                  }}
                />
                <Plus className="h-6 w-6 mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center">クリックして画像を追加</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="comments" className="block font-medium">
              コメント
            </label>
            <Textarea
              id="comments"
              defaultValue={evaluation.comments}
              placeholder="味の印象、バランス、特徴などについてコメントを入力してください"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="improvements" className="block font-medium">
              改善点・提案
            </label>
            <Textarea
              id="improvements"
              defaultValue={evaluation.improvements}
              placeholder="次回の試作に向けた改善点や提案を入力してください"
              rows={4}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="evaluatedBy" className="block font-medium">
                評価者
              </label>
              <Input id="evaluatedBy" defaultValue={evaluation.evaluatedBy} placeholder="評価者の名前を入力" />
            </div>

            <div className="space-y-2">
              <label htmlFor="evaluatedAt" className="block font-medium">
                評価日
              </label>
              <Input id="evaluatedAt" type="date" defaultValue={evaluation.evaluatedAt} />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" asChild>
              <Link href={`/dishes/${params.id}/lots/${params.lotId}/evaluation`}>キャンセル</Link>
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

