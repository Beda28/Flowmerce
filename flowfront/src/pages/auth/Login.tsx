import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '@/components/Header'
import { loginSubmit } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Package, LogIn, User, Lock } from 'lucide-react'

const Login = () => {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const idRegex = /^[a-zA-Z0-9]{4,10}$/
    if (!id.trim() || !pw.trim()) return alert("아이디와 비밀번호를 모두 입력해주세요.")
    if (!idRegex.test(id)) return alert("아이디는 4~10자의 영문 또는 숫자만 가능합니다.")
    if (pw.length > 20) return alert("비밀번호는 20자 이내여야 합니다.")

    const res = await loginSubmit(id, pw)
    localStorage.setItem("FM_Access", res.data.access)
    localStorage.setItem("FM_Refresh", res.data.refresh)
    navigate('/')
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-primary to-accent p-4 rounded-2xl">
                  <Package className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Flowmerce</h1>
            <p className="text-muted-foreground">계정에 로그인하세요</p>
          </div>

          {/* Login Form */}
          <div className="glass rounded-2xl p-8">
            <div className="space-y-6">
              {/* ID Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  아이디
                </label>
                <div className="relative">
                  <Input
                    placeholder="4~10자 영문/숫자"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    maxLength={10}
                    className="input-modern h-12 pl-4"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  비밀번호
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="비밀번호 입력"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    maxLength={20}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="input-modern h-12 pl-4"
                  />
                </div>
              </div>

              {/* Login Button */}
              <Button 
                className="w-full h-12 btn-gradient text-base font-semibold" 
                onClick={handleSubmit}
              >
                <LogIn className="h-4 w-4 mr-2" />
                로그인
              </Button>
            </div>

            {/* Divider */}
            <div className="divider-gradient my-6"></div>

            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground">
              계정이 없으신가요?{' '}
              <Link 
                to="/register" 
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                회원가입
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <p className="text-center mt-6">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Login
