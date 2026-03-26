import styled from "styled-components";
import { getId } from "../utils/token";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

const AdminHeader = () => {
  const LoginText = getId();
  const RegText = "로그아웃";
  const navigate = useNavigate();

    const Logout = async (e: React.MouseEvent) => {
      e.preventDefault()
      await logout()
      localStorage.removeItem("FM_Access")
      localStorage.removeItem("FM_Refresh")
      alert("로그아웃 성공")
      navigate('/')
    };

  useEffect(() => {
    if (getId() != "admin") {
      alert("권한이 없습니다.");
      navigate("/");
    }
  }, [navigate]);

  return (
    <HeaderTag>
      <Logo href="/">Flowmerce <span>Admin</span></Logo>
      <ContentBox>
        <ContentLink href="/admin/board">게시판</ContentLink>
      </ContentBox>
      <SessionBox>
        <AdminName>{LoginText}</AdminName>
        <LogoutButton onClick={(e) => Logout(e)}>{RegText}</LogoutButton>
      </SessionBox>
    </HeaderTag>
  );
};

const HeaderTag = styled.header`
  width: 100%;
  padding: 0 40px;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: #1a1d23;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const Logo = styled.a`
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  text-decoration: none;
  letter-spacing: -0.5px;
  
  span {
    color: #5b73e8;
    font-size: 14px;
    margin-left: 8px;
    vertical-align: middle;
  }
`;

const ContentBox = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const ContentLink = styled.a`
  font-size: 15px;
  font-weight: 600;
  color: #adb5bd;
  text-decoration: none;
  transition: 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const SessionBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const AdminName = styled.span`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 4px;
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid #495057;
  color: #adb5bd;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #ff4d4f;
    border-color: #ff4d4f;
    color: white;
  }
`;

export default AdminHeader;
