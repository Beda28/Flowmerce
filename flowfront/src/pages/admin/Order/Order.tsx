import { useEffect, useState } from "react"
import AdminHeader from "@/components/AdminHeader"
import { getAdminOrderList, updateOrderStatus } from "@/api/product"
import { ShoppingCart, Clock, CheckCircle, XCircle, Truck, Package, Calendar, User, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  pending: { label: "결제대기", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
  paid: { label: "결제완료", className: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: CheckCircle },
  shipping: { label: "배송중", className: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: Truck },
  completed: { label: "거래완료", className: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  cancelled: { label: "취소", className: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
}

const AdminOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([])

  const loadOrders = async () => {
    try {
      const res = await getAdminOrderList()
      console.log("test" , res.data)
      const rawData = res.data.result || res.data || []
      
      const formattedData = rawData.map((item: any) => {
        const orderBase = item.Order || item;
        
        return {
          order_id: orderBase.order_id || "",
          uid: orderBase.uid || "",
          pid: orderBase.pid || "",
          quantity: orderBase.quantity || 0,
          total_price: orderBase.total_price || 0,
          date: orderBase.date || "",
          status: orderBase.status || "pending",
          name: item.name || "삭제된 상품",
          image: item.image || null,
          id: item.id || "알 수 없음"
        }
      })
      
      setOrders(formattedData)
    } catch (e) {
      console.error("Data Fetch Error:", e)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const totalRevenue = orders
    .filter(o => ["paid", "shipping", "completed"].includes(o.status))
    .reduce((sum, o) => sum + (Number(o.total_price) || 0), 0)

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => 
        o.order_id === orderId ? { ...o, status: newStatus } : o
      ))
    } catch (e) {
      alert("상태 변경에 실패했습니다.")
    }
  }

  const getNextStatuses = (currentStatus: string) => {
    if (currentStatus === "paid") return ["shipping"]
    if (currentStatus === "shipping") return ["completed"]
    return []
  }

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
                <p className="text-sm text-muted-foreground">총 매출 (입금확인됨)</p>
                <p className="text-2xl font-bold text-green-400">{totalRevenue.toLocaleString()}원</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">주문ID</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">구매자</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">상품명</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">수량</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">금액</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">상태</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">날짜</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const statusInfo = statusMap[order.status] || { 
                      label: order.status, 
                      className: "bg-slate-500/10 text-slate-500 border-slate-500/20", 
                      icon: Package 
                    }
                    const StatusIcon = statusInfo.icon
                    return (
                      <tr key={order.order_id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <code className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">
                            {order.order_id?.substring(0, 8) || "N/A"}
                          </code>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-white">{order.id}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-muted flex-shrink-0 overflow-hidden border border-white/5">
                              {order.image ? (
                                <img src={`/uploads/${order.image}`} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-20"><Package className="h-4 w-4" /></div>
                              )}
                            </div>
                            <span className="font-medium text-sm truncate max-w-[120px]">{order.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">{order.quantity}</td>
                        <td className="py-4 px-6 font-bold text-sm text-white">
                          {(Number(order.total_price) || 0).toLocaleString()}원
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.className}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-[11px] text-muted-foreground">
                            {order.date ? new Date(order.date).toLocaleDateString() : "-"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-1.5">
                            {getNextStatuses(order.status).map((nextStatus) => (
                              <Button
                                key={nextStatus}
                                size="sm"
                                variant="secondary"
                                onClick={() => handleStatusChange(order.order_id, nextStatus)}
                                className="h-7 px-2.5 text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white"
                              >
                                {statusMap[nextStatus]?.label}
                              </Button>
                            ))}
                            {["paid", "shipping", "pending"].includes(order.status) && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStatusChange(order.order_id, "cancelled")}
                                className="h-7 px-2.5 text-[10px] text-red-400 hover:text-red-500 hover:bg-red-500/10"
                              >
                                취소
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                        <p className="text-lg">데이터를 불러올 수 없거나 내역이 없습니다</p>
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