"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Calendar, User, Star, ClipboardList, FileText, ArrowRightLeft } from "lucide-react"

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
    hasEvaluation: true,
    evaluationRating: 4,
    baselineLot: {
      id: 2,
      lotNumber: "CR-2023-002",
      recipeTitle: "スパイシーカレー",
      recipe: {
        steps: [
          {
            order: 1,
            description: "野菜と肉を一口大に切ります。",
            imageUrl: "/placeholder.svg?height=150&width=150",
          },
          {
            order: 2,
            description: "鍋に油を熱し、肉を炒めます。",
            imageUrl: "/placeholder.svg?height=150&width=150",
          },
          {
            order: 3,
            description: "野菜を加えて炒めます。",
            imageUrl: "/placeholder.svg?height=150&width=150",
          },
          {
            order: 4,
            description: "水を加えて沸騰させ、アクを取り除きます。",
            imageUrl: "/placeholder.svg?height=150&width=150",
          },
          {
            order: 5,
            description: "弱火で30分煮込みます。",
            imageUrl: "/placeholder.svg?height=150&width=150",
          },
          {
            order: 6,
            description: "火を止め、ルーを割り入れて溶かします。",
            imageUrl: "/placeholder.svg?height=150&width=150",
          },
          {
            order: 7,
            description: "再び弱火で10分煮込みます。",
            imageUrl: "/placeholder.svg?height=150&width=150",
          },
        ],
        ingredients: [
          { name: "牛肉", amount: "300", unit: "g" },
          { name: "玉ねぎ", amount: "2", unit: "個" },
          { name: "にんじん", amount: "1", unit: "本" },
          { name: "じゃがいも", amount: "2", unit: "個" },
          { name: "カレールー", amount: "1", unit: "箱" },
          { name: "水", amount: "800", unit: "ml" },
          { name: "サラダ油", amount: "大さじ", unit: "1" },
        ],
      },
    },
    recipe: {
      title: "基本のカレーライス",
      description: "誰でも作れる基本のレシピです。じっくり煮込んだ野菜の甘みとスパイスの香りが特徴です。",
      version: "1.0",
      imageUrl: "/placeholder.svg?height=300&width=600",
      ingredients: [
        { name: "牛肉", amount: "300", unit: "g" },
        { name: "玉ねぎ", amount: "2", unit: "個" },
        { name: "にんじん", amount: "1", unit: "本" },
        { name: "じゃがいも", amount: "2", unit: "個" },
        { name: "カレールー", amount: "1", unit: "箱" },
        { name: "水", amount: "800", unit: "ml" },
        { name: "サラダ油", amount: "大さじ", unit: "1" },
      ],
      steps: [
        {
          order: 1,
          description: "野菜と肉を一口大に切ります。",
          imageUrl: "/placeholder.svg?height=150&width=150",
        },
        {
          order: 2,
          description: "フライパンに油を熱し、肉を炒めます。",
          imageUrl: "/placeholder.svg?height=150&width=150",
        },
        {
          order: 3,
          description: "野菜を加えて炒めます。玉ねぎが透き通るまで炒めるのがポイントです。",
          imageUrl: "/placeholder.svg?height=150&width=150",
        },
        {
          order: 4,
          description: "水を加えて沸騰させ、アクを取り除きます。",
          imageUrl: "/placeholder.svg?height=150&width=150",
        },
        {
          order: 5,
          description: "弱火で40分煮込みます。",
          imageUrl: "/placeholder.svg?height=150&width=150",
        },
        {
          order: 6,
          description: "火を止め、ルーを割り入れて溶かします。",
          imageUrl: "/placeholder.svg?height=150&width=150",
        },
        {
          order: 7,
          description: "再び弱火で10分煮込みます。",
          imageUrl: "/placeholder.svg?height=150&width=150",
        },
      ],
      updatedAt: "2023-10-15",
    },
  }
}

