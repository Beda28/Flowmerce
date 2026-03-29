import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminHeader from "@/components/AdminHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adminUserUpdateSubmit, getUserInfo } from "@/api/user"

const AdminUserUpdate = () => {
  const { id: uid } = useParams<{ id: string }>()
  const [id, setId] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!uid) return
    await adminUserUpdateSubmit(uid, id)
    alert("수정 성공")
    navigate("/admin/user")
  }

  useEffect(() => {
    if (!uid) return
    const loadData = async () => {
      const res = await getUserInfo(uid)
      setId(res.data.result.id)
    }
    loadData()
  }, [uid])

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>유저 정보 수정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">아이디</label>
              <Input
                placeholder="변경할 아이디를 입력해주세요."
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                취소
              </Button>
              <Button className="flex-1" onClick={handleSubmit}>
                수정 완료
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default AdminUserUpdate
