import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { getCartList, updateCartQuantity, deleteCartItem, orderFromCart } from "@/api/product"
import { ShoppingCart, Trash2, Minus, Plus, ShoppingBag, CheckSquare, Square, CreditCard } from "lucide-react"
import type { CartItem } from "@/types/product"

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const navigate = useNavigate()

  const loadCart = async () => {
    const res = await getCartList()
    setItems(res.data.result || [])
    setSelected([])
  }

  useEffect(() => { 
    loadCart() 
  }, [])

  const toggleSelect = (cartId: number) => {
    setSelected(prev =>
      prev.includes(cartId) ? prev.filter(id => id !== cartId) : [...prev, cartId]
    )
  }

  const toggleAll = () => {
    setSelected(selected.length === items.length ? [] : items.map(i => i.cart_id))
  }

  const changeQuantity = async (cartId: number, delta: number) => {
    const item = items.find(i => i.cart_id === cartId)
    if (!item) return
    const newQty = item.quantity + delta
    if (newQty < 1) return
    await updateCartQuantity(cartId, newQty)
    loadCart()
  }

  const removeItem = async (cartId: number) => {
    await deleteCartItem(cartId)
    loadCart()
  }

  const selectedItems = items.filter(item => selected.includes(item.cart_id))
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleOrder = async () => {
    if (selectedItems.length === 0) {
      alert("상품을 선택해주세요.")
      return
    }
    try {
      const res = await orderFromCart(selectedItems.map(i => ({ pid: i.pid, quantity: i.quantity })))
      alert(`주문이 완료되었습니다.\n총 금액: ${res.data.total_price.toLocaleString()}원`)
      loadCart()
    } catch (error: any) {
      const msg = error.response?.data?.detail?.msg || error.response?.data?.detail || "주문에 실패했습니다."
      alert(msg)
    }
  }

  const allSelected = selected.length === items.length && items.length > 0

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container mx-auto px-6 pt-24 pb-12 max-w-5xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold gradient-text">장바구니</h1>
            <p className="text-muted-foreground mt-1">{items.length}개의 상품</p>
          </div>
        </div>

        {items.length > 0 && (
          <div className="glass rounded-xl p-4 mb-6 flex items-center gap-4">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {allSelected ? (
                <CheckSquare className="h-5 w-5 text-primary" />
              ) : (
                <Square className="h-5 w-5" />
              )}
              전체선택
            </button>
            <div className="h-4 w-px bg-border"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                for (const id of selected) await deleteCartItem(id)
                loadCart()
              }}
              disabled={selected.length === 0}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              선택삭제 ({selected.length})
            </Button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.length > 0 ? (
              items.map(item => (
                <div 
                  key={item.cart_id} 
                  className={`glass rounded-xl p-4 transition-all duration-200 ${
                    selected.includes(item.cart_id) ? 'ring-2 ring-primary/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleSelect(item.cart_id)}
                      className="flex-shrink-0"
                    >
                      {selected.includes(item.cart_id) ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>

                    <div 
                      className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/product/${item.pid}`)}
                    >
                      {item.image ? (
                        <img src={`/uploads/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground opacity-30" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-semibold cursor-pointer hover:text-primary transition-colors truncate"
                        onClick={() => navigate(`/product/${item.pid}`)}
                      >
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold gradient-text mt-1">
                        {item.price.toLocaleString()}원
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => changeQuantity(item.cart_id, -1)}
                        className="h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => changeQuantity(item.cart_id, 1)}
                        className="h-8 w-8"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-right w-28">
                      <p className="text-lg font-bold">{(item.price * item.quantity).toLocaleString()}원</p>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(item.cart_id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass rounded-2xl p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground opacity-50" />
                </div>
                <p className="text-lg font-medium text-muted-foreground mb-2">장바구니가 비어있습니다</p>
                <p className="text-sm text-muted-foreground/70 mb-6">원하는 상품을 장바구니에 추가해보세요</p>
                <Button onClick={() => navigate("/product")} className="btn-gradient">
                  쇼핑 계속하기
                </Button>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  주문 요약
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">선택 상품</span>
                    <span>{selectedItems.length}개</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">상품 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">배송비</span>
                    <span className="text-green-500">무료</span>
                  </div>
                </div>

                <div className="divider-gradient mb-6"></div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-muted-foreground">총 결제금액</span>
                  <span className="text-3xl font-bold gradient-text">{totalPrice.toLocaleString()}원</span>
                </div>

                <Button 
                  className="w-full h-14 btn-gradient text-lg" 
                  onClick={handleOrder} 
                  disabled={selectedItems.length === 0}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  주문하기
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  주문 시 이용약관에 동의하게 됩니다
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Cart
