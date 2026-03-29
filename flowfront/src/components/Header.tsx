import { Link, useNavigate } from "react-router-dom"
import { getId } from "@/utils/token"
import { logout } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, LogOut, Package, MessageSquare, Settings, Sparkles } from "lucide-react"

const Header = () => {
  const userId = getId()
  const isLoggedIn = userId !== null
  const isAdmin = userId === 'admin'
  const navigate = useNavigate()

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await logout()
    } finally {
      localStorage.removeItem("FM_Access")
      localStorage.removeItem("FM_Refresh")
      alert("로그아웃 성공")
      navigate('/')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold gradient-text">Flowmerce</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            to="/product" 
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
          >
            상품
          </Link>
          <Link 
            to="/board" 
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
          >
            커뮤니티
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <div className="relative group">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Settings className="h-4 w-4 mr-1.5" />
                    관리자
                  </Button>
                  <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden border border-border/50">
                    <div className="p-2">
                      <Link to="/admin/user" className="flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-muted/50 transition-colors">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        회원 관리
                      </Link>
                      <Link to="/admin/product" className="flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-muted/50 transition-colors">
                        <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                        상품 관리
                      </Link>
                      <Link to="/admin/board" className="flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-muted/50 transition-colors">
                        <Sparkles className="h-4 w-4 mr-2 text-muted-foreground" />
                        게시판 관리
                      </Link>
                      <Link to="/admin/order" className="flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-muted/50 transition-colors">
                        <ShoppingCart className="h-4 w-4 mr-2 text-muted-foreground" />
                        거래 관리
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Button variant="ghost" size="icon" asChild className="relative hover:bg-muted/50">
                    <Link to="/cart">
                      <ShoppingCart className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild className="hover:bg-muted/50">
                    <Link to="/chat">
                      <MessageSquare className="h-5 w-5" />
                    </Link>
                  </Button>
                </>
              )}
              <div className="h-6 w-px bg-border mx-1"></div>
              <Button variant="ghost" size="sm" asChild className="hover:bg-muted/50">
                <Link to="/mypage" className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{userId}</span>
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hover:bg-muted/50">
                <Link to="/login">로그인</Link>
              </Button>
              <Button asChild className="btn-gradient">
                <Link to="/register">회원가입</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
