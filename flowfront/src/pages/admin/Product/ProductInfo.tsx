import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AdminHeader from "@/components/AdminHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getProductInfo } from "@/api/product"
import { Package } from "lucide-react"

interface Product {
  pid: string
  name: string
  description: string
  category: string[]
  image: string | null
  price: number
  date: string
  stock: number
}

const AdminProductInfo = () => {
  const { id: pid } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product>()
  const navigate = useNavigate()

  useEffect(() => {
    if (!pid) return
    const loadData = async () => {
      const res = await getProductInfo(pid)
      setProduct(res.data.result)
    }
    loadData()
  }, [pid])

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex gap-8">
              <div className="w-64 h-64 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {product?.image ? (
                  <img src={`/uploads/${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {Array.isArray(product?.category) ? product?.category.join(" > ") : product?.category}
                  </p>
                  <h1 className="text-2xl font-bold mt-1">{product?.name || "상품명을 불러오는 중..."}</h1>
                  <p className="text-xl font-bold text-primary mt-2">{product?.price?.toLocaleString() || 0}원</p>
                </div>

                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">재고: </span>
                    <span className="font-medium">{product?.stock || 0}개</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">등록일: </span>
                    <span className="font-medium">{product?.date?.slice(0, 10) || "-"}</span>
                  </div>
                </div>

                <p className="text-muted-foreground">{product?.description || "상품 설명이 없습니다."}</p>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => navigate("/admin/product")}>
                    목록으로
                  </Button>
                  <Button onClick={() => navigate(`/admin/product/update/${product?.pid}`)}>
                    수정
                  </Button>
                  <Button variant="destructive" onClick={() => navigate(`/admin/product/delete/${product?.pid}`)}>
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default AdminProductInfo
