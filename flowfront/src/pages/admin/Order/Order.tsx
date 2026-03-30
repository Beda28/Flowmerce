import { useEffect, useState } from "react"
import AdminHeader from "@/components/AdminHeader"
import { getAdminOrderList } from "@/api/product"
import { ShoppingCart, Clock, CheckCircle, XCircle, Truck, Package, Calendar, User, CreditCard } from "lucide-react"

interface Order {
  order_id: string
  uid: string
  pid: string
  quantity: number
  total_price: number
  date: string
  status: string
  name: string
  image: string | null
  id: string
}

const statusMap: Record<string, { label: string; className: string; icon: any }> = {
  pending: { label: "결제대기", className: "status-pending", icon: Clock },
  paid: { label: "결제완료", className: "status-paid", icon: CheckCircle },
  shipping: { label: "배송중", className: "status-shipping", icon: Truck },
  completed: { label: "거래완료", className: "status-completed", icon: CheckCircle },
  cancelled: { label: "취소", className: "status-cancelled", icon: XCircle },
}

const AdminOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await getAdminOrderList()
        setOrders(res.data.result || [])
      } catch (e) {
        console.error(e)
      }
    }
    loadOrders()
  }, [])

  const totalRevenue = orders
    .filter(o => o.status === 'completed' || o.status === 'shipping')
    .reduce((sum, o) => sum + o.total_price, 0)

  return (
    <div className="min-h-screen gradient-bg">
      <AdminHeader />
      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                거래 관리
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">전체 {orders.length}건</p>
          </div>
          
          <div className="glass rounded-xl px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">총 매출</p>
                <p className="text-2xl font-bold text-green-400">{totalRevenue.toLocaleString()}원</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground">주문ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground">구매자</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground">상품</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground">수량</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground">총금액</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground">상태</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground">날짜</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const statusInfo = statusMap[order.status] || { 
                      label: order.status, 
                      className: "status-pending", 
                      icon: Package 
                    }
                    const StatusIcon = statusInfo.icon
                    return (
                      <tr key={order.order_id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-mono text-sm text-muted-foreground">
                            {order.order_id.slice(0, 8)}...
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{order.id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium">{order.name}</td>
                        <td className="py-4 px-6">{order.quantity}개</td>
                        <td className="py-4 px-6 font-semibold text-green-400">
                          {order.total_price.toLocaleString()}원
                        </td>
                        <td className="py-4 px-6">
                          <span className={`status-badge ${statusInfo.className}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {order.date?.slice(0, 10)}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-muted-foreground">거래 내역이 없습니다</p>
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

export default AdminOrderPage