// テキストの差分を強調表示するコンポーネント
function TextDiff({ oldText, newText }: { oldText: string; newText: string }) {
  if (oldText === newText) {
    return <span>{newText}</span>
  }

  // 単純な差分検出（単語単位）
  const oldWords = oldText.split(" ")
  const newWords = newText.split(" ")

  // 最長共通部分列（LCS）を使った差分検出
  const lcs = findLCS(oldWords, newWords)

  // 差分を視覚化
  const diff = visualizeDiff(oldWords, newWords, lcs)

  return (
    <div>
      {diff.map((part, index) => {
        if (part.type === "common") {
          return <span key={index}>{part.text} </span>
        } else if (part.type === "removed") {
          return (
            <span key={index} className="bg-red-100 line-through text-red-700">
              {part.text}{" "}
            </span>
          )
        } else if (part.type === "added") {
          return (
            <span key={index} className="bg-green-100 text-green-700">
              {part.text}{" "}
            </span>
          )
        }
      })}
    </div>
  )
}

// 最長共通部分列（LCS）を見つける関数
function findLCS(a: string[], b: string[]) {
  const matrix: number[][] = Array(a.length + 1)
    .fill(0)
    .map(() => Array(b.length + 1).fill(0))

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1])
      }
    }
  }

  // LCSを再構築
  const result: string[] = []
  let i = a.length,
    j = b.length

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1])
      i--
      j--
    } else if (matrix[i - 1][j] > matrix[i][j - 1]) {
      i--
    } else {
      j--
    }
  }

  return result
}

// 差分を視覚化する関数
function visualizeDiff(oldWords: string[], newWords: string[], lcs: string[]) {
  const result: { type: "common" | "removed" | "added"; text: string }[] = []
  let oldIndex = 0
  let newIndex = 0
  let lcsIndex = 0

  while (oldIndex < oldWords.length || newIndex < newWords.length) {
    // 共通部分
    while (
      lcsIndex < lcs.length &&
      oldIndex < oldWords.length &&
      newIndex < newWords.length &&
      oldWords[oldIndex] === lcs[lcsIndex] &&
      newWords[newIndex] === lcs[lcsIndex]
    ) {
      result.push({ type: "common", text: oldWords[oldIndex] })
      oldIndex++
      newIndex++
      lcsIndex++
    }

    // 削除された部分
    while (oldIndex < oldWords.length && (lcsIndex >= lcs.length || oldWords[oldIndex] !== lcs[lcsIndex])) {
      result.push({ type: "removed", text: oldWords[oldIndex] })
      oldIndex++
    }

    // 追加された部分
    while (newIndex < newWords.length && (lcsIndex >= lcs.length || newWords[newIndex] !== lcs[lcsIndex])) {
      result.push({ type: "added", text: newWords[newIndex] })
      newIndex++
    }
  }

  return result
}

// 材料の差分を表示するコンポーネント
function IngredientDiff({
  baselineIngredients,
  currentIngredients,
}: {
  baselineIngredients: { name: string; amount: string; unit: string }[]
  currentIngredients: { name: string; amount: string; unit: string }[]
}) {
  // 材料名をキーにしたマップを作成
  const baselineMap = new Map(baselineIngredients.map((ing) => [ing.name, ing]))
  const currentMap = new Map(currentIngredients.map((ing) => [ing.name, ing]))

  // すべての材料名を取得
  const allIngredientNames = [
    ...new Set([...baselineIngredients.map((ing) => ing.name), ...currentIngredients.map((ing) => ing.name)]),
  ]

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">材料の差分</h3>
      <ul className="space-y-2">
        {allIngredientNames.map((name) => {
          const baseline = baselineMap.get(name)
          const current = currentMap.get(name)

          if (!baseline) {
            // 新しく追加された材料
            return (
              <li key={name} className="flex justify-between pb-2 border-b last:border-0">
                <span className="bg-green-100 text-green-700">{name} (新規追加)</span>
                <span className="text-muted-foreground bg-green-100 text-green-700">
                  {current?.amount} {current?.unit}
                </span>
              </li>
            )
          } else if (!current) {
            // 削除された材料
            return (
              <li key={name} className="flex justify-between pb-2 border-b last:border-0">
                <span className="bg-red-100 line-through text-red-700">{name} (削除)</span>
                <span className="text-muted-foreground bg-red-100 line-through text-red-700">
                  {baseline.amount} {baseline.unit}
                </span>
              </li>
            )
          } else if (baseline.amount !== current.amount || baseline.unit !== current.unit) {
            // 分量や単位が変更された材料
            return (
              <li key={name} className="flex justify-between pb-2 border-b last:border-0">
                <span>{name}</span>
                <div className="text-muted-foreground">
                  <span className="bg-red-100 line-through text-red-700 mr-2">
                    {baseline.amount} {baseline.unit}
                  </span>
                  <span className="bg-green-100 text-green-700">
                    {current.amount} {current.unit}
                  </span>
                </div>
              </li>
            )
          } else {
            // 変更なし
            return (
              <li key={name} className="flex justify-between pb-2 border-b last:border-0">
                <span>{name}</span>
                <span className="text-muted-foreground">
                  {current.amount} {current.unit}
                </span>
              </li>
            )
          }
        })}
      </ul>
    </div>
  )
}

