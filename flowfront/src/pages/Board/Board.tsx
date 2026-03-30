import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getBoardList, searchBoardList } from "@/api/board"
import PageNation from "@/components/PageNation"
import { Search, Plus, Eye, FileText, MessageSquare, Calendar } from "lucide-react"
import type { Board } from "@/types/board"
import { getId } from "@/utils/token"

const BoardPage = () => {
  const { page } = useParams()
  const pageNum = Number(page) || 1
  const [totalcount, setTotalCount] = useState(0)
  const navigate = useNavigate()
  const [boards, setBoards] = useState<Board[]>([])
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const pageCount = Math.ceil(totalcount / 12) || 1
  const isLoggedIn = getId() !== null

  const handleSearch = async () => {
    const res = await searchBoardList(search, type, pageNum)
    setBoards(res.data.result)
    setTotalCount(res.data.total_count)
  }

  useEffect(() => {
    const loadData = async () => {
      const res = await getBoardList(pageNum)
      setBoards(res.data.result)
      setTotalCount(res.data.total_count)
    }
    loadData()
  }, [pageNum])

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold">
              <span className="gradient-text">커뮤니티</span>
            </h1>
            <p className="text-muted-foreground mt-2">전체 {totalcount}개의 게시글</p>
          </div>
          {isLoggedIn && (
            <Button onClick={() => navigate("/board/write")} className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              글쓰기
            </Button>
          )}
        </div>

        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-modern bg-background px-4 py-2.5 rounded-lg"
            >
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="content">내용</option>
            </select>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="게시글 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-11 input-modern"
              />
            </div>
            <Button onClick={handleSearch} className="btn-gradient">
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {boards.length > 0 ? (
            boards.map((board, index) => (
              <div
                key={board.bid}
                className="glass rounded-xl p-5 hover:bg-muted/30 cursor-pointer transition-all group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => navigate(`/board/${board.bid}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                        {board.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {board.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      <span>{board.viewcount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{(board.date || "").slice(0, 10)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass rounded-2xl p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <p className="text-lg font-medium text-muted-foreground">게시글이 없습니다</p>
              <p className="text-sm text-muted-foreground/70 mt-1">새로운 글을 작성해보세요</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <PageNation pageLength={pageCount} pageIndex={pageNum} url="/board" />
        </div>
      </main>
    </div>
  )
}

export default BoardPage
