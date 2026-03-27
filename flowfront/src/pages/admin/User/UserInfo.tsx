import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import AdminHeader from "../../../components/AdminHeader";
import { useEffect, useState } from "react";
import type { User } from "../../../types/user";
import { getUserInfo } from "../../../api/user";
import { getOrderList } from "../../../api/product";
import type { OrderItem } from "../../../types/product";

const AdminUserInfo = () => {
  const { id: uid } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!uid) return;
    const ListSetting = async () => {
      const res = await getUserInfo(uid);
      setUser(res.data.result);
      try {
        const orderRes = await getOrderList();
        setOrders(orderRes.data.result || []);
      } catch {}
    };
    ListSetting();
  }, [uid]);

  const totalPurchase = orders.reduce((sum, o) => sum + o.total_price, 0);

  return (
    <>
      <AdminHeader />
      <ReadMain>
        <ReadCard>
          <PostHeader>
            <PostTitle>유저 정보</PostTitle>
          </PostHeader>
          
          <InfoRow>
            <InfoLabel>아이디</InfoLabel>
            <InfoValue>{user?.id || "불러오는 중..."}</InfoValue>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>고유번호</InfoLabel>
            <InfoValue>{user?.uid || "불러오는 중..."}</InfoValue>
          </InfoRow>

          <SectionTitle>구매 이력</SectionTitle>
          <OrderSection>
            {orders.length > 0 ? (
              <>
                <OrderTable>
                  <OrderHeader>
                    <OrderHeaderItem width={40}>상품명</OrderHeaderItem>
                    <OrderHeaderItem width={15}>수량</OrderHeaderItem>
                    <OrderHeaderItem width={20}>금액</OrderHeaderItem>
                    <OrderHeaderItem width={25}>날짜</OrderHeaderItem>
                  </OrderHeader>
                  {orders.map(order => (
                    <OrderRow key={order.order_id}>
                      <OrderCell width={40}>{order.name}</OrderCell>
                      <OrderCell width={15}>{order.quantity}개</OrderCell>
                      <OrderCell width={20}>{order.total_price.toLocaleString()}원</OrderCell>
                      <OrderCell width={25}>{order.date?.slice(0, 10)}</OrderCell>
                    </OrderRow>
                  ))}
                </OrderTable>
                <TotalRow>
                  <TotalLabel>총 구매금액</TotalLabel>
                  <TotalValue>{totalPurchase.toLocaleString()}원</TotalValue>
                </TotalRow>
              </>
            ) : (
              <EmptyState>구매 이력이 없습니다.</EmptyState>
            )}
          </OrderSection>

          <FooterActions>
            <ListBtn onClick={() => navigate("/admin/user")}>목록으로</ListBtn>
            <UserActions>
              <EditBtn onClick={() => navigate(`/admin/user/update/${user?.uid}`)}>수정</EditBtn>
              <DeleteBtn onClick={() => navigate(`/admin/user/delete/${user?.uid}`)}>삭제</DeleteBtn>
            </UserActions>
          </FooterActions>
        </ReadCard>
      </ReadMain>
    </>
  );
};

const ReadMain = styled.div`
  width: 100%;
  padding: 150px 0 100px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  min-height: 100vh;
`;

const ReadCard = styled.div`
  width: 600px;
  background: white;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const PostHeader = styled.div`
  border-bottom: 2px solid #f1f3f5;
  padding-bottom: 30px;
  margin-bottom: 40px;
`;

const PostTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #212529;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f1f3f5;
`;

const InfoLabel = styled.div`
  width: 120px;
  font-size: 15px;
  font-weight: 600;
  color: #868e96;
`;

const InfoValue = styled.div`
  font-size: 16px;
  color: #212529;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #212529;
  margin-top: 40px;
  margin-bottom: 15px;
`;

const OrderSection = styled.div`
  margin-bottom: 30px;
`;

const OrderTable = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
`;

const OrderHeader = styled.div`
  display: flex;
  background: #f1f3f5;
  padding: 12px 0;
`;

const OrderHeaderItem = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: #495057;
`;

const OrderRow = styled.div`
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f5;
`;

const OrderCell = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  text-align: center;
  font-size: 14px;
  color: #495057;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
  padding: 15px 0;
`;

const TotalLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #868e96;
`;

const TotalValue = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #5b73e8;
`;

const EmptyState = styled.div`
  padding: 30px;
  text-align: center;
  color: #adb5bd;
  font-size: 14px;
`;

const FooterActions = styled.div`
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid #f1f3f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ListBtn = styled.button`
  background: #f1f3f5;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  color: #495057;
  cursor: pointer;
  &:hover { background: #e9ecef; }
`;

const UserActions = styled.div`
  display: flex;
  gap: 10px;
`;

const EditBtn = styled.button`
  background: #5b73e8;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  &:hover { background: #3b5af2; }
`;

const DeleteBtn = styled.button`
  background: white;
  border: 1px solid #ff4d4f;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  color: #ff4d4f;
  cursor: pointer;
  &:hover { background: #fff1f0; }
`;

export default AdminUserInfo;
