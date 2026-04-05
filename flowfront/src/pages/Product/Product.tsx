import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { searchProductList } from "@/api/product"
import { getId } from "@/utils/token"
import PageNation from "@/components/PageNation"
import { Search, Plus, ShoppingBag, Tag, TrendingUp, Clock } from "lucide-react"
import type { Product } from "@/types/product"

const ProductPage = () => {
  const { page } = useParams()
  const pageNum = Number(page) || 1
  const [totalcount, setTotalCount] = useState(0)
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [sort, setSort] = useState("newest")
  const pageCount = Math.ceil(totalcount / 12) || 1
  const isLoggedIn = getId() !== null

  const handleSearch = async () => {
    const res = await searchProductList(search, type, pageNum, sort)
    setProducts(res.data.result)
    setTotalCount(res.data.total_count)
  }

  useEffect(() => {
    const loadData = async () => {
      const res = await searchProductList("", "all", pageNum, sort)
      setProducts(res.data.result)
      setTotalCount(res.data.total_count)
    }
    loadData()
  }, [pageNum, sort])

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">상품</span> 둘러보기
            </h1>
            <p className="text-muted-foreground">다양한 상품을 만나보세요</p>
          </div>
          {isLoggedIn && (
            <Button 
              onClick={() => navigate("/product/write")}
              className="btn-gradient px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              판매하기
            </Button>
          )}
        </div>

        <div className="glass rounded-2xl p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              <Select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-24 input-modern bg-background"
              >
                <option value="all">전체</option>
                <option value="name">상품명</option>
                <option value="category">카테고리</option>
              </Select>
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="상품 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-11 input-modern"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="btn-gradient"
            >
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
            <Select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="w-24 input-modern bg-background"
            >
              <option value="newest">최신순</option>
              <option value="price_high">가격높은순</option>
              <option value="price_low">가격낮은순</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={product.pid}
                className="card-elevated overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => navigate(`/product/${pageNum}/${product.pid}`)}
              >
                <div className="aspect-square relative overflow-hidden bg-muted">
                  {product.image ? (
                    <>
                      <img
                        src={`/uploads/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted">
                      <ShoppingBag className="h-12 w-12 mb-2 opacity-30" />
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                  
                  {product.category && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 text-xs font-medium rounded-full glass">
                        {Array.isArray(product.category) ? product.category[0] : product.category}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                    {Array.isArray(product.category) ? product.category.join(", ") : product.category}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold gradient-text">
                      {product.price.toLocaleString()}원
                    </p>
                    {product.stock !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        재고 {product.stock}개
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground opacity-50" />
                </div>
                <p className="text-lg font-medium text-muted-foreground">상품이 존재하지 않습니다</p>
                <p className="text-sm text-muted-foreground/70 mt-1">새로운 상품이 곧 등록될 예정입니다</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12">
          <PageNation pageLength={pageCount} pageIndex={pageNum} url="/product/" />
        </div>
      </main>
    </div>
  )
}

export default ProductPage
