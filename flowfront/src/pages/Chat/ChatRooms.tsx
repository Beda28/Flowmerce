import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import { getChatRooms } from "@/api/product"
import { MessageSquare, Package, ChevronRight } from "lucide-react"

interface ChatRoom {
  room_id: string
  pid: string
  product_name: string
  price: number
  image: string | null
}

const ChatRooms = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await getChatRooms()
        const rawData = res.data.result || res.data || []
        
        const formattedData = rawData.map((item: any) => {
          const roomBase = item.ChatRoom || item
          return {
            room_id: roomBase.room_id,
            pid: roomBase.pid,
            product_name: item.product_name || item.name,
            price: item.price,
            image: item.image
          }
        })
        
        setRooms(formattedData)
      } catch (e) {
        console.error(e)
      }
    }
    loadRooms()
  }, [])

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container mx-auto px-6 pt-24 pb-12 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">문의 목록</span>
          </h1>
          <p className="text-muted-foreground mt-2">전체 {rooms.length}개의 문의</p>
        </div>

        <div className="space-y-4">
          {rooms.length > 0 ? (
            rooms.map((room, index) => (
              <div
                key={room.room_id || index}
                className="glass rounded-xl p-5 hover:bg-muted/30 cursor-pointer transition-all group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  if (room.room_id) {
                    navigate(`/chat/${room.room_id}`)
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-white/5">
                    {room.image ? (
                      <img src={`/uploads/${room.image}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground opacity-30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors truncate max-w-[200px]">
                      {room.product_name}
                    </h3>
                    <p className="gradient-text font-bold mt-1">{(room.price || 0).toLocaleString()}원</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))
          ) : (
            <div className="glass rounded-2xl p-16 text-center border border-white/10">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <p className="text-lg font-medium text-muted-foreground">문의 내역이 없습니다</p>
              <p className="text-sm text-muted-foreground/70 mt-1">상품 페이지에서 문의할 수 있습니다</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ChatRooms