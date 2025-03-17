import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"

interface DishCardProps {
  dish: {
    id: number
    name: string
    description: string
    imageUrl: string
    recipeCount: number
  }
}

export default function DishCard({ dish }: DishCardProps) {
  return (
    <Link href={`/dishes/${dish.id}`}>
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
        <CardFooter>
          <p className="text-sm text-muted-foreground">レシピ: {dish.recipeCount}件</p>
        </CardFooter>
      </Card>
    </Link>
  )
}

