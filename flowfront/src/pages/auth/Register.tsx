import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '@/components/Header'
import { registerSubmit } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Package, UserPlus, User, Lock, CheckCircle } from 'lucide-react'

const Register = () => {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const idRegex = /^[a-zA-Z0-9]{4,10}$/
    if (!id.trim() || !pw.trim() || !pwConfirm.trim()) return alert("모든 필드를 입력해주세요.")
    if (!idRegex.test(id)) return alert("아이디는 4~10자의 영문 또는 숫자만 가능합니다.")
    if (pw.length < 8 || pw.length > 20) return alert("비밀번호는 8~20자 사이여야 합니다.")
    if (pw !== pwConfirm) return alert("비밀번호가 일치하지 않습니다.")

    const res = await registerSubmit(id, pw)
    localStorage.setItem("FM_Access", res.data.access)
    localStorage.setItem("FM_Refresh", res.data.refresh)
    navigate('/')
  }

  const pwMatch = pwConfirm && pw === pwConfirm
  const idValid = id.length >= 4 && id.length <= 10 && /^[a-zA-Z0-9]+$/.test(id)
  const pwValid = pw.length >= 8 && pw.length <= 20

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
            <p className="text-muted-foreground">새 계정을 만드세요</p>
          </div>

          {/* Register Form */}
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
                    className="input-modern h-12 pl-4 pr-10"
                  />
                  {idValid && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
                {id && !idValid && (
                  <p className="text-xs text-destructive">4~10자의 영문/숫자만 가능합니다</p>
                )}
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
                    placeholder="8~20자 비밀번호"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    maxLength={20}
                    className="input-modern h-12 pl-4 pr-10"
                  />
                  {pwValid && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
                {pw && !pwValid && (
                  <p className="text-xs text-destructive">8~20자 사이여야 합니다</p>
                )}
              </div>

              {/* Password Confirm Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="비밀번호 다시 입력"
                    value={pwConfirm}
                    onChange={(e) => setPwConfirm(e.target.value)}
                    maxLength={20}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="input-modern h-12 pl-4 pr-10"
                  />
                  {pwMatch && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
                {pwConfirm && !pwMatch && (
                  <p className="text-xs text-destructive">비밀번호가 일치하지 않습니다</p>
                )}
              </div>

              {/* Register Button */}
              <Button 
                className="w-full h-12 btn-gradient text-base font-semibold" 
                onClick={handleSubmit}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                회원가입
              </Button>
            </div>

            {/* Divider */}
            <div className="divider-gradient my-6"></div>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              이미 계정이 있으신가요?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                로그인
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

export default Register
