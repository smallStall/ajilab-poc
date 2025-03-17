"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Save, Star, ArrowRightLeft, ArrowUp, ArrowDown, Minus, ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

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
    recipeTitle: "基本のカレーライス",
    baselineLot: {
      id: 2,
      lotNumber: "CR-2023-002",
      recipeTitle: "スパイシーカレー",
      evaluation: {
        overallRating: 3,
        tasteProfiles: {
          スパイス感: 3,
          とろみ: 4,
          甘さ: 2,
          塩味: 3,
          旨味: 4,
          辛さ: 5,
          酸味: 2,
        },
        // 星評価のカスタム項目
        customStarRatings: {
          具材のバランス: 3,
        },
        appearance: 3,
        texture: 4,
        aroma: 3,
        comments: "スパイスの香りが特徴的で、辛さもちょうど良い。ルーのとろみがもう少しあると良いかも。",
        improvements: "- スパイスの種類をもう少し増やす\n- ルーのとろみを強くする",
        evaluatedBy: "佐藤健太",
        evaluatedAt: "2023-10-10",
        // 料理画像の配列を追加
        dishImages: ["/placeholder.svg?height=400&width=600"],
      },
    },
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
      dishImages: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
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
function StarRating({ value, maxValue, disabled = true }: { value: number; maxValue: number; disabled?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxValue }).map((_, index) => (
        <Star
          key={index}
          className={`h-5 w-5 ${index < value ? "fill-primary text-primary" : "text-muted-foreground"} ${!disabled ? "cursor-pointer" : ""}`}
        />
      ))}
      <span className="ml-1 text-sm">
        {value}/{maxValue}
      </span>
    </div>
  )
}

// 差分を表示する星評価コンポーネント
function DiffStarRating({ baseline, current, maxValue }: { baseline: number; current: number; maxValue: number }) {
  const diff = current - baseline
  let diffColor = ""
  let DiffIcon = Minus

  if (diff > 0) {
    diffColor = "text-green-600"
    DiffIcon = ArrowUp
  } else if (diff < 0) {
    diffColor = "text-red-600"
    DiffIcon = ArrowDown
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground mr-1">基準:</span>
        {Array.from({ length: maxValue }).map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${index < baseline ? "fill-muted-foreground text-muted-foreground" : "text-muted-foreground/30"}`}
          />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">{baseline}</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground mr-1">現在:</span>
        {Array.from({ length: maxValue }).map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${index < current ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
          />
        ))}
        <span className="ml-1 text-xs">{current}</span>
      </div>

      {diff !== 0 && (
        <div className={`flex items-center ${diffColor}`}>
          <DiffIcon className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{Math.abs(diff)}</span>
        </div>
      )}
    </div>
  )
}

// 差分を表示するスライダーコンポーネント
function DiffSlider({
  name,
  description,
  baseline,
  current,
  maxValue,
}: {
  name: string
  description?: string
  baseline: number
  current: number
  maxValue: number
}) {
  const diff = current - baseline
  let diffColor = ""
  let DiffIcon = Minus

  if (diff > 0) {
    diffColor = "text-green-600"
    DiffIcon = ArrowUp
  } else if (diff < 0) {
    diffColor = "text-red-600"
    DiffIcon = ArrowDown
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium">
          {name}
          {description && <span className="text-xs text-muted-foreground ml-1">({description})</span>}
        </label>
        {diff !== 0 && (
          <div className={`flex items-center ${diffColor}`}>
            <DiffIcon className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{Math.abs(diff)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-10">基準:</span>
          <div className="flex-1">
            <Slider value={[baseline]} max={maxValue} step={1} disabled={true} className="opacity-50" />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right">
            {baseline}/{maxValue}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-10">現在:</span>
          <div className="flex-1">
            <Slider value={[current]} max={maxValue} step={1} disabled={true} />
          </div>
          <span className="text-xs w-8 text-right">
            {current}/{maxValue}
          </span>
        </div>
      </div>
    </div>
  )
}

// テキストの差分を表示するコンポーネント
function TextDiff({ baseline, current }: { baseline: string; current: string }) {
  if (!baseline && !current) return <div className="text-muted-foreground">データなし</div>
  if (!baseline) return <div className="bg-green-100 p-2 rounded">{current}</div>
  if (!current) return <div className="bg-red-100 line-through p-2 rounded">{baseline}</div>

  // 単純な差分表示（行単位）
  const baselineLines = baseline.split("\n")
  const currentLines = current.split("\n")

  // 共通の行、削除された行、追加された行を特定
  const commonLines = baselineLines.filter((line) => currentLines.includes(line))
  const removedLines = baselineLines.filter((line) => !currentLines.includes(line))
  const addedLines = currentLines.filter((line) => !baselineLines.includes(line))

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium">基準ロットの評価:</h4>
        <div className="bg-muted p-2 rounded text-sm whitespace-pre-wrap">{baseline}</div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium">現在のロットの評価:</h4>
        <div className="bg-muted p-2 rounded text-sm whitespace-pre-wrap">{current}</div>
      </div>

      {(removedLines.length > 0 || addedLines.length > 0) && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium">変更点:</h4>
          <div className="space-y-1">
            {removedLines.map((line, index) => (
              <div key={`removed-${index}`} className="bg-red-100 text-red-700 p-1 rounded text-sm line-through">
                {line}
              </div>
            ))}
            {addedLines.map((line, index) => (
              <div key={`added-${index}`} className="bg-green-100 text-green-700 p-1 rounded text-sm">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 画像ギャラリーコンポーネント
function ImageGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-muted/30 rounded-md">
        <div className="text-center">
          <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">料理画像はありません</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div className="relative aspect-square rounded-md overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity">
                <Image src={image || "/placeholder.svg"} alt={`料理画像 ${index + 1}`} fill className="object-cover" />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <div className="relative h-[70vh] w-full">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`料理画像 ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}

export default function LotEvaluation({ params }: { params: { id: string; lotId: string } }) {
  const lot = getLotData(params.id, params.lotId)
  const evaluation = lot.evaluation || null
  const baselineEvaluation = lot.baselineLot?.evaluation || null
  const isEditing = !evaluation // 評価がない場合は編集モード

  // タブの状態管理
  const [activeTab, setActiveTab] = useState<string>("evaluation")
  const hasBaseline = !!baselineEvaluation

  // 料理ごとの評価設定を取得
  const evaluationSettings = getDishEvaluationSettings(params.id)

  // 有効な評価項目を取得し、order順にソート
  const enabledItems = evaluationSettings.customItems.filter((item) => item.enabled).sort((a, b) => a.order - b.order)

  // スライダー評価項目とスター評価項目を分ける
  const sliderItems = enabledItems.filter((item) => item.type === "slider")
  const starItems = enabledItems.filter((item) => item.type === "star")
  const numberItems = enabledItems.filter((item) => item.type === "number")

  // 評価データから項目の値を取得する関数（設定に存在しない項目は無視）
  const getItemValue = (evalData: any, itemName: string, itemType: string): number => {
    if (!evalData) return 0

    if (itemType === "star") {
      return evalData.customStarRatings?.[itemName] || 0
    } else {
      return evalData.tasteProfiles?.[itemName] || 0
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href={`/dishes/${params.id}/lots/${params.lotId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          ロット {lot.lotNumber} に戻る
        </Link>
      </Button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">味の評価</h1>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{lot.recipeTitle}</span>
            <Badge>{lot.lotNumber}</Badge>
          </div>
        </div>
        {!isEditing && (
          <Button asChild>
            <Link href={`/dishes/${params.id}/lots/${params.lotId}/evaluation/edit`}>編集</Link>
          </Button>
        )}
      </div>

      {hasBaseline && !isEditing && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="evaluation">評価</TabsTrigger>
            <TabsTrigger value="diff">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              基準ロットとの差分
            </TabsTrigger>
          </TabsList>

          <TabsContent value="evaluation">
            {/* 既存の評価表示コンテンツ */}
            <form className="space-y-8">
              <div className="space-y-6 bg-card p-6 rounded-lg border">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">総合評価</h2>
                  <StarRating value={evaluation?.overallRating || 0} maxValue={5} disabled={true} />
                </div>

                {sliderItems.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">味のプロファイル</h2>
                    <div className="grid gap-6">
                      {sliderItems.map((item) => {
                        const value = getItemValue(evaluation, item.name, "slider")
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
                              disabled={!isEditing}
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
                        const value = getItemValue(evaluation, item.name, "number")
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
                            <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center justify-center">
                              {value}
                            </div>
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
                        const value = getItemValue(evaluation, item.name, "star")
                        const maxValue = item.scale

                        return (
                          <div key={item.id} className="space-y-2">
                            <label htmlFor={item.id.toString()} className="block text-sm font-medium">
                              {item.name}
                              {item.description && (
                                <span className="text-xs text-muted-foreground ml-1">({item.description})</span>
                              )}
                            </label>
                            <StarRating value={value} maxValue={maxValue} disabled={true} />
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
                    <StarRating value={evaluation?.appearance || 0} maxValue={5} disabled={true} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="texture" className="block text-sm font-medium">
                      食感
                    </label>
                    <StarRating value={evaluation?.texture || 0} maxValue={5} disabled={true} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="aroma" className="block text-sm font-medium">
                      香り
                    </label>
                    <StarRating value={evaluation?.aroma || 0} maxValue={5} disabled={true} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">料理画像</h2>
                {evaluation?.dishImages && evaluation.dishImages.length > 0 ? (
                  <ImageGallery images={evaluation.dishImages} />
                ) : (
                  <p className="text-muted-foreground">料理画像はありません</p>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="comments" className="block font-medium">
                    コメント
                  </label>
                  {isEditing ? (
                    <Textarea
                      id="comments"
                      placeholder="味の印象、バランス、特徴などについてコメントを入力してください"
                      rows={4}
                    />
                  ) : (
                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                      {evaluation?.comments || "コメントなし"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="improvements" className="block font-medium">
                    改善点・提案
                  </label>
                  {isEditing ? (
                    <Textarea
                      id="improvements"
                      placeholder="次回の試作に向けた改善点や提案を入力してください"
                      rows={4}
                    />
                  ) : (
                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                      {evaluation?.improvements || "改善点・提案なし"}
                    </div>
                  )}
                </div>
              </div>

              {isEditing &&
                (
                  <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="evaluatedBy" className="block font-medium">
                        評価者
                      </label>
                      <Input id="evaluatedBy" placeholder="評価者の名前を入力" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="evaluatedAt" className="block font-medium">
                        評価日
                      </label>
                      <Input id="evaluatedAt" type="date" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt  />
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
                </div>
                )}

              {!isEditing && (
                <div className="text-right text-sm text-muted-foreground">
                  評価者: {evaluation?.evaluatedBy} | 評価日: {evaluation?.evaluatedAt}
                </div>
              )}
            </form>
          </TabsContent>

          <TabsContent value="diff">
            {/* 差分表示コンテンツ */}
            <div className="space-y-8">
              <div className="space-y-6 bg-card p-6 rounded-lg border">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">総合評価の差分</h2>
                  <DiffStarRating
                    baseline={baselineEvaluation?.overallRating || 0}
                    current={evaluation?.overallRating || 0}
                    maxValue={5}
                  />
                </div>

                {sliderItems.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">味のプロファイルの差分</h2>
                    <div className="grid gap-6">
                      {sliderItems.map((item) => {
                        const baselineValue = getItemValue(baselineEvaluation, item.name, "slider")
                        const currentValue = getItemValue(evaluation, item.name, "slider")
                        const maxValue = item.scale

                        return (\
                          <DiffSlider
                        key={item.id}
                        name={item.name}
                        description={item.description}
                        baseline = { baselineValue }
                        current = { currentValue }
                        maxValue={maxValue}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}

                {numberItems.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">数値評価の差分</h2>
                    <div className="grid gap-6">
                      {numberItems.map((item) => {
                        const baselineValue = getItemValue(baselineEvaluation, item.name, "number")
                        const currentValue = getItemValue(evaluation, item.name, "number")
                        const diff = currentValue - baselineValue
                        let diffColor = ""
                        let DiffIcon = Minus

                        if (diff > 0) {
                          diffColor = "text-green-600"
                          DiffIcon = ArrowUp
                        } else if (diff < 0) {
                          diffColor = "text-red-600"
                          DiffIcon = ArrowDown
                        }

                        return (
                          <div key={item.id} className="space-y-2">
                            <div className="flex justify-between">
                              <label className="text-sm font-medium">
                                {item.name}
                                {item.description && (
                                  <span className="text-xs text-muted-foreground ml-1">({item.description})</span>
                                )}
                              </label>
                              {diff !== 0 && (
                                <div className={`flex items-center ${diffColor}`}>
                                  <DiffIcon className="h-4 w-4 mr-1" />
                                  <span className="text-sm font-medium">{Math.abs(diff)}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center">
                                <span className="text-sm text-muted-foreground mr-2">基準:</span>
                                <div className="h-8 px-3 py-1 rounded-md border bg-muted flex items-center justify-center text-muted-foreground">
                                  {baselineValue}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-muted-foreground mr-2">現在:</span>
                                <div className="h-8 px-3 py-1 rounded-md border bg-muted flex items-center justify-center">
                                  {currentValue}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {starItems.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">その他の評価の差分</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {starItems.map((item) => {
                        const baselineValue = getItemValue(baselineEvaluation, item.name, "star")
                        const currentValue = getItemValue(evaluation, item.name, "star")
                        const maxValue = item.scale

                        return (
                          <div key={item.id} className="space-y-2">
                            <label className="block text-sm font-medium">
                              {item.name}
                              {item.description && (
                                <span className="text-xs text-muted-foreground ml-1">({item.description})</span>
                              )}
                            </label>
                            <DiffStarRating baseline={baselineValue} current={currentValue} maxValue={maxValue} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">外観・食感・香りの差分</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">見た目</label>
                      <DiffStarRating
                        baseline={baselineEvaluation?.appearance || 0}
                        current={evaluation?.appearance || 0}
                        maxValue={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">食感</label>
                      <DiffStarRating
                        baseline={baselineEvaluation?.texture || 0}
                        current={evaluation?.texture || 0}
                        maxValue={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">香り</label>
                      <DiffStarRating
                        baseline={baselineEvaluation?.aroma || 0}
                        current={evaluation?.aroma || 0}
                        maxValue={5}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold">料理画像の差分</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      基準ロットの画像 ({baselineEvaluation?.dishImages?.length || 0}枚)
                    </h4>
                    {baselineEvaluation?.dishImages && baselineEvaluation.dishImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {baselineEvaluation.dishImages.map((image, index) => (
                          <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`基準ロット料理画像 ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">画像なし</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      現在のロットの画像 ({evaluation?.dishImages?.length || 0}枚)
                    </h4>
                    {evaluation?.dishImages && evaluation.dishImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {evaluation.dishImages.map((image, index) => (
                          <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`現在のロット料理画像 ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">画像なし</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">コメントの差分</h2>
                  <TextDiff baseline={baselineEvaluation?.comments || ""} current={evaluation?.comments || ""} />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">改善点・提案の差分</h2>
                  <TextDiff
                    baseline={baselineEvaluation?.improvements || ""}
                    current={evaluation?.improvements || ""}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <div>
                  基準ロット評価者: {baselineEvaluation?.evaluatedBy} | 評価日: {baselineEvaluation?.evaluatedAt}
                </div>
                <div>
                  現在のロット評価者: {evaluation?.evaluatedBy} | 評価日: {evaluation?.evaluatedAt}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {(!hasBaseline || isEditing) && (
        <form className="space-y-8">
          <div className="space-y-6 bg-card p-6 rounded-lg border">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">総合評価</h2>
              <StarRating value={evaluation?.overallRating || 0} maxValue={5} disabled={true} />
            </div>

            {sliderItems.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">味のプロファイル</h2>
                <div className="grid gap-6">
                  {sliderItems.map((item) => {
                    const value = getItemValue(evaluation, item.name, "slider")
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
                          disabled={!isEditing}
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
                    const value = getItemValue(evaluation, item.name, "number")
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
                        <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center justify-center">
                          {value}
                        </div>
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
                    const value = getItemValue(evaluation, item.name, "star")
                    const maxValue = item.scale

                    return (
                      <div key={item.id} className="space-y-2">
                        <label htmlFor={item.id.toString()} className="block text-sm font-medium">
                          {item.name}
                          {item.description && (
                            <span className="text-xs text-muted-foreground ml-1">({item.description})</span>
                          )}
                        </label>
                        <StarRating value={value} maxValue={maxValue} disabled={true} />
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
                <StarRating value={evaluation?.appearance || 0} maxValue={5} disabled={true} />
              </div>

              <div className="space-y-2">
                <label htmlFor="texture" className="block text-sm font-medium">
                  食感
                </label>
                <StarRating value={evaluation?.texture || 0} maxValue={5} disabled={true} />
              </div>

              <div className="space-y-2">
                <label htmlFor="aroma" className="block text-sm font-medium">
                  香り
                </label>
                <StarRating value={evaluation?.aroma || 0} maxValue={5} disabled={true} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">料理画像</h2>
            {evaluation?.dishImages && evaluation.dishImages.length > 0 ? (
              <ImageGallery images={evaluation.dishImages} />
            ) : (
              <p className="text-muted-foreground">料理画像はありません</p>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="comments" className="block font-medium">
                コメント
              </label>
              {isEditing ? (
                <Textarea
                  id="comments"
                  placeholder="味の印象、バランス、特徴などについてコメントを入力してください"
                  rows={4}
                />
              ) : (
                <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                  {evaluation?.comments || "コメントなし"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="improvements" className="block font-medium">
                改善点・提案
              </label>
              {isEditing ? (
                <Textarea id="improvements" placeholder="次回の試作に向けた改善点や提案を入力してください" rows={4} />
              ) : (
                <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                  {evaluation?.improvements || "改善点・提案なし"}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="evaluatedBy" className="block font-medium">
                    評価者
                  </label>
                  <Input id="evaluatedBy" placeholder="評価者の名前を入力" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="evaluatedAt" className="block font-medium">
                    評価日
                  </label>
                  <Input id="evaluatedAt" type="date" />
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
            </div>
          )}

          {!isEditing && (
            <div className="text-right text-sm text-muted-foreground">
              評価者: {evaluation?.evaluatedBy} | 評価日: {evaluation?.evaluatedAt}
            </div>
          )}
        </form>
      )}
    </div>
  )
}

