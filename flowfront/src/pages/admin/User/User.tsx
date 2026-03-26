import styled from "styled-components";
import AdminHeader from "../../../components/AdminHeader";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { User } from "../../../types/user";
import { getUserList } from "../../../api/user";

const AdminUserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const LookUser = (uid: string) => {
    navigate(`/admin/user/${uid}`);
  };

  useEffect(() => {
    const ListSetting = async () => {
      const res = await getUserList();
      setUsers(res.data.result);
    };
    ListSetting();
  }, []);

  return (
    <>
      <AdminHeader />
      <UserBody>
        <UserBox>
          <Title>유저 관리</Title>
          <TableWrapper>
            <UserHeader>
              <UserHeaderItem width={50}>아이디</UserHeaderItem>
              <UserHeaderItem width={50}>고유번호</UserHeaderItem>
            </UserHeader>
            <UserMain>
              {users.length > 0 ? (
                users.map((user) => (
                  <UserMainItem key={user.uid} onClick={() => LookUser(user.uid)}>
                    <UserMainText width={50}>{user.id}</UserMainText>
                    <UserMainText width={50}>{user.uid}</UserMainText>
                  </UserMainItem>
                ))
              ) : (
                <EmptyState>유저가 존재하지 않습니다.</EmptyState>
              )}
            </UserMain>
          </TableWrapper>
        </UserBox>
      </UserBody>
    </>
  );
};

const UserBody = styled.div`
  width: 100%;
  padding: 120px 0 60px;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

const UserBox = styled.div`
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #212529;
  margin-bottom: 30px;
`;

const TableWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
`;

const UserHeader = styled.div`
  width: 100%;
  height: 54px;
  display: flex;
  background-color: #f1f3f9;
  border-bottom: 1px solid #e9ecef;
`;

const UserHeaderItem = styled.div<{ width: number }>`
  width: ${({ width }) => width}%;
  height: 100%;
  font-size: 14px;
  font-weight: 700;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserMain = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const UserMainItem = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f8f9fa;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    background-color: #f8faff;
  }
`;

const UserMainText = styled.div<{ width: number }>`
  width: ${({ width }) => width}%;
  font-size: 15px;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyState = styled.div`
  width: 100%;
  padding: 100px 0;
  text-align: center;
  color: #adb5bd;
  font-size: 16px;
`;

export default AdminUserPage;
