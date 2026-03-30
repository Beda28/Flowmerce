import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AdminHeader from "@/components/AdminHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getBoardInfo } from "@/api/board"
import { Eye, Calendar } from "lucide-react"

interface Board {
  bid: string
  title: string
  content: string
  id: string
  date: string
  viewcount: number
}

const AdminBoardInfo = () => {
  const { id: bid } = useParams<{ id: string }>()
  const [post, setPost] = useState<Board>()
  const navigate = useNavigate()

  useEffect(() => {
    if (!bid) return
    const loadData = async () => {
      const res = await getBoardInfo(bid)
      setPost(res.data.result)
    }
    loadData()
  }, [bid])

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate("/admin/board")} className="mb-6">
          ← 목록으로
        </Button>

        <Card>
          <CardHeader className="border-b pb-6">
            <h1 className="text-2xl font-bold">{post?.title || "제목을 불러오는 중..."}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
              <span className="font-medium text-foreground">{post?.id}</span>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {(post?.date || "").slice(0, 10)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post?.viewcount || 0}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="min-h-[200px] whitespace-pre-wrap">
              {post?.content || "내용이 없습니다."}
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button variant="outline" onClick={() => navigate("/admin/board")}>
                목록으로
              </Button>
              <div className="flex gap-3">
                <Button onClick={() => navigate(`/admin/board/update/${post?.bid}`)}>
                  수정
                </Button>
                <Button variant="destructive" onClick={() => navigate(`/admin/board/delete/${post?.bid}`)}>
                  삭제
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default AdminBoardInfo
