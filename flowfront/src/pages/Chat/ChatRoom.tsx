import { useEffect, useState, useRef, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getChatMessages } from "@/api/product"
import { getId } from "@/utils/token"
import { Send, ArrowLeft, Wifi, WifiOff, MessageCircle } from "lucide-react"

interface Message {
  sender_uid: string
  message: string
  created_at: string
}

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [connected, setConnected] = useState(false)
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const userId = getId()

  const connectWebSocket = useCallback(() => {
    if (!roomId) return
    
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const wsUrl = `${wsProtocol}//${window.location.host}/api/chat/ws/${roomId}`
    
    ws.current = new WebSocket(wsUrl)
    
    ws.current.onopen = () => {
      setConnected(true)
      const token = localStorage.getItem("FM_Access")
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          ws.current?.send(JSON.stringify({ type: "auth", uid: payload.uuid }))
        } catch {}
      }
    }
    
    ws.current.onclose = () => {
      setConnected(false)
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      reconnectTimer.current = setTimeout(() => {
        connectWebSocket()
      }, 3000)
    }
    
    ws.current.onerror = () => {
      setConnected(false)
    }
    
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "new_message") {
          setMessages(prev => [...prev, {
            sender_uid: data.sender_uid,
            message: data.message,
            created_at: data.created_at
          }])
        }
      } catch {}
    }
  }, [roomId])

  useEffect(() => {
    if (!roomId) return

    const loadMessages = async () => {
      try {
        const res = await getChatMessages(roomId)
        setMessages(res.data.result || [])
      } catch {}
    }
    loadMessages()
    connectWebSocket()

    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      ws.current?.close()
    }
  }, [roomId, connectWebSocket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || !ws.current || !connected) return
    const token = localStorage.getItem("FM_Access")
    if (!token) return
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      ws.current.send(JSON.stringify({ uid: payload.uuid, message: input }))
      setMessages(prev => [...prev, {
        sender_uid: payload.uuid,
        message: input,
        created_at: new Date().toISOString()
      }])
      setInput("")
    } catch {}
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container mx-auto px-6 pt-24 pb-12 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/chat")}
            className="hover:bg-muted/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold gradient-text">문의</h1>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full glass">
            {connected ? (
              <>
                <Wifi className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">연결됨</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">연결 끊김</span>
              </>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length > 0 ? (
              messages.map((msg, idx) => {
                const isMe = msg.sender_uid === userId
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      isMe 
                        ? 'bg-gradient-to-r from-primary to-accent text-white' 
                        : 'bg-muted/50'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1.5 ${isMe ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {(msg.created_at || "").slice(11, 16)}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mb-3 opacity-30" />
                <p>메시지가 없습니다</p>
                <p className="text-sm opacity-70 mt-1">첫 메시지를 보내보세요</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-border/50 flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="메시지를 입력하세요..."
              disabled={!connected}
              className="input-modern"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!connected || !input.trim()}
              className="btn-gradient"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChatRoom
