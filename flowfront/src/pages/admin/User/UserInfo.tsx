import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import AdminHeader from "../../../components/AdminHeader";
import { useEffect, useState } from "react";
import type { User } from "../../../types/user";
import { getUserInfo } from "../../../api/user";

const AdminUserInfo = () => {
  const { id: uid } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!uid) return;
    const ListSetting = async () => {
      const res = await getUserInfo(uid);
      setUser(res.data.result);
    };
    ListSetting();
  }, [uid]);

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
