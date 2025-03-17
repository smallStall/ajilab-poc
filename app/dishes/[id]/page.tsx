"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Edit,
  Plus,
  Calendar,
  Star,
  Settings,
  ArrowRightLeft,
  FileText,
  ChefHat,
  ListChecks,
  Search,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// getDishData 関数内の各ロットのデータに評価情報を追加します
// 例えば、lot.id === 2 のロットに評価情報を追加します
function getDishData(id: string) {
  // 仮のデータ
  return {
    id: Number.parseInt(id),
    name: "カレーライス",
    description:
      "定番の日本風カレーライス。様々なバリエーションがあり、家庭料理の定番として親しまれています。野菜や肉をじっくり煮込んだルーに、スパイスを加えて作る日本独自の発展を遂げた料理です。",
    imageUrl: "/placeholder.svg?height=300&width=600",
    lots: [
      {
        id: 1,
        lotNumber: "CR-2023-001",
        status: "評価済み",
        testDate: "2023-10-15",
        assignee: "田中太郎",
        recipeTitle: "基本のカレーライス",
        hasEvaluation: true,
        evaluationRating: 4,
        evaluation: {
          overallRating: 4,
          tasteProfiles: {
            スパイス感: 4,
            とろみ: 5,
            甘さ: 3,
            塩味: 4,
            旨味: 5,
            辛さ: 2,
            酸味: 2,
          },
          customStarRatings: {
            具材のバランス: 4,
          },
          appearance: 4,
          texture: 3,
          aroma: 4,
        },
        baselineLot: null, // 基準ロットなし（最初のロット）
        recipe: {
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
            { order: 1, description: "野菜と肉を一口大に切ります。" },
            { order: 2, description: "鍋に油を熱し、肉を炒めます。" },
            { order: 3, description: "野菜を加えて炒めます。" },
            { order: 4, description: "水を加えて沸騰させ、アクを取り除きます。" },
            { order: 5, description: "弱火で30分煮込みます。" },
            { order: 6, description: "火を止め、ルーを割り入れて溶かします。" },
            { order: 7, description: "再び弱火で10分煮込みます。" },
          ],
        },
      },
      {
        id: 2,
        lotNumber: "CR-2023-002",
        status: "評価済み",
        testDate: "2023-11-02",
        assignee: "鈴木花子",
        recipeTitle: "スパイシーカレー",
        hasEvaluation: true,
        evaluationRating: 3,
        evaluation: {
          overallRating: 3,
          tasteProfiles: {
            スパイス感: 5,
            とろみ: 3,
            甘さ: 2,
            塩味: 4,
            旨味: 4,
            辛さ: 7,
            酸味: 3,
          },
          customStarRatings: {
            具材のバランス: 3,
          },
          appearance: 3,
          texture: 4,
          aroma: 5,
        },
        baselineLot: {
          id: 1,
          lotNumber: "CR-2023-001",
          recipeTitle: "基本のカレーライス",
          evaluation: {
            overallRating: 4,
            tasteProfiles: {
              スパイス感: 4,
              とろみ: 5,
              甘さ: 3,
              塩味: 4,
              旨味: 5,
              辛さ: 2,
              酸味: 2,
            },
            customStarRatings: {
              具材のバランス: 4,
            },
            appearance: 4,
            texture: 3,
            aroma: 4,
          },
        },
        recipe: {
          ingredients: [
            { name: "牛肉", amount: "300", unit: "g" },
            { name: "玉ねぎ", amount: "2", unit: "個" },
            { name: "にんじん", amount: "1", unit: "本" },
            { name: "じゃがいも", amount: "2", unit: "個" },
            { name: "カレールー", amount: "1", unit: "箱" },
            { name: "水", amount: "800", unit: "ml" },
            { name: "サラダ油", amount: "大さじ", unit: "1" },
            { name: "ガラムマサラ", amount: "小さじ", unit: "1" }, // 追加された材料
            { name: "唐辛子", amount: "1", unit: "本" }, // 追加された材料
          ],
          steps: [
            { order: 1, description: "野菜と肉を一口大に切ります。" },
            { order: 2, description: "鍋に油を熱し、肉を炒めます。" },
            { order: 3, description: "野菜を加えて炒めます。" },
            { order: 4, description: "水を加えて沸騰させ、アクを取り除きます。" },
            { order: 5, description: "弱火で30分煮込みます。" },
            { order: 6, description: "火を止め、ルーを割り入れて溶かします。" },
            { order: 7, description: "再び弱火で10分煮込みます。" },
            { order: 8, description: "仕上げにガラムマサラを加えて混ぜます。" }, // 追加された手順
          ],
        },
        diffDetails: {
          ingredients: {
            added: [
              { name: "ガラムマサラ", amount: "小さじ", unit: "1" },
              { name: "唐辛子", amount: "1", unit: "本" },
            ],
            removed: [],
            modified: [],
          },
          steps: {
            added: [{ order: 8, description: "仕上げにガラムマサラを加えて混ぜます。" }],
            removed: [],
            modified: [],
          },
        },
      },
      {
        id: 3,
        lotNumber: "CR-2023-003",
        status: "評価済み",
        testDate: "2023-11-10",
        assignee: "佐藤次郎",
        recipeTitle: "野菜たっぷりカレー",
        hasEvaluation: true,
        evaluation: {
          overallRating: 5,
          tasteProfiles: {
            スパイス感: 4,
            とろみ: 4,
            甘さ: 4,
            塩味: 3,
            旨味: 5,
            辛さ: 3,
            酸味: 2,
          },
          customStarRatings: {
            具材のバランス: 5,
          },
          appearance: 5,
          texture: 4,
          aroma: 4,
        },
        baselineLot: {
          id: 1,
          lotNumber: "CR-2023-001",
          recipeTitle: "基本のカレーライス",
          evaluation: {
            overallRating: 4,
            tasteProfiles: {
              スパイス感: 4,
              とろみ: 5,
              甘さ: 3,
              塩味: 4,
              旨味: 5,
              辛さ: 2,
              酸味: 2,
            },
            customStarRatings: {
              具材のバランス: 4,
            },
            appearance: 4,
            texture: 3,
            aroma: 4,
          },
        },
        recipe: {
          ingredients: [
            { name: "牛肉", amount: "200", unit: "g" }, // 分量変更
            { name: "玉ねぎ", amount: "3", unit: "個" }, // 分量変更
            { name: "にんじん", amount: "2", unit: "本" }, // 分量変更
            { name: "じゃがいも", amount: "3", unit: "個" }, // 分量変更
            { name: "カレールー", amount: "1", unit: "箱" },
            { name: "水", amount: "1000", unit: "ml" }, // 分量変更
            { name: "サラダ油", amount: "大さじ", unit: "1" },
            { name: "かぼちゃ", amount: "1/4", unit: "個" }, // 追加
            { name: "ズッキーニ", amount: "1", unit: "本" }, // 追加
            { name: "なす", amount: "1", unit: "個" }, // 追加
          ],
          steps: [
            { order: 1, description: "野菜と肉を一口大に切ります。" },
            { order: 2, description: "フライパンに油を熱し、肉を炒めます。" }, // 変更（鍋→フライパン）
            { order: 3, description: "玉ねぎを加えて透き通るまで炒めます。" }, // 変更
            { order: 4, description: "残りの野菜を加えて炒めます。" }, // 追加
            { order: 5, description: "水を加えて沸騰させ、アクを取り除きます。" },
            { order: 6, description: "弱火で40分煮込みます。" }, // 変更（30分→40分）
            { order: 7, description: "火を止め、ルーを割り入れて溶かします。" },
            { order: 8, description: "再び弱火で10分煮込みます。" },
          ],
        },
        diffDetails: {
          ingredients: {
            added: [
              { name: "かぼちゃ", amount: "1/4", unit: "個" },
              { name: "ズッキーニ", amount: "1", unit: "本" },
              { name: "なす", amount: "1", unit: "個" },
            ],
            removed: [],
            modified: [
              {
                name: "牛肉",
                from: { amount: "300", unit: "g" },
                to: { amount: "200", unit: "g" },
              },
              {
                name: "玉ねぎ",
                from: { amount: "2", unit: "個" },
                to: { amount: "3", unit: "個" },
              },
              {
                name: "にんじん",
                from: { amount: "1", unit: "本" },
                to: { amount: "2", unit: "本" },
              },
              {
                name: "じゃがいも",
                from: { amount: "2", unit: "個" },
                to: { amount: "3", unit: "個" },
              },
              {
                name: "水",
                from: { amount: "800", unit: "ml" },
                to: { amount: "1000", unit: "ml" },
              },
            ],
          },
          steps: {
            added: [{ order: 4, description: "残りの野菜を加えて炒めます。" }],
            removed: [],
            modified: [
              {
                order: 2,
                from: "鍋に油を熱し、肉を炒めます。",
                to: "フライパンに油を熱し、肉を炒めます。",
              },
              {
                order: 3,
                from: "野菜を加えて炒めます。",
                to: "玉ねぎを加えて透き通るまで炒めます。",
              },
              {
                order: 6,
                from: "弱火で30分煮込みます。",
                to: "弱火で40分煮込みます。",
              },
            ],
          },
        },
      },
    ],
  }
}

