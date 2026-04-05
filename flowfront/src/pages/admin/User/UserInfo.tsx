import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AdminHeader from "@/components/AdminHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUserInfo, adminUpdateBalance } from "@/api/user"
import { getOrderList } from "@/api/product"
import { Wallet } from "lucide-react"

interface User {
  uid: string
  id: string
  balance: number
}

interface OrderItem {
  order_id: string
  name: string
  quantity: number
  total_price: number
  date: string
}

const AdminUserInfo = () => {
  const { page: pageNum, id: uid } = useParams<{ page: string; id: string }>()
  const [user, setUser] = useState<User>()
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [balanceMode, setBalanceMode] = useState(false)
  const [balanceAmount, setBalanceAmount] = useState("")
  const [balanceAction, setBalanceAction] = useState<"add" | "subtract">("add")
  const navigate = useNavigate()
  const currentPage = Number(pageNum) || 1

  useEffect(() => {
    if (!uid) return
    const ListSetting = async () => {
      const res = await getUserInfo(uid)
      setUser(res.data.result)
      try {
        const orderRes = await getOrderList()
        setOrders(orderRes.data.result || [])
      } catch {}
    }
    ListSetting()
  }, [uid])

  const totalPurchase = orders.reduce((sum, o) => sum + o.total_price, 0)

  const handleBalanceUpdate = async () => {
    const amount = parseInt(balanceAmount)
    if (!amount || amount <= 0) return alert("1원 이상 입력해주세요.")
    
    const finalAmount = balanceAction === "add" ? amount : -amount
    await adminUpdateBalance(uid!, finalAmount)
    alert("잔고가 수정되었습니다.")
    setBalanceMode(false)
    setBalanceAmount("")
    
    const res = await getUserInfo(uid!)
    setUser(res.data.result)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">유저 정보</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>기본정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">아이디</span>
              <span className="font-medium">{user?.id || "불러오는 중..."}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">고유번호</span>
              <span className="font-medium">{user?.uid || "불러오는 중..."}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">잔고</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">{(user?.balance || 0).toLocaleString()}원</span>
                <Button size="sm" variant="outline" onClick={() => setBalanceMode(true)}>수정</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {balanceMode && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>잔고 수정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  variant={balanceAction === "add" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setBalanceAction("add")}
                >
                  충전
                </Button>
                <Button 
                  variant={balanceAction === "subtract" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setBalanceAction("subtract")}
                >
                  차감
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">금액</label>
                <Input 
                  type="number" 
                  value={balanceAmount} 
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  placeholder="금액 입력"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setBalanceMode(false); setBalanceAmount("") }}>
                  취소
                </Button>
                <Button onClick={handleBalanceUpdate}>수정</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>구매 이력</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <>
                <div className="space-y-2 mb-4">
                  {orders.map(order => (
                    <div key={order.order_id} className="flex justify-between py-2 border-b">
                      <span>{order.name}</span>
                      <span className="text-muted-foreground">{order.quantity}개 · {order.total_price.toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <span className="font-semibold">총 구매금액</span>
                  <span className="font-bold text-primary">{totalPurchase.toLocaleString()}원</span>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">구매 이력이 없습니다.</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => navigate(`/admin/user/${currentPage}`)}>
            목록으로
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/admin/user/update/${user?.uid}`)}>수정</Button>
            <Button variant="destructive" onClick={() => navigate(`/admin/user/delete/${user?.uid}`)}>삭제</Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminUserInfo
