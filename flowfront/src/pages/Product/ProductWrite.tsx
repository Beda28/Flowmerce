import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { productWriteSubmit, productUpdateSubmit, getProductInfo } from "@/api/product"
import { ImagePlus, X } from "lucide-react"

const ProductWrite = () => {
  const { id: pid } = useParams<{ id: string }>()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [categoryInput, setCategoryInput] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const isEdit = !!pid

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.')
        e.target.value = ''
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreviewUrl(result)
        setImage(file.name)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    const category = categoryInput.split(",").map(c => c.trim()).filter(c => c)
    const priceNum = parseInt(price)
    const stockNum = parseInt(stock)

    if (isEdit && pid) {
      await productUpdateSubmit(pid, name, description, category, image, priceNum, stockNum)
    } else {
      await productWriteSubmit(name, description, category, image, priceNum, stockNum)
    }
    alert(isEdit ? "수정 성공" : "등록 성공")
    navigate("/product")
  }

  useEffect(() => {
    if (!pid) return
    const loadData = async () => {
      const res = await getProductInfo(pid)
      const product = res.data.result
      setName(product.name)
      setDescription(product.description)
      setCategoryInput(Array.isArray(product.category) ? product.category.join(", ") : product.category)
      setPrice(product.price.toString())
      setStock(product.stock.toString())
      if (product.image) {
        setImage(product.image)
        setPreviewUrl(`/uploads/${product.image}`)
      }
    }
    loadData()
  }, [pid])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "상품 수정" : "상품 등록"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">상품명</label>
              <Input
                placeholder="상품명을 입력해주세요."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">상품 설명</label>
              <Textarea
                placeholder="상품 설명을 입력해주세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">카테고리</label>
              <Input
                placeholder="카테고리를 입력해주세요. (쉼표로 구분)"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">상품 이미지</label>
              <div className="w-48 h-48">
                {previewUrl ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden border">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <ImagePlus className="h-10 w-10 mb-2" />
                    <span className="text-sm">이미지 업로드</span>
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">가격</label>
                <Input
                  type="number"
                  placeholder="가격을 입력해주세요."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">재고</label>
                <Input
                  type="number"
                  placeholder="재고를 입력해주세요."
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                취소
              </Button>
              <Button className="flex-1" onClick={handleSubmit}>
                {isEdit ? "수정 완료" : "등록 완료"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default ProductWrite