// 差分の詳細を表示するコンポーネント
function DiffDetails({
  diffDetails,
}: {
  diffDetails?: {
    ingredients: {
      added: { name: string; amount: string; unit: string }[]
      removed: { name: string; amount: string; unit: string }[]
      modified: { name: string; from: { amount: string; unit: string }; to: { amount: string; unit: string } }[]
    }
    steps: {
      added: { order: number; description: string }[]
      removed: { order: number; description: string }[]
      modified: { order: number; from: string; to: string }[]
    }
  }
}) {
  const [isOpen, setIsOpen] = useState(false)

  if (!diffDetails) return null

  const { ingredients, steps } = diffDetails
  const hasIngredientChanges =
    ingredients.added.length > 0 || ingredients.removed.length > 0 || ingredients.modified.length > 0
  const hasStepChanges = steps.added.length > 0 || steps.removed.length > 0 || steps.modified.length > 0

  if (!hasIngredientChanges && !hasStepChanges) return null

  // 表示する変更点の数を制限
  const maxDisplayItems = 2

  // 材料の変更内容を簡潔に表示するテキストを生成
  const getIngredientChangeText = () => {
    const changes = []

    // 追加された材料
    if (ingredients.added.length > 0) {
      const addedNames = ingredients.added.map((item) => item.name)
      const displayNames = addedNames.slice(0, maxDisplayItems)
      const remainingCount = addedNames.length - displayNames.length

      let text = `${displayNames.join("、")}を追加`
      if (remainingCount > 0) {
        text += `（他${remainingCount}件）`
      }
      changes.push(
        <span key="added" className="bg-green-100 text-green-700 px-1 rounded mr-1">
          {text}
        </span>,
      )
    }

    // 削除された材料
    if (ingredients.removed.length > 0) {
      const removedNames = ingredients.removed.map((item) => item.name)
      const displayNames = removedNames.slice(0, maxDisplayItems)
      const remainingCount = removedNames.length - displayNames.length

      let text = `${displayNames.join("、")}を削除`
      if (remainingCount > 0) {
        text += `（他${remainingCount}件）`
      }
      changes.push(
        <span key="removed" className="bg-red-100 text-red-700 px-1 rounded mr-1">
          {text}
        </span>,
      )
    }

    // 変更された材料
    if (ingredients.modified.length > 0) {
      const modifiedNames = ingredients.modified.map((item) => item.name)
      const displayNames = modifiedNames.slice(0, maxDisplayItems)
      const remainingCount = modifiedNames.length - displayNames.length

      let text = `${displayNames.join("、")}の分量を変更`
      if (remainingCount > 0) {
        text += `（他${remainingCount}件）`
      }
      changes.push(
        <span key="modified" className="bg-amber-100 text-amber-700 px-1 rounded mr-1">
          {text}
        </span>,
      )
    }

    return changes
  }

  // 手順の変更内容を簡潔に表示するテキストを生成
  const getStepChangeText = () => {
    const changes = []

    // 追加された手順
    if (steps.added.length > 0) {
      const addedSteps = steps.added.map((step) => `手順${step.order}`)
      const displaySteps = addedSteps.slice(0, maxDisplayItems)
      const remainingCount = addedSteps.length - displaySteps.length

      let text = `${displaySteps.join("、")}を追加`
      if (remainingCount > 0) {
        text += `（他${remainingCount}件）`
      }
      changes.push(
        <span key="added" className="bg-green-100 text-green-700 px-1 rounded mr-1">
          {text}
        </span>,
      )
    }

    // 削除された手順
    if (steps.removed.length > 0) {
      const removedSteps = steps.removed.map((step) => `手順${step.order}`)
      const displaySteps = removedSteps.slice(0, maxDisplayItems)
      const remainingCount = removedSteps.length - displaySteps.length

      let text = `${displaySteps.join("、")}を削除`
      if (remainingCount > 0) {
        text += `（他${remainingCount}件）`
      }
      changes.push(
        <span key="removed" className="bg-red-100 text-red-700 px-1 rounded mr-1">
          {text}
        </span>,
      )
    }

    // 変更された手順
    if (steps.modified.length > 0) {
      const modifiedSteps = steps.modified.map((step) => {
        // 変更内容の特徴を抽出（例：「鍋」→「フライパン」）
        const fromWords = step.from.split(" ")
        const toWords = step.to.split(" ")
        const diffWords = toWords.filter((word) => !fromWords.includes(word))

        if (diffWords.length > 0 && diffWords[0].length > 1) {
          return `手順${step.order}（${diffWords[0]}）`
        }
        return `手順${step.order}`
      })

      const displaySteps = modifiedSteps.slice(0, maxDisplayItems)
      const remainingCount = modifiedSteps.length - displaySteps.length

      let text = `${displaySteps.join("、")}を変更`
      if (remainingCount > 0) {
        text += `（他${remainingCount}件）`
      }
      changes.push(
        <span key="modified" className="bg-amber-100 text-amber-700 px-1 rounded mr-1">
          {text}
        </span>,
      )
    }

    return changes
  }

  // 詳細な変更内容を表示
  const renderDetailedChanges = () => {
    return (
      <div className="space-y-4 mt-2">
        {hasIngredientChanges && (
          <div>
            <h5 className="text-xs font-medium mb-1">材料の変更</h5>
            <ul className="text-xs space-y-1">
              {ingredients.added.map((item, index) => (
                <li key={`added-${index}`} className="text-green-700">
                  <span className="font-medium">追加:</span> {item.name} {item.amount} {item.unit}
                </li>
              ))}
              {ingredients.removed.map((item, index) => (
                <li key={`removed-${index}`} className="text-red-700">
                  <span className="font-medium">削除:</span> {item.name} {item.amount} {item.unit}
                </li>
              ))}
              {ingredients.modified.map((item, index) => (
                <li key={`modified-${index}`} className="text-amber-700">
                  <span className="font-medium">変更:</span> {item.name} {item.from.amount} {item.from.unit} →{" "}
                  {item.to.amount} {item.to.unit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasStepChanges && (
          <div>
            <h5 className="text-xs font-medium mb-1">手順の変更</h5>
            <ul className="text-xs space-y-1">
              {steps.added.map((step, index) => (
                <li key={`added-${index}`} className="text-green-700">
                  <span className="font-medium">追加 (手順{step.order}):</span> {step.description}
                </li>
              ))}
              {steps.removed.map((step, index) => (
                <li key={`removed-${index}`} className="text-red-700">
                  <span className="font-medium">削除 (手順{step.order}):</span> {step.description}
                </li>
              ))}
              {steps.modified.map((step, index) => (
                <li key={`modified-${index}`} className="text-amber-700">
                  <span className="font-medium">変更 (手順{step.order}):</span>
                  <div className="ml-2 mt-1">
                    <div className="line-through">{step.from}</div>
                    <div>{step.to}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mt-3 pt-3 border-t">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <ArrowRightLeft className="h-4 w-4 mr-1 text-muted-foreground" />
            基準ロットからの変更点
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              {isOpen ? "閉じる" : "詳細"}
            </Button>
          </CollapsibleTrigger>
        </div>

        <div className="space-y-2">
          {hasIngredientChanges && (
            <div className="flex items-start gap-1">
              <ChefHat className="h-3 w-3 mt-1 text-muted-foreground" />
              <div className="flex-1 text-xs">{getIngredientChangeText()}</div>
            </div>
          )}

          {hasStepChanges && (
            <div className="flex items-start gap-1">
              <ListChecks className="h-3 w-3 mt-1 text-muted-foreground" />
              <div className="flex-1 text-xs">{getStepChangeText()}</div>
            </div>
          )}
        </div>

        <CollapsibleContent>{renderDetailedChanges()}</CollapsibleContent>
      </Collapsible>
    </div>
  )
}

// 評価の差分を表示するコンポーネント
function EvaluationDiff({
  baselineEvaluation,
  currentEvaluation,
}: {
  baselineEvaluation?: {
    overallRating: number
    tasteProfiles?: Record<string, number>
    customStarRatings?: Record<string, number>
    appearance?: number
    texture?: number
    aroma?: number
  }
  currentEvaluation?: {
    overallRating: number
    tasteProfiles?: Record<string, number>
    customStarRatings?: Record<string, number>
    appearance?: number
    texture?: number
    aroma?: number
  }
}) {
  if (!baselineEvaluation || !currentEvaluation) return null

  // 総合評価の差分
  const overallDiff = currentEvaluation.overallRating - baselineEvaluation.overallRating

  // 主要な味の評価項目を選択（最大3つまで）
  const mainTasteItems = ["スパイス感", "とろみ", "辛さ"]

  // 表示する評価項目を選択
  const displayItems = [
    { name: "総合評価", baseline: baselineEvaluation.overallRating, current: currentEvaluation.overallRating },
    ...mainTasteItems
      .map((item) => ({
        name: item,
        baseline: baselineEvaluation.tasteProfiles?.[item] || 0,
        current: currentEvaluation.tasteProfiles?.[item] || 0,
      }))
      .filter((item) => item.baseline !== 0 || item.current !== 0),
    { name: "見た目", baseline: baselineEvaluation.appearance || 0, current: currentEvaluation.appearance || 0 },
    { name: "食感", baseline: baselineEvaluation.texture || 0, current: currentEvaluation.texture || 0 },
    { name: "香り", baseline: baselineEvaluation.aroma || 0, current: currentEvaluation.aroma || 0 },
  ]

  // 差分が大きい順にソート（絶対値で比較）
  const sortedItems = [...displayItems].sort(
    (a, b) => Math.abs(b.current - b.baseline) - Math.abs(a.current - a.baseline),
  )

  // 上位3つの項目を表示
  const topItems = sortedItems.slice(0, 3)

  return (
    <div className="mt-3 pt-3 border-t">
      <h4 className="text-sm font-medium mb-2 flex items-center">
        <Star className="h-4 w-4 mr-1 text-muted-foreground" />
        評価の差分
      </h4>
      <div className="grid grid-cols-3 gap-2">
        {topItems.map((item, index) => {
          const diff = item.current - item.baseline
          let diffColor = "text-muted-foreground"
          let DiffIcon = Minus

          if (diff > 0) {
            diffColor = "text-green-600"
            DiffIcon = ArrowUp
          } else if (diff < 0) {
            diffColor = "text-red-600"
            DiffIcon = ArrowDown
          }

          return (
            <div key={index} className="flex flex-col items-center text-xs p-1 rounded-md bg-muted/30">
              <span className="text-muted-foreground mb-1">{item.name}</span>
              <div className={`flex items-center ${diffColor}`}>
                <DiffIcon className="h-3 w-3 mr-1" />
                <span className="font-medium">{Math.abs(diff)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DishDetail({ params }: { params: { id: string } }) {
  const dish = getDishData(params.id)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [filteredLots, setFilteredLots] = useState(dish.lots)

  // dish データを参照するための ref を作成
  const dishRef = useRef(dish)

  // 検索キーワードが変更されたときにフィルタリングを実行
  useEffect(() => {
    if (!searchKeyword.trim()) {
      setFilteredLots(dishRef.current.lots)
      return
    }

    const keyword = searchKeyword.toLowerCase()
    const filtered = dishRef.current.lots.filter((lot) => {
      // ロット番号、ステータス、担当者、レシピタイトルで検索
      const basicInfoMatch =
        lot.lotNumber.toLowerCase().includes(keyword) ||
        lot.status.toLowerCase().includes(keyword) ||
        lot.assignee.toLowerCase().includes(keyword) ||
        (lot.recipeTitle && lot.recipeTitle.toLowerCase().includes(keyword))

      // 材料で検索
      const ingredientsMatch = lot.recipe.ingredients.some(
        (ing) =>
          ing.name.toLowerCase().includes(keyword) ||
          ing.amount.toLowerCase().includes(keyword) ||
          ing.unit.toLowerCase().includes(keyword),
      )

      // 手順で検索
      const stepsMatch = lot.recipe.steps.some((step) => step.description.toLowerCase().includes(keyword))

      // 変更点で検索
      let diffMatch = false
      if (lot.diffDetails) {
        const { ingredients, steps } = lot.diffDetails

        // 材料の変更内容を検索
        const hasInIngredients =
          ingredients.added.some(
            (ing) =>
              ing.name.toLowerCase().includes(keyword) ||
              ing.amount.toLowerCase().includes(keyword) ||
              ing.unit.toLowerCase().includes(keyword),
          ) ||
          ingredients.removed.some(
            (ing) =>
              ing.name.toLowerCase().includes(keyword) ||
              ing.amount.toLowerCase().includes(keyword) ||
              ing.unit.toLowerCase().includes(keyword),
          ) ||
          ingredients.modified.some(
            (ing) =>
              ing.name.toLowerCase().includes(keyword) ||
              ing.from.amount.toLowerCase().includes(keyword) ||
              ing.from.unit.toLowerCase().includes(keyword) ||
              ing.to.amount.toLowerCase().includes(keyword) ||
              ing.to.unit.toLowerCase().includes(keyword),
          )

        // 手順の変更内容を検索
        const hasInSteps =
          steps.added.some((step) => step.description.toLowerCase().includes(keyword)) ||
          steps.removed.some((step) => step.description.toLowerCase().includes(keyword)) ||
          steps.modified.some(
            (step) => step.from.toLowerCase().includes(keyword) || step.to.toLowerCase().includes(keyword),
          )

        diffMatch = hasInIngredients || hasInSteps
      }

      return basicInfoMatch || ingredientsMatch || stepsMatch || diffMatch
    })

    setFilteredLots(filtered)
  }, [searchKeyword]) // dish.lots を依存配列から削除

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative h-64 md:h-auto md:w-1/3 rounded-lg overflow-hidden">
            <Image src={dish.imageUrl || "/placeholder.svg"} alt={dish.name} fill className="object-cover" />
          </div>

          <div className="md:w-2/3">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{dish.name}</h1>
                {/* カテゴリーバッジを削除 */}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dishes/${dish.id}/evaluation-settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    評価項目設定
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dishes/${dish.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    編集
                  </Link>
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">{dish.description}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">ロット一覧</h2>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="ロット、材料、手順などを検索..."
              className="pl-10"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href={`/dishes/${dish.id}/lots/new`}>
              <Plus className="mr-2 h-4 w-4" />
              新しいロットを追加
            </Link>
          </Button>
        </div>
      </div>

      {filteredLots.length === 0 ? (
        <div className="text-center py-8 bg-muted rounded-lg">
          <p className="text-muted-foreground">条件に一致するロットがありません</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLots.map((lot) => (
            <Card key={lot.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/dishes/${dish.id}/lots/${lot.id}`} className="hover:underline">
                      <h3 className="font-semibold text-lg">{lot.lotNumber}</h3>
                    </Link>
                    <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>試作日: {lot.testDate}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {/* ステータスバッジの表示条件を変更 */}
                    <Badge
                      variant={
                        lot.status === "評価済み" ? "default" : lot.status === "調理済み" ? "secondary" : "outline"
                      }
                    >
                      {lot.status}
                    </Badge>
                    {lot.hasEvaluation && (
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${star <= lot.evaluationRating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm">担当者: {lot.assignee}</span>

                    {lot.baselineLot && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <FileText className="h-3 w-3" />
                        <span>基準ロット: </span>
                        <Link
                          href={`/dishes/${dish.id}/lots/${lot.baselineLot.id}`}
                          className="text-primary hover:underline"
                        >
                          {lot.baselineLot.lotNumber}
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {lot.hasEvaluation ? (
                      <Link
                        href={`/dishes/${dish.id}/lots/${lot.id}/evaluation`}
                        className="text-sm text-primary hover:underline"
                      >
                        評価を見る
                      </Link>
                    ) : (
                      <Link
                        href={`/dishes/${dish.id}/lots/${lot.id}/evaluation`}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        評価を追加
                      </Link>
                    )}
                    <span className="text-muted-foreground">|</span>
                    <Link href={`/dishes/${dish.id}/lots/${lot.id}`} className="text-sm text-primary hover:underline">
                      詳細を見る
                    </Link>
                  </div>
                </div>

                {/* 基準ロットとの差分詳細 */}
                {lot.baselineLot && lot.diffDetails && <DiffDetails diffDetails={lot.diffDetails} />}
                {lot.baselineLot && lot.evaluation && lot.baselineLot.evaluation && (
                  <EvaluationDiff baselineEvaluation={lot.baselineLot.evaluation} currentEvaluation={lot.evaluation} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

