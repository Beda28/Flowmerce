import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { searchProductList } from "@/api/product"
import { getId } from "@/utils/token"
import { ShoppingBag, ArrowRight, Package, Users, TrendingUp, Shield } from "lucide-react"
import type { Product } from "@/types/product"

const Index = () => {
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const isLoggedIn = getId() !== null

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await searchProductList("", "all", 1, "newest")
        setFeaturedProducts(res.data.result?.slice(0, 4) || [])
      } catch {}
    }
    loadProducts()
  }, [])

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-sm text-muted-foreground">실시간 거래 플랫폼</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Flowmerce</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              안전하고 편리한 온라인 거래 플랫폼<br />
              당신의 상품을 세상에 알리세요
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/product")}
                className="btn-gradient h-14 px-8 text-lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                쇼핑 시작하기
              </Button>
              {!isLoggedIn && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate("/register")}
                  className="h-14 px-8 text-lg"
                >
                  회원가입
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Package, label: "등록 상품", value: "1,000+" },
              { icon: Users, label: "활성 회원", value: "500+" },
              { icon: TrendingUp, label: "월 거래량", value: "100+" },
              { icon: Shield, label: "안전 거래", value: "100%" },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold">인기 상품</h2>
                <p className="text-muted-foreground mt-1">지금 가장 인기있는 상품을 만나보세요</p>
              </div>
              <Button variant="outline" onClick={() => navigate("/product")}>
                전체보기
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.pid}
                  className="card-elevated overflow-hidden group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(`/product/${product.pid}`)}
                >
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    {product.image ? (
                      <img
                        src={`/uploads/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground opacity-30" />
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
                    <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xl font-bold gradient-text mt-2">
                      {product.price.toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="py-12 px-6 border-t border-border/50">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="gradient-text font-bold text-xl mb-2">Flowmerce</p>
          <p className="text-sm">© 2026 Flowmerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Index