export default function LotDetail({ params }: { params: { id: string; lotId: string } }) {
  const lot = getLotData(params.id, params.lotId)
  const recipe = lot.recipe
  const baselineRecipe = lot.baselineLot?.recipe

  // タブの状態管理
  const [activeTab, setActiveTab] = useState<string>("recipe")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={`/dishes/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {lot.dishName}に戻る
          </Link>
        </Button>

        <div className="bg-card rounded-lg p-6 border mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{lot.lotNumber}</h1>
                <Badge
                  variant={lot.status === "評価済み" ? "default" : lot.status === "調理済み" ? "secondary" : "outline"}
                >
                  {lot.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>試作日: {lot.testDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>担当者: {lot.assignee}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dishes/${lot.dishId}/lots/${lot.id}/evaluation`}>
                  {lot.hasEvaluation ? (
                    <>
                      <Star className="mr-2 h-4 w-4 fill-primary text-primary" />
                      評価を見る
                    </>
                  ) : (
                    <>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      評価を追加
                    </>
                  )}
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dishes/${lot.dishId}/lots/${lot.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  編集
                </Link>
              </Button>
            </div>
          </div>

          {lot.baselineLot && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-md">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">基準ロット:</span>
              <Link
                href={`/dishes/${lot.dishId}/lots/${lot.baselineLot.id}`}
                className="text-sm text-primary hover:underline"
              >
                {lot.baselineLot.lotNumber} - {lot.baselineLot.recipeTitle}
              </Link>
            </div>
          )}

          {lot.memo && (
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">メモ</h3>
              <p className="text-sm">{lot.memo}</p>
            </div>
          )}
        </div>

        {/* レシピ詳細セクション */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{recipe.title}</h2>
              <div className="text-sm text-muted-foreground mb-2">バージョン: {recipe.version}</div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dishes/${lot.dishId}/lots/${lot.id}/recipe/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                レシピを編集
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-2/3">
              <p className="text-muted-foreground mb-6">{recipe.description}</p>
            </div>

            <div className="relative h-64 md:h-auto md:w-1/3 rounded-lg overflow-hidden">
              <Image src={recipe.imageUrl || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      {lot.baselineLot && baselineRecipe && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recipe">レシピ</TabsTrigger>
            <TabsTrigger value="diff">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              基準ロットとの差分
            </TabsTrigger>
          </TabsList>
          <TabsContent value="recipe" className="pt-4">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="md:col-span-1">
                <CardHeader>
                  <h2 className="text-xl font-semibold">材料</h2>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex justify-between pb-2 border-b last:border-0">
                        <span>{ingredient.name}</span>
                        <span className="text-muted-foreground">
                          {ingredient.amount} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">作り方</h2>
                <ol className="space-y-6">
                  {recipe.steps.map((step) => (
                    <li key={step.order} className="grid md:grid-cols-[auto_1fr] gap-4">
                      <div className="flex items-center justify-center bg-muted rounded-full h-8 w-8 text-center">
                        {step.order}
                      </div>
                      <div className="space-y-2">
                        <p>{step.description}</p>
                        {step.imageUrl && (
                          <div className="relative h-32 w-32 rounded overflow-hidden">
                            <Image
                              src={step.imageUrl || "/placeholder.svg"}
                              alt={`手順 ${step.order}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="diff" className="pt-4">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="md:col-span-1">
                <CardHeader>
                  <h2 className="text-xl font-semibold">材料の差分</h2>
                </CardHeader>
                <CardContent>
                  <IngredientDiff
                    baselineIngredients={baselineRecipe.ingredients}
                    currentIngredients={recipe.ingredients}
                  />
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">作り方の差分</h2>
                <div className="bg-muted/30 p-4 rounded-md mb-6">
                  <p className="text-sm text-muted-foreground">
                    <span className="bg-red-100 line-through text-red-700 px-1 mr-1">赤色</span>
                    は削除された部分、
                    <span className="bg-green-100 text-green-700 px-1 mr-1">緑色</span>
                    は追加された部分を示しています。
                  </p>
                </div>
                <ol className="space-y-6">
                  {recipe.steps.map((step) => {
                    // 基準ロットの同じ順番の手順を探す
                    const baselineStep = baselineRecipe.steps.find((bs) => bs.order === step.order)

                    return (
                      <li key={step.order} className="grid md:grid-cols-[auto_1fr] gap-4">
                        <div className="flex items-center justify-center bg-muted rounded-full h-8 w-8 text-center">
                          {step.order}
                        </div>
                        <div className="space-y-2">
                          {baselineStep ? (
                            <TextDiff oldText={baselineStep.description} newText={step.description} />
                          ) : (
                            <p className="bg-green-100 text-green-700">{step.description} (新規追加)</p>
                          )}
                          {step.imageUrl && (
                            <div className="relative h-32 w-32 rounded overflow-hidden">
                              <Image
                                src={step.imageUrl || "/placeholder.svg"}
                                alt={`手順 ${step.order}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })}

                  {/* 基準ロットにあるが現在のロットにない手順を表示 */}
                  {baselineRecipe.steps
                    .filter((baselineStep) => !recipe.steps.some((step) => step.order === baselineStep.order))
                    .map((removedStep) => (
                      <li key={`removed-${removedStep.order}`} className="grid md:grid-cols-[auto_1fr] gap-4">
                        <div className="flex items-center justify-center bg-red-100 text-red-700 rounded-full h-8 w-8 text-center">
                          {removedStep.order}
                        </div>
                        <div className="space-y-2">
                          <p className="bg-red-100 line-through text-red-700">{removedStep.description} (削除)</p>
                        </div>
                      </li>
                    ))}
                </ol>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {(!lot.baselineLot || !baselineRecipe) && (
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-1">
            <CardHeader>
              <h2 className="text-xl font-semibold">材料</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between pb-2 border-b last:border-0">
                    <span>{ingredient.name}</span>
                    <span className="text-muted-foreground">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">作り方</h2>
            <ol className="space-y-6">
              {recipe.steps.map((step) => (
                <li key={step.order} className="grid md:grid-cols-[auto_1fr] gap-4">
                  <div className="flex items-center justify-center bg-muted rounded-full h-8 w-8 text-center">
                    {step.order}
                  </div>
                  <div className="space-y-2">
                    <p>{step.description}</p>
                    {step.imageUrl && (
                      <div className="relative h-32 w-32 rounded overflow-hidden">
                        <Image
                          src={step.imageUrl || "/placeholder.svg"}
                          alt={`手順 ${step.order}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <div className="mt-8 text-right text-sm text-muted-foreground">最終更新日: {recipe.updatedAt}</div>
    </div>
  )
}

