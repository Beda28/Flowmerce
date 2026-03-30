import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getChatMessages } from "@/api/product"
import { getId } from "@/utils/token"
import { Send, ArrowLeft, MessageCircle, User } from "lucide-react"

interface Message {
  sender_uid: string
  message: string
  created_at: string
  is_read: boolean
}

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const ws = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const userId = getId()

  const connectWebSocket = useCallback(() => {
    if (!roomId || roomId === "undefined") return
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const wsUrl = `${protocol}//${window.location.host}/api/chat/ws/${roomId}`
    ws.current = new WebSocket(wsUrl)
    ws.current.onopen = () => {
      setIsConnected(true)
      const token = localStorage.getItem("FM_Access")
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          ws.current?.send(JSON.stringify({ type: "auth", uid: payload.uuid }))
        } catch {}
      }
    }
    ws.current.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data)
        if (d.type === "new_message") {
          setMessages(prev => {
            if (prev.some(m => m.created_at === d.created_at && m.message === d.message)) return prev
            return [...prev, { sender_uid: d.sender_uid, message: d.message, created_at: d.created_at, is_read: d.is_read }]
          })
        }
      } catch {}
    }
    ws.current.onclose = () => { setIsConnected(false); setTimeout(connectWebSocket, 3000) }
  }, [roomId])

  useEffect(() => {
    if (!roomId || roomId === "undefined") return
    getChatMessages(roomId).then(res => setMessages(res.data.result || []))
    connectWebSocket()
    return () => ws.current?.close()
  }, [roomId, connectWebSocket])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const sendMessage = () => {
    if (!input.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return
    ws.current.send(JSON.stringify({ uid: userId, message: input }))
    setInput("")
  }

  if (!roomId || roomId === "undefined") return null

  return (
    <div className="min-h-screen gradient-bg text-white">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-6 max-w-3xl h-screen flex flex-col">
        <div className="flex items-center justify-between mb-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/chat")} className="hover:bg-white/10 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold font-sans">실시간 문의</h1>
              <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-medium">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                {isConnected ? 'ONLINE' : 'CONNECTING...'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col mb-4">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.length > 0 ? (
              messages.map((msg, idx) => {
                const isMe = msg.sender_uid === userId
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-start gap-3 animate-in fade-in slide-in-from-bottom-2`}>
                    {!isMe && <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shrink-0"><User className="w-4 h-4 text-white/50" /></div>}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm break-all shadow-lg ${
                        isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/10 text-white border border-white/10 rounded-tl-none'
                      }`}>{msg.message}</div>
                      <div className="flex items-center gap-2 mt-1 px-1">
                        {isMe && !msg.is_read && <span className="text-[10px] text-amber-400 font-bold">1</span>}
                        <span className="text-[9px] text-white/30">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20"><MessageCircle className="h-12 w-12 mb-2" /><p className="text-sm">메시지를 시작하세요.</p></div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white/5 border-t border-white/10 flex gap-3 items-center backdrop-blur-xl">
            <Input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => {
                if (e.nativeEvent.isComposing) return
                if (e.key === 'Enter') {
                  e.preventDefault()
                  sendMessage()
                }
              }} 
              placeholder="메시지 입력..." 
              disabled={!isConnected} 
              className="bg-black/20 border-white/10 text-white rounded-xl h-12 focus:ring-blue-500/50" 
            />
            <Button onClick={sendMessage} disabled={!isConnected || !input.trim()} className="bg-blue-600 hover:bg-blue-500 rounded-xl w-12 h-12 p-0 shrink-0 transition-transform active:scale-95"><Send className="h-5 w-5" /></Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChatRoom