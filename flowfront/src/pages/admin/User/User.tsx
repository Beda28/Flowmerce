import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminHeader from "@/components/AdminHeader"
import { getUserList } from "@/api/user"
import { Users, User as UserIcon, CreditCard, ChevronRight } from "lucide-react"

interface User {
  uid: string
  id: string
  balance: number
}

const AdminUserPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const navigate = useNavigate()

  const LookUser = (uid: string) => {
    navigate(`/admin/user/${uid}`)
  }

  useEffect(() => {
    const ListSetting = async () => {
      const res = await getUserList()
      setUsers(res.data.result || [])
    }
    ListSetting()
  }, [])

  return (
    <div className="min-h-screen gradient-bg">
      <AdminHeader />
      <main className="container mx-auto px-6 pt-24 pb-12 max-w-5xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                유저 관리
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">전체 {users.length}명</p>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground">아이디</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground">고유번호</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground">잔고</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr 
                      key={user.uid} 
                      className="border-b border-border/30 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => LookUser(user.uid)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-amber-400" />
                          </div>
                          <span className="font-medium">{user.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground font-mono text-sm">
                        {(user.uid || "").slice(0, 8)}...
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-green-400" />
                          <span className="font-semibold text-green-400">
                            {(user.balance || 0).toLocaleString()}원
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                          <Users className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-muted-foreground">유저가 존재하지 않습니다</p>
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

export default AdminUserPage
