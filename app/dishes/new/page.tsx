"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function NewDish() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
  })
  const [errors, setErrors] = useState({
    name: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // エラーをクリア
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      name: formData.name ? "" : "料理名を入力してください",
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // 実際の実装ではここでAPIリクエストを行います
      // 例: await fetch('/api/dishes', { method: 'POST', body: JSON.stringify(formData) })

      // 成功したことをシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "料理を追加しました",
        description: `「${formData.name}」が正常に追加されました`,
      })

      // 料理一覧ページにリダイレクト
      router.push("/")
    } catch (error) {
      console.error("料理の追加に失敗しました", error)
      toast({
        title: "エラーが発生しました",
        description: "料理の追加に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Link>
      </Button>

      <h1 className="text-2xl font-bold mb-6">新しい料理を追加</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="name" className="block font-medium">
            料理名 <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="例: カレーライス"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block font-medium">
            説明
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="料理の説明を入力してください"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="block font-medium">
            画像
          </label>
          <Input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} />
          <p className="text-xs text-muted-foreground">推奨サイズ: 600x400px、最大ファイルサイズ: 2MB</p>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" asChild>
            <Link href="/">キャンセル</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </div>
      </form>
    </div>
  )
}

