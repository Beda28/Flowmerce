import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { getProductInfo, addToCart, createChatRoom, getSellerInfo } from "@/api/product"
import { getId } from "@/utils/token"
import { ShoppingCart, MessageSquare, Minus, Plus, Edit, ArrowLeft, User, Package, Calendar, Tag, Shield } from "lucide-react"
import type { Product } from "@/types/product"

interface SellerInfo {
  uid: string
  id: string
  intro: string | null
}

const ProductInfo = () => {
  const { id: pid } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product>()
  const [seller, setSeller] = useState<SellerInfo | null>(null)
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()
  const userId = getId()
  const isLoggedIn = userId !== null

  useEffect(() => {
    if (!pid) return
    const loadData = async () => {
      const res = await getProductInfo(pid)
      setProduct(res.data.result)
      if (res.data.result?.seller_uid) {
        try {
          const sellerRes = await getSellerInfo(res.data.result.seller_uid)
          setSeller(sellerRes.data)
        } catch {}
      }
    }
    loadData()
  }, [pid])

  const handleAddToCart = async () => {
    if (!pid || !product) return
    await addToCart(pid, quantity)
    alert("장바구니에 추가되었습니다.")
    navigate("/cart")
  }

  const handleBuyNow = async () => {
    if (!pid || !product) return
    await addToCart(pid, quantity)
    navigate("/cart")
  }

  const handleInquiry = async () => {
    if (!pid) return
    const res = await createChatRoom(pid)
    navigate(`/chat/${res.data.room_id}`)
  }

  const isSeller = product?.seller_uid === userId
  const totalPrice = (product?.price || 0) * quantity

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container mx-auto px-6 pt-24 pb-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/product")} 
          className="mb-8 hover:bg-muted/50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로
        </Button>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden glass">
              {product?.image ? (
                <img
                  src={`/uploads/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted">
                  <Package className="h-16 w-16 mb-3 opacity-30" />
                  <span>이미지 없음</span>
                </div>
              )}
            </div>
            
            {product?.category && (
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 text-sm font-medium rounded-full glass flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5" />
                  {Array.isArray(product.category) ? product.category.join(", ") : product.category}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold">{product?.name || "로딩 중..."}</h1>
              <p className="text-4xl font-bold gradient-text">
                {product?.price?.toLocaleString()}원
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">재고</span>
                </div>
                <p className="text-xl font-semibold">{product?.stock || 0}개</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">등록일</span>
                </div>
                <p className="text-xl font-semibold">{product?.date?.slice(0, 10) || "-"}</p>
              </div>
            </div>

            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">판매자 정보</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{seller?.id || "정보 없음"}</p>
                  {seller?.intro && (
                    <p className="text-sm text-muted-foreground">{seller.intro}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">상품 설명</span>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                {product?.description || "상품 설명이 없습니다."}
              </p>
            </div>

            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">수량</span>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-14 text-center font-bold text-xl">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product?.stock || 1, quantity + 1))}
                    disabled={quantity >= (product?.stock || 1)}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="divider-gradient my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">총 금액</span>
                <span className="text-3xl font-bold gradient-text">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>

            <div className="flex gap-4">
              {isLoggedIn && !isSeller && (
                <>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-14 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300 group" 
                    onClick={handleInquiry}
                  >
                    <MessageSquare className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    문의하기
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-14 hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-400 transition-all duration-300 group" 
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2 group-hover:scale-110 group-hover:animate-bounce transition-transform" />
                    장바구니
                  </Button>
                  <Button 
                    className="flex-[2] h-14 btn-gradient relative overflow-hidden group" 
                    onClick={handleBuyNow}
                  >
                    <span className="relative z-10">바로 구매</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </Button>
                </>
              )}
              {isLoggedIn && isSeller && (
                <Button 
                  className="flex-1 h-14 btn-gradient group" 
                  onClick={() => navigate(`/product/update/${pid}`)}
                >
                  <Edit className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  수정하기
                </Button>
              )}
              {!isLoggedIn && (
                <Button 
                  className="flex-1 h-14 btn-gradient group" 
                  onClick={() => navigate("/login")}
                >
                  <User className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  로그인 후 구매하기
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductInfo
