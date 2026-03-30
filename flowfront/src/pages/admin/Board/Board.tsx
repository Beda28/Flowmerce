import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminHeader from "@/components/AdminHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getBoardList, searchBoardList } from "@/api/board"
import { FileText, Search, User, Calendar, Eye, ChevronRight } from "lucide-react"

interface Board {
  bid: string
  title: string
  id: string
  date: string
  viewcount: number
}

const AdminBoardPage = () => {
  const { page } = useParams()
  const pageNum = Number(page) || 1
  const [totalcount, setTotalCount] = useState(0)
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Board[]>([])
  const [search, setSearch] = useState("")
  const [type, setType] = useState("board.title")

  const LookPost = (uuid: string) => {
    navigate(`/admin/board/${uuid}`)
  }

  const SearchSubmit = async () => {
    const res = await searchBoardList(search, type, pageNum)
    setPosts(res.data.result)
    setTotalCount(res.data.total_count)
  }

  useEffect(() => {
    const ListSetting = async () => {
      const res = await getBoardList(pageNum)
      setPosts(res.data.result)
      setTotalCount(res.data.total_count)
    }
    ListSetting()
  }, [pageNum])

  return (
    <div className="min-h-screen gradient-bg">
      <AdminHeader />
      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                게시판 관리
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">전체 {totalcount}개</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <select 
              className="input-modern bg-background px-4 py-2.5 rounded-lg"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="board.title">제목</option>
              <option value="User.id">작성자</option>
            </select>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="게시글 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 input-modern"
              />
            </div>
            <Button onClick={SearchSubmit} className="bg-gradient-to-r from-amber-500 to-orange-500">
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground w-20">번호</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground">제목</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground w-32">작성자</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground w-36">날짜</th>
                  <th className="text-left py-4 px-6 font-semibold text-muted-foreground w-20">조회</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <tr 
                      key={post.bid} 
                      className="border-b border-border/30 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => LookPost(post.bid)}
                    >
                      <td className="py-4 px-6 text-muted-foreground">
                        {index + 1 + (pageNum - 1) * 10}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-amber-400" />
                          </div>
                          <span className="font-medium truncate max-w-md">{post.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          {post.id}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {(post.date || "").slice(0, 10)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          {post.viewcount}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                          <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-muted-foreground">게시글이 존재하지 않습니다</p>
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

export default AdminBoardPage
