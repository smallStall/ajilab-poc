import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Clock, Edit, Users } from "lucide-react"

// この関数は実際の実装では非同期でデータを取得します
function getRecipeData(dishId: string, recipeId: string) {
  // 仮のデータ
  return {
    id: Number.parseInt(recipeId),
    dishId: Number.parseInt(dishId),
    dishName: "カレーライス",
    title: "基本のカレーライス",
    description: "誰でも作れる基本のレシピです。じっくり煮込んだ野菜の甘みとスパイスの香りが特徴です。",
    status: "承認済み",
    version: "1.0",
    cookingTime: "60分",
    difficulty: "簡単",
    servings: 4,
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
    notes: "ルーを入れる前に火を止めることで、ルーが焦げ付くのを防ぎます。",
    updatedAt: "2023-10-15",
  }
}

export default function RecipeDetail({ params }: { params: { id: string; recipeId: string } }) {
  const recipe = getRecipeData(params.id, params.recipeId)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={`/dishes/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {recipe.dishName}に戻る
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant={
                      recipe.status === "承認済み"
                        ? "default"
                        : recipe.status === "テスト済み"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {recipe.status}
                  </Badge>
                  <Badge variant="outline">v{recipe.version}</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dishes/${recipe.dishId}/recipes/${recipe.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  編集
                </Link>
              </Button>
            </div>

            <p className="text-muted-foreground mb-6">{recipe.description}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{recipe.cookingTime}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-muted-foreground">難易度:</span>
                <span>{recipe.difficulty}</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{recipe.servings}人前</span>
              </div>
            </div>
          </div>

          <div className="relative h-64 md:h-auto md:w-1/3 rounded-lg overflow-hidden">
            <Image src={recipe.imageUrl || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <h2 className="text-xl font-semibold">材料</h2>
            <p className="text-sm text-muted-foreground">{recipe.servings}人前</p>
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

          {recipe.notes && (
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">メモ</h3>
              <p className="text-sm">{recipe.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-right text-sm text-muted-foreground">最終更新日: {recipe.updatedAt}</div>
    </div>
  )
}

