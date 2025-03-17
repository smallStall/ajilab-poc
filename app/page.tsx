import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Home() {
  // 仮のデータ
  const featuredDishes = [
    {
      id: 1,
      name: "カレーライス",
      description: "定番の日本風カレーライス",
      imageUrl: "/placeholder.svg?height=200&width=300",
      lotCount: 3,
    },
    {
      id: 2,
      name: "ラーメン",
      description: "様々なスタイルの麺料理",
      imageUrl: "/placeholder.svg?height=200&width=300",
      lotCount: 5,
    },
    {
      id: 3,
      name: "パスタ",
      description: "イタリアンの定番料理",
      imageUrl: "/placeholder.svg?height=200&width=300",
      lotCount: 4,
    },
    {
      id: 4,
      name: "天ぷら",
      description: "サクサクの衣が特徴の揚げ物",
      imageUrl: "/placeholder.svg?height=200&width=300",
      lotCount: 2,
    },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-6">AjiLab レシピ管理</h1>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input type="search" placeholder="料理名やレシピを検索..." className="pl-10 w-full" />
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">料理一覧</h2>
        <Button asChild>
          <Link href="/dishes/new">新しい料理を追加</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredDishes.map((dish) => (
          <Link key={dish.id} href={`/dishes/${dish.id}`}>
            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <Image src={dish.imageUrl || "/placeholder.svg"} alt={dish.name} fill className="object-cover" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{dish.name}</h3>
                  {/* カテゴリーバッジを削除 */}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-muted-foreground text-sm line-clamp-2">{dish.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}

