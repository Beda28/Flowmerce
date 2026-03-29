import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminHeader from "@/components/AdminHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adminBoardUpdateSubmit, getBoardInfo } from "@/api/board"

const AdminBoardUpdate = () => {
  const { id: bid } = useParams<{ id: string }>()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!bid) return
    await adminBoardUpdateSubmit(bid, title, content)
    alert("수정 성공")
    navigate("/admin/board")
  }

  useEffect(() => {
    if (!bid) return
    const loadData = async () => {
      const res = await getBoardInfo(bid)
      setTitle(res.data.result.title)
      setContent(res.data.result.content)
    }
    loadData()
  }, [bid])

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>게시글 수정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">제목</label>
              <Input
                placeholder="제목을 입력해주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">내용</label>
              <Textarea
                placeholder="내용을 입력해주세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px]"
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

export default AdminBoardUpdate
