import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getBoardInfo } from "@/api/board"
import { getId } from "@/utils/token"
import { Edit, Trash2, Eye, Calendar } from "lucide-react"
import type { Board } from "@/types/board"

const BoardInfo = () => {
  const { id: bid } = useParams<{ id: string }>()
  const [board, setBoard] = useState<Board>()
  const navigate = useNavigate()
  const userId = getId()
  const isLoggedIn = userId !== null

  useEffect(() => {
    if (!bid) return
    const loadData = async () => {
      const res = await getBoardInfo(bid)
      setBoard(res.data.result)
    }
    loadData()
  }, [bid])

  const isWriter = board?.writer === userId

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate("/board")} className="mb-6">
          ← 목록으로
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{board?.title || "로딩 중..."}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {board?.date?.slice(0, 10)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {board?.viewcount}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">{board?.content}</p>
            </div>

            {isLoggedIn && isWriter && (
              <div className="flex gap-3 mt-8 pt-6 border-t">
                <Button variant="outline" onClick={() => navigate(`/board/update/${bid}`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  수정
                </Button>
                <Button variant="destructive" onClick={() => navigate(`/board/delete/${bid}`)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default BoardInfo
