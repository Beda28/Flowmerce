import styled from "styled-components";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChatRooms } from "../../api/product";

interface ChatRoom {
  room_id: string;
  pid: string;
  product_name: string;
  image: string | null;
  price: number;
  buyer_id: string;
  created_at: string;
}

const ChatRooms = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await getChatRooms();
        setRooms(res.data.result || []);
      } catch {
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    };
    loadRooms();
  }, []);

  return (
    <>
      <Header />
      <ChatBody>
        <ChatBox>
          <Title>문의 목록</Title>
          <RoomList>
            {rooms.length > 0 ? (
              rooms.map(room => (
                <RoomCard key={room.room_id} onClick={() => navigate(`/chat/${room.room_id}`)}>
                  <RoomImage src={room.image ? `/uploads/${room.image}` : undefined} />
                  <RoomInfo>
                    <RoomProduct>{room.product_name}</RoomProduct>
                    <RoomPrice>{room.price?.toLocaleString()}원</RoomPrice>
                    <RoomDate>{room.created_at?.slice(0, 10)}</RoomDate>
                  </RoomInfo>
                </RoomCard>
              ))
            ) : (
              <EmptyState>문의 내역이 없습니다.</EmptyState>
            )}
          </RoomList>
        </ChatBox>
      </ChatBody>
    </>
  );
};

const ChatBody = styled.div`
  width: 100%;
  padding: 120px 0 60px;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

const ChatBox = styled.div`
  width: 800px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: #212529;
  margin-bottom: 30px;
`;

const RoomList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const RoomCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  }
`;

const RoomImage = styled.img<{ src?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
  background: ${props => props.src ? "none" : "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)"};
`;

const RoomInfo = styled.div`
  flex: 1;
`;

const RoomProduct = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #212529;
  margin-bottom: 5px;
`;

const RoomPrice = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #5b73e8;
  margin-bottom: 5px;
`;

const RoomDate = styled.div`
  font-size: 12px;
  color: #868e96;
`;

const EmptyState = styled.div`
  padding: 60px;
  text-align: center;
  color: #adb5bd;
  font-size: 16px;
  background: white;
  border-radius: 15px;
`;

export default ChatRooms;
