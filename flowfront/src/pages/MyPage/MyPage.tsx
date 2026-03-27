import styled from "styled-components";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getId } from "../../utils/token";
import { getMyProducts, getChatRooms, getCartList, getProfile, updateProfile } from "../../api/product";

interface ProductItem {
  pid: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
}

interface ChatRoomItem {
  room_id: string;
  pid: string;
  product_name: string;
  price: number;
  image: string | null;
}

interface CartItem {
  cart_id: number;
  pid: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface UserProfile {
  uid: string;
  id: string;
  intro: string | null;
}

const MyPage = () => {
  const navigate = useNavigate();
  const userId = getId();
  const [activeTab, setActiveTab] = useState("products");
  const [myProducts, setMyProducts] = useState<ProductItem[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoomItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newId, setNewId] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newIntro, setNewIntro] = useState("");

  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, productRes, chatRes, cartRes] = await Promise.all([
        getProfile(),
        getMyProducts(),
        getChatRooms(),
        getCartList()
      ]);
      setProfile(profileRes.data);
      setNewId(profileRes.data.id);
      setNewIntro(profileRes.data.intro || "");
      setMyProducts(productRes.data.result || []);
      setChatRooms(chatRes.data.result || []);
      setCartItems(cartRes.data.result || []);
    } catch {}
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(
        newId !== profile?.id ? newId : undefined,
        newPw || undefined,
        newIntro !== (profile?.intro || "") ? newIntro : undefined
      );
      alert("프로필 수정 완료");
      setEditMode(false);
      setNewPw("");
      loadData();
    } catch (e: any) {
      alert(e.response?.data?.detail?.msg || "수정 실패");
    }
  };

  return (
    <>
      <Header />
      <MyPageBody>
        <MyPageBox>
          <ProfileSection>
            {!editMode ? (
              <>
                <ProfileName>{profile?.id || userId}님</ProfileName>
                <ProfileIntro>{profile?.intro || "소개글이 없습니다."}</ProfileIntro>
                <EditProfileBtn onClick={() => setEditMode(true)}>프로필 수정</EditProfileBtn>
              </>
            ) : (
              <EditForm>
                <EditTitle>프로필 수정</EditTitle>
                <EditRow>
                  <EditLabel>아이디</EditLabel>
                  <EditInput value={newId} onChange={(e) => setNewId(e.target.value)} />
                </EditRow>
                <EditRow>
                  <EditLabel>새 비밀번호</EditLabel>
                  <EditInput type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="변경시에만 입력" />
                </EditRow>
                <EditRow>
                  <EditLabel>소개글</EditLabel>
                  <EditTextarea value={newIntro} onChange={(e) => setNewIntro(e.target.value)} placeholder="자기소개를 입력하세요" />
                </EditRow>
                <EditBtns>
                  <CancelBtn onClick={() => { setEditMode(false); setNewId(profile?.id || ""); setNewPw(""); setNewIntro(profile?.intro || ""); }}>취소</CancelBtn>
                  <SaveBtn onClick={handleSaveProfile}>저장</SaveBtn>
                </EditBtns>
              </EditForm>
            )}
          </ProfileSection>

          <TabBox>
            <Tab $active={activeTab === "products"} onClick={() => setActiveTab("products")}>
              내 상품 ({myProducts.length})
            </Tab>
            <Tab $active={activeTab === "cart"} onClick={() => setActiveTab("cart")}>
              장바구니 ({cartItems.length})
            </Tab>
            <Tab $active={activeTab === "chat"} onClick={() => setActiveTab("chat")}>
              문의 ({chatRooms.length})
            </Tab>
          </TabBox>

          <ContentSection>
            {activeTab === "products" && (
              <>
                <SectionHeader>
                  <SectionTitle>내 상품</SectionTitle>
                  <AddBtn onClick={() => navigate("/product/write")}>+ 상품 등록</AddBtn>
                </SectionHeader>
                <ItemList>
                  {myProducts.length > 0 ? (
                    myProducts.map(product => (
                      <ItemCard key={product.pid} onClick={() => navigate(`/product/${product.pid}`)}>
                        <ItemImage src={product.image ? `/uploads/${product.image}` : undefined} />
                        <ItemInfo>
                          <ItemName>{product.name}</ItemName>
                          <ItemPrice>{product.price.toLocaleString()}원</ItemPrice>
                          <ItemStock>재고: {product.stock}개</ItemStock>
                        </ItemInfo>
                        <EditItemBtn onClick={(e) => { e.stopPropagation(); navigate(`/product/update/${product.pid}`); }}>
                          수정
                        </EditItemBtn>
                      </ItemCard>
                    ))
                  ) : (
                    <EmptyState>등록한 상품이 없습니다.</EmptyState>
                  )}
                </ItemList>
              </>
            )}

            {activeTab === "cart" && (
              <>
                <SectionHeader>
                  <SectionTitle>장바구니</SectionTitle>
                </SectionHeader>
                <ItemList>
                  {cartItems.length > 0 ? (
                    cartItems.map(item => (
                      <ItemCard key={item.cart_id} onClick={() => navigate(`/product/${item.pid}`)}>
                        <ItemImage src={item.image ? `/uploads/${item.image}` : undefined} />
                        <ItemInfo>
                          <ItemName>{item.name}</ItemName>
                          <ItemPrice>{item.price.toLocaleString()}원</ItemPrice>
                          <ItemStock>수량: {item.quantity}개</ItemStock>
                        </ItemInfo>
                      </ItemCard>
                    ))
                  ) : (
                    <EmptyState>장바구니가 비어있습니다.</EmptyState>
                  )}
                </ItemList>
                {cartItems.length > 0 && (
                  <CartMoveBtn onClick={() => navigate("/cart")}>장바구니로 이동</CartMoveBtn>
                )}
              </>
            )}

            {activeTab === "chat" && (
              <>
                <SectionHeader>
                  <SectionTitle>문의</SectionTitle>
                </SectionHeader>
                <ItemList>
                  {chatRooms.length > 0 ? (
                    chatRooms.map(room => (
                      <ItemCard key={room.room_id} onClick={() => navigate(`/chat/${room.room_id}`)}>
                        <ItemImage src={room.image ? `/uploads/${room.image}` : undefined} />
                        <ItemInfo>
                          <ItemName>{room.product_name}</ItemName>
                          <ItemPrice>{room.price?.toLocaleString()}원</ItemPrice>
                        </ItemInfo>
                      </ItemCard>
                    ))
                  ) : (
                    <EmptyState>문의 내역이 없습니다.</EmptyState>
                  )}
                </ItemList>
              </>
            )}
          </ContentSection>
        </MyPageBox>
      </MyPageBody>
    </>
  );
};

const MyPageBody = styled.div`
  width: 100%;
  padding: 120px 0 60px;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

const MyPageBox = styled.div`
  width: 900px;
`;

const ProfileSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px 40px;
  margin-bottom: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
`;

const ProfileName = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #212529;
`;

const ProfileIntro = styled.p`
  font-size: 14px;
  color: #868e96;
  margin-top: 8px;
`;

const EditProfileBtn = styled.button`
  margin-top: 15px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  &:hover { background: #f8f9fa; }
`;

const EditForm = styled.div``;

const EditTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #212529;
  margin-bottom: 20px;
`;

const EditRow = styled.div`
  margin-bottom: 15px;
`;

const EditLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 6px;
`;

const EditInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #5b73e8; }
`;

const EditTextarea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #5b73e8; }
`;

const EditBtns = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const CancelBtn = styled.button`
  padding: 10px 20px;
  background: #f1f3f5;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const SaveBtn = styled.button`
  padding: 10px 20px;
  background: #5b73e8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #3b5af2; }
`;

const TabBox = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: ${props => props.$active ? "#5b73e8" : "white"};
  color: ${props => props.$active ? "white" : "#495057"};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  &:hover { background: ${props => props.$active ? "#3b5af2" : "#f8f9fa"}; }
`;

const ContentSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #212529;
`;

const AddBtn = styled.button`
  padding: 10px 20px;
  background: #5b73e8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #3b5af2; }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 12px;
  background: #f8f9fa;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: #f1f3f5; }
`;

const ItemImage = styled.img<{ src?: string }>`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  background: ${props => props.src ? "none" : "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)"};
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 4px;
`;

const ItemPrice = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #5b73e8;
`;

const ItemStock = styled.div`
  font-size: 12px;
  color: #868e96;
`;

const EditItemBtn = styled.button`
  padding: 8px 16px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  &:hover { background: #f8f9fa; }
`;

const CartMoveBtn = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 20px;
  background: #5b73e8;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #3b5af2; }
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #adb5bd;
  font-size: 14px;
`;

export default MyPage;
