import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getMyProducts, getChatRooms, getCartList, getProfile, updateProfile, getOrderList, payOrder, cancelOrder, updateOrderStatus, getSalesOrders } from "@/api/product"
import { addBalance } from "@/api/auth"
import { getId } from "@/utils/token"
import { 
  Package, ShoppingCart, MessageSquare, Edit, Plus, Clock, 
  CheckCircle, XCircle, Truck, ClipboardList, Wallet, User,
  Settings, CreditCard, ChevronRight, Store, MessageCircle
} from "lucide-react"

interface ProductItem {
  pid: string
  name: string
  price: number
  image: string | null
  stock: number
}

interface ChatRoomItem {
  room_id: string
  pid: string
  product_name: string
  price: number
  image: string | null
}

interface CartItem {
  cart_id: number
  pid: string
  name: string
  price: number
  quantity: number
  image: string | null
}

interface UserProfile {
  uid: string
  id: string
  intro: string | null
  balance: number
}

interface OrderItem {
  order_id: string
  pid: string
  name: string
  price: number
  quantity: number
  total_price: number
  date: string
  status: string
  image: string | null
  seller_uid: string
}

interface SalesOrderItem {
  order_id: string
  pid: string
  name: string
  price: number
  quantity: number
  total_price: number
  date: string
  status: string
  image: string | null
  uid: string
  id: string
}

const MyPage = () => {
  const navigate = useNavigate()
  const userId = getId()
  const [activeTab, setActiveTab] = useState("products")
  const [myProducts, setMyProducts] = useState<ProductItem[]>([])
  const [chatRooms, setChatRooms] = useState<ChatRoomItem[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [salesOrders, setSalesOrders] = useState<SalesOrderItem[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [chargeMode, setChargeMode] = useState(false)
  const [chargeAmount, setChargeAmount] = useState("")
  const [newId, setNewId] = useState("")
  const [newPw, setNewPw] = useState("")
  const [newIntro, setNewIntro] = useState("")

  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요합니다.")
      navigate("/login")
      return
    }
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const profileRes = await getProfile()
      setProfile(profileRes.data)
      setNewId(profileRes.data.id)
      setNewIntro(profileRes.data.intro || "")
    } catch {}
    
    try {
      const productRes = await getMyProducts()
      setMyProducts(productRes.data.result || [])
    } catch {}
    
    try {
      const chatRes = await getChatRooms()
      setChatRooms(chatRes.data.result || [])
    } catch {}
    
    try {
      const cartRes = await getCartList()
      setCartItems(cartRes.data.result || [])
    } catch {}
    
    try {
      const orderRes = await getOrderList()
      setOrders(orderRes.data.result || [])
    } catch {}
    
    try {
      const salesOrderRes = await getSalesOrders()
      setSalesOrders(salesOrderRes.data.result || [])
    } catch {}
  }

  const handlePay = async (orderId: string) => {
    await payOrder(orderId)
    alert("결제 완료되었습니다.")
    loadData()
  }

  const handleCancel = async (orderId: string) => {
    if (!confirm("주문을 취소하시겠습니까?")) return
    await cancelOrder(orderId)
    alert("주문이 취소되었습니다.")
    loadData()
  }

  const handleStatusChange = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status)
    alert("상태가 변경되었습니다.")
    loadData()
  }

  const handleSalesStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status)
      setSalesOrders(salesOrders.map(o => 
        o.order_id === orderId ? { ...o, status: status } : o
      ))
    } catch (e) {
      console.error(e)
      alert("상태 변경에 실패했습니다.")
    }
  }

  const handleSaveProfile = async () => {
    await updateProfile(
      newId !== profile?.id ? newId : undefined,
      newPw || undefined,
      newIntro !== (profile?.intro || "") ? newIntro : undefined
    )
    alert("프로필 수정 완료")
    setEditMode(false)
    setNewPw("")
    loadData()
  }

  const handleCharge = async () => {
    const amount = parseInt(chargeAmount)
    if (!amount || amount <= 0) return alert("1원 이상 입력해주세요.")
    if (amount > 1000000) return alert("최대 1,000,000원까지 충전 가능합니다.")
    
    const res = await addBalance(amount)
    alert(`${amount}원이 충전되었습니다.`)
    setChargeMode(false)
    setChargeAmount("")
    loadData()
  }

  const tabs = [
    { id: "products", label: "내 상품", icon: Store, count: myProducts.length },
    { id: "sales", label: "판매주문", icon: Package, count: salesOrders.length },
    { id: "orders", label: "주문내역", icon: ClipboardList, count: orders.length },
    { id: "cart", label: "장바구니", icon: ShoppingCart, count: cartItems.length },
    { id: "chat", label: "문의", icon: MessageCircle, count: chatRooms.length },
  ]

  const statusMap: Record<string, { label: string; className: string; icon: any }> = {
    pending: { label: "결제대기", className: "status-pending", icon: Clock },
    paid: { label: "결제완료", className: "status-paid", icon: CheckCircle },
    shipping: { label: "배송중", className: "status-shipping", icon: Truck },
    completed: { label: "거래완료", className: "status-completed", icon: CheckCircle },
    cancelled: { label: "취소", className: "status-cancelled", icon: XCircle },
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container mx-auto px-6 pt-24 pb-12 max-w-5xl">
        <div className="glass rounded-2xl p-8 mb-8">
          {!editMode && !chargeMode ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-50"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">{profile?.id || userId}</h1>
                  <p className="text-muted-foreground mt-1">{profile?.intro || "소개글이 없습니다."}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="price-tag px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">잔고</p>
                      <p className="text-2xl font-bold gradient-text">
                        {(profile?.balance || 0).toLocaleString()}원
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      className="btn-gradient ml-2"
                      onClick={() => setChargeMode(true)}
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      충전
                    </Button>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => setEditMode(true)}
                  className="h-auto py-4"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  설정
                </Button>
              </div>
            </div>
          ) : chargeMode ? (
            <div className="max-w-md">
              <h2 className="text-2xl font-bold gradient-text mb-6">잔고 충전</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    충전 금액 (1~1,000,000원)
                  </label>
                  <Input 
                    type="number" 
                    value={chargeAmount} 
                    onChange={(e) => setChargeAmount(e.target.value)} 
                    placeholder="충전할 금액을 입력하세요"
                    className="input-modern h-12"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => { setChargeMode(false); setChargeAmount("") }}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button onClick={handleCharge} className="flex-1 btn-gradient">
                    <CreditCard className="h-4 w-4 mr-2" />
                    충전하기
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-md">
              <h2 className="text-2xl font-bold gradient-text mb-6">프로필 수정</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">아이디</label>
                  <Input value={newId} onChange={(e) => setNewId(e.target.value)} className="input-modern h-12" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">새 비밀번호</label>
                  <Input 
                    type="password" 
                    value={newPw} 
                    onChange={(e) => setNewPw(e.target.value)} 
                    placeholder="변경시에만 입력" 
                    className="input-modern h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">소개글</label>
                  <Textarea 
                    value={newIntro} 
                    onChange={(e) => setNewIntro(e.target.value)} 
                    placeholder="자기소개를 입력하세요" 
                    className="input-modern min-h-[100px]"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => { 
                      setEditMode(false); 
                      setNewId(profile?.id || ""); 
                      setNewPw(""); 
                      setNewIntro(profile?.intro || "") 
                    }}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button onClick={handleSaveProfile} className="flex-1 btn-gradient">
                    저장
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-primary to-accent text-white' 
                  : 'glass hover:bg-muted/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-muted'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl p-6">
          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">내 상품</h2>
                <Button onClick={() => navigate("/product/write")} className="btn-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  상품 등록
                </Button>
              </div>
              
              {myProducts.length > 0 ? (
                <div className="grid gap-4">
                  {myProducts.map(product => (
                    <div
                      key={product.pid}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/product/${product.pid}`)}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        {product.image ? (
                          <img src={`/uploads/${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground opacity-30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="gradient-text font-bold">{product.price.toLocaleString()}원</span>
                          <span className="mx-2">·</span>
                          재고 {product.stock}개
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          navigate(`/product/update/${product.pid}`) 
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        수정
                      </Button>
                      <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Store className="h-8 w-8 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-muted-foreground mb-4">등록한 상품이 없습니다</p>
                  <Button onClick={() => navigate("/product/write")} variant="outline">
                    첫 상품 등록하기
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "sales" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">판매주문</h2>
              
              {salesOrders.length > 0 ? (
                <div className="space-y-4">
                  {salesOrders.map(order => {
                    const statusInfo = statusMap[order.status] || { 
                      label: order.status, 
                      className: "status-pending", 
                      icon: Clock 
                    }
                    const StatusIcon = statusInfo.icon
                    return (
                      <div key={order.order_id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          {order.image ? (
                            <img src={`/uploads/${order.image}`} alt={order.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground opacity-30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{order.name}</h3>
                          <p className="text-sm text-muted-foreground">구매자: {order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.quantity}개 · {(order.total_price || 0).toLocaleString()}원</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`status-badge ${statusInfo.className}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </span>
                          <div className="flex gap-2">
                            {order.status === "paid" && (
                              <Button size="sm" variant="outline" onClick={() => handleSalesStatusChange(order.order_id, "shipping")}>
                                배송중
                              </Button>
                            )}
                            {order.status === "shipping" && (
                              <Button size="sm" variant="outline" onClick={() => handleSalesStatusChange(order.order_id, "completed")}>
                                거래완료
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-4" />
                  <p className="text-muted-foreground">판매 주문이 없습니다</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">주문내역</h2>
              
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => {
                    const statusInfo = statusMap[order.status] || { 
                      label: order.status, 
                      className: "status-pending", 
                      icon: Clock 
                    }
                    const StatusIcon = statusInfo.icon
                    const isSeller = order.seller_uid === userId
                    
                    return (
                      <div key={order.order_id} className="p-4 rounded-xl bg-muted/30">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {order.image ? (
                              <img src={`/uploads/${order.image}`} alt={order.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground opacity-30" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold">{order.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {order.quantity}개 · {(order.total_price || 0).toLocaleString()}원
                                </p>
                              </div>
                              <span className={`status-badge ${statusInfo.className}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </span>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              {order.status === "pending" && (
                                <Button size="sm" className="btn-gradient" onClick={() => handlePay(order.order_id)}>
                                  <CreditCard className="h-3 w-3 mr-1" />
                                  결제
                                </Button>
                              )}
                              {order.status !== "cancelled" && order.status !== "completed" && (
                                <Button size="sm" variant="outline" onClick={() => handleCancel(order.order_id)}>
                                  취소
                                </Button>
                              )}
                              {isSeller && order.status === "paid" && (
                                <Button size="sm" variant="outline" onClick={() => handleStatusChange(order.order_id, "shipping")}>
                                  <Truck className="h-3 w-3 mr-1" />
                                  배송 시작
                                </Button>
                              )}
                              {isSeller && order.status === "shipping" && (
                                <Button size="sm" className="btn-gradient" onClick={() => handleStatusChange(order.order_id, "completed")}>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  거래 완료
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="h-8 w-8 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-muted-foreground">주문 내역이 없습니다</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "cart" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">장바구니</h2>
                <Button onClick={() => navigate("/cart")} className="btn-gradient">
                  장바구니로 이동
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              {cartItems.length > 0 ? (
                <div className="grid gap-4">
                  {cartItems.map(item => (
                    <div
                      key={item.cart_id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/product/${item.pid}`)}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        {item.image ? (
                          <img src={`/uploads/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground opacity-30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="gradient-text font-bold">{item.price.toLocaleString()}원</span>
                          <span className="mx-2">·</span>
                          수량 {item.quantity}개
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="h-8 w-8 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-muted-foreground mb-4">장바구니가 비어있습니다</p>
                  <Button onClick={() => navigate("/product")} variant="outline">
                    쇼핑하러 가기
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "chat" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">문의</h2>
              
              {chatRooms.length > 0 ? (
                <div className="grid gap-4">
                  {chatRooms.map(room => (
                    <div
                      key={room.room_id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/chat/${room.room_id}`)}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        {room.image ? (
                          <img src={`/uploads/${room.image}`} alt={room.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-muted-foreground opacity-30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{room.product_name}</h3>
                        <p className="gradient-text font-bold mt-1">{room.price?.toLocaleString()}원</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-muted-foreground">문의 내역이 없습니다</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MyPage
