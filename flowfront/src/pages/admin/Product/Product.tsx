import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import AdminHeader from "@/components/AdminHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchProductList } from "@/api/product"
import { Package, Plus, Search, Tag, Calendar, ChevronRight, Filter } from "lucide-react"

interface Product {
  pid: string
  name: string
  category: string[]
  price: number
  stock: number
  date: string
}

const AdminProductPage = () => {
  const { page } = useParams()
  const pageNum = Number(page) || 1
  const [totalcount, setTotalCount] = useState(0)
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [sort, setSort] = useState("newest")

  const LookProduct = (pid: string) => {
    navigate(`/admin/product/${pid}`)
  }

  const SearchSubmit = async () => {
    const res = await searchProductList(search, type, pageNum, sort)
    setProducts(res.data.result)
    setTotalCount(res.data.total_count)
  }

  useEffect(() => {
    const ListSetting = async () => {
      const res = await searchProductList("", "all", pageNum, sort)
      setProducts(res.data.result)
      setTotalCount(res.data.total_count)
    }
    ListSetting()
  }, [pageNum, sort])

  return (
    <div className="min-h-screen gradient-bg">
      <AdminHeader />
      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                상품 관리
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">전체 {totalcount}개</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
            <Link to="/admin/product/write">
              <Plus className="h-4 w-4 mr-2" />
              상품 등록
            </Link>
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <select 
              className="input-modern bg-background px-4 py-2.5 rounded-lg"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="name">상품명</option>
              <option value="category">카테고리</option>
            </select>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="상품 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 input-modern"
              />
            </div>
            <Button onClick={SearchSubmit} className="bg-gradient-to-r from-amber-500 to-orange-500">
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
            <select 
              className="input-modern bg-background px-4 py-2.5 rounded-lg"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">최신순</option>
              <option value="price_high">가격높은순</option>
              <option value="price_low">가격낮은순</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground w-20">번호</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground">상품명</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground w-36">카테고리</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground w-28">가격</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground w-24">재고</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground w-36">등록일</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr 
                      key={product.pid} 
                      className="border-b border-border/30 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => LookProduct(product.pid)}
                    >
                      <td className="py-4 px-6 text-muted-foreground">
                        {index + 1 + (pageNum - 1) * 12}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                            <Package className="h-5 w-5 text-amber-400" />
                          </div>
                          <span className="font-medium truncate max-w-xs">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Tag className="h-3.5 w-3.5" />
                          <span className="truncate">
                            {Array.isArray(product.category) ? product.category.join(", ") : product.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-green-400">
                        {product.price.toLocaleString()}원
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-lg text-sm ${
                          product.stock > 10 ? 'bg-green-500/10 text-green-400' :
                          product.stock > 0 ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {product.stock}개
                        </span>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          {product.date?.slice(0, 10)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-muted-foreground">상품이 존재하지 않습니다</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminProductPage
