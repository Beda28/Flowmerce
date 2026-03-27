import styled from "styled-components";
import Header from "../../components/Header";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getChatMessages } from "../../api/product";
import { getId } from "../../utils/token";

interface Message {
  sender_uid: string;
  message: string;
  created_at: string;
}

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const userId = getId();

  useEffect(() => {
    if (!roomId) return;

    const loadMessages = async () => {
      try {
        const res = await getChatMessages(roomId);
        setMessages(res.data.result || []);
      } catch {
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    };
    loadMessages();

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}/api/chat/ws/${roomId}`;
    
    ws.current = new WebSocket(wsUrl);
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_message") {
        setMessages(prev => [...prev, {
          sender_uid: data.sender_uid,
          message: data.message,
          created_at: data.created_at
        }]);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !ws.current) return;
    const token = localStorage.getItem("FM_Access");
    const payload = JSON.parse(atob(token?.split('.')[1] || '{}'));
    ws.current.send(JSON.stringify({
      uid: payload.uuid,
      message: input
    }));
    setMessages(prev => [...prev, {
      sender_uid: payload.uuid,
      message: input,
      created_at: new Date().toISOString()
    }]);
    setInput("");
  };

  return (
    <>
      <Header />
      <ChatBody>
        <ChatBox>
          <ChatHeader>
            <BackBtn onClick={() => navigate("/chat")}>← 목록</BackBtn>
            <ChatTitle>문의</ChatTitle>
          </ChatHeader>
          <MessagesBox>
            {messages.map((msg, idx) => (
              <MessageRow key={idx} $isMe={msg.sender_uid === userId}>
                <MessageBubble $isMe={msg.sender_uid === userId}>
                  {msg.message}
                </MessageBubble>
                <MessageTime>{msg.created_at?.slice(11, 16)}</MessageTime>
              </MessageRow>
            ))}
            <div ref={messagesEndRef} />
          </MessagesBox>
          <InputBox>
            <MessageInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="메시지를 입력하세요..."
            />
            <SendBtn onClick={sendMessage}>전송</SendBtn>
          </InputBox>
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
  width: 600px;
  height: 70vh;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f1f3f5;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  color: #868e96;
  cursor: pointer;
  &:hover { color: #5b73e8; }
`;

const ChatTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #212529;
`;

const MessagesBox = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MessageRow = styled.div<{ $isMe: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isMe ? "flex-end" : "flex-start"};
`;

const MessageBubble = styled.div<{ $isMe: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: ${props => props.$isMe ? "18px 18px 0 18px" : "18px 18px 18px 0"};
  background: ${props => props.$isMe ? "#5b73e8" : "#f1f3f5"};
  color: ${props => props.$isMe ? "white" : "#212529"};
  font-size: 15px;
  line-height: 1.4;
`;

const MessageTime = styled.span`
  font-size: 11px;
  color: #adb5bd;
  margin-top: 5px;
`;

const InputBox = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #f1f3f5;
  display: flex;
  gap: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #dee2e6;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  &:focus { border-color: #5b73e8; }
`;

const SendBtn = styled.button`
  padding: 12px 24px;
  background: #5b73e8;
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #3b5af2; }
`;

export default ChatRoom;
