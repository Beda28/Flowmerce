import { useEffect, useState } from "react"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { boardUpdateSubmit, getBoardInfo } from "@/api/board"
import { getId } from "@/utils/token"
import { useNavigate, useParams } from "react-router-dom"

const BoardUpdate = () => {
  const { id: bid } = useParams<{ id: string }>()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const userId = getId()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!bid) return
    await boardUpdateSubmit(bid, title, content)
    alert("수정 성공")
    navigate("/board")
  }

  useEffect(() => {
    if (!bid) return
    const loadData = async () => {
      const res = await getBoardInfo(bid)
      if (userId !== res.data.result.writer) {
        alert("수정 권한이 없습니다.")
        return navigate("/board")
      }
      setTitle(res.data.result.title)
      setContent(res.data.result.content)
    }
    loadData()
  }, [bid, userId, navigate])

  return (
    <div className="min-h-screen bg-background">
      <Header />
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

export default BoardUpdate
