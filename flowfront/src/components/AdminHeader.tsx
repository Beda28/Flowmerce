import { getId } from "../utils/token"
import { useNavigate, Link } from "react-router-dom"
import { logout } from "../api/auth"
import { Button } from "./ui/button"
import { Package, Users, FileText, Settings, ExternalLink, Shield, LogOut, ShoppingCart } from "lucide-react"

const AdminHeader = () => {
  const userId = getId()
  const navigate = useNavigate()

  if (userId !== 'admin') {
    navigate("/")
    return null
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    await logout()
    localStorage.removeItem("FM_Access")
    localStorage.removeItem("FM_Refresh")
    navigate('/')
  }

  const navItems = [
    { href: "/admin/product", label: "상품관리", icon: Package },
    { href: "/admin/board", label: "게시판", icon: FileText },
    { href: "/admin/user", label: "유저관리", icon: Users },
    { href: "/admin/order", label: "거래관리", icon: ShoppingCart },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-amber-500 to-orange-500 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Admin
            </span>
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted/50"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            메인 사이트
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map(item => (
            <a 
              key={item.href}
              href={item.href} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Settings className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">{userId}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-1" />
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
