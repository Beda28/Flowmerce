import styled from "styled-components"
import { getId } from "../utils/token"
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const userId = getId()
  const isLoggedIn = userId !== null
  const ProfileLink = userId === 'admin' ? '/admin/user' : '/mypage'
  const navigate = useNavigate()

  const Logout = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await logout()
    } finally {
      localStorage.removeItem("FM_Access");
      localStorage.removeItem("FM_Refresh");
      alert("로그아웃 성공");
      navigate('/')
    }
  }

  return (
    <HeaderTag>
      <Logo href="/">Flowmerce</Logo>
      <NavBox>
        <NavLink href="/product">상품</NavLink>
        <NavLink href="/board">커뮤니티</NavLink>
      </NavBox>
      <UserActionBox>
        {!isLoggedIn ? (
          <>
            <LoginBtn href="/login">로그인</LoginBtn>
            <RegisterBtn href="/register">회원가입</RegisterBtn>
          </>
        ) : (
          <>
            <MyPageLink href={ProfileLink}>{userId}님</MyPageLink>
            <LogoutBtn onClick={(e) => Logout(e)}>로그아웃</LogoutBtn>
          </>
        )}
      </UserActionBox>
    </HeaderTag>
  )
}

const HeaderTag = styled.header`
  width: 100%;
  height: 80px;
  padding: 0 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #f1f3f5;
  box-sizing: border-box;
`;

const Logo = styled.a`
  font-size: 26px;
  font-weight: 900;
  color: #5b73e8;
  text-decoration: none;
`;

const NavBox = styled.div`
  display: flex;
  gap: 24px;
`;

const NavLink = styled.a`
  font-size: 15px;
  font-weight: 600;
  color: #495057;
  text-decoration: none;
  &:hover { color: #5b73e8; }
`;

const UserActionBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BaseActionBtn = styled.a`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  border-radius: 50px;
  transition: 0.2s;
`;

const LoginBtn = styled(BaseActionBtn)`
  color: #495057;
  &:hover { background-color: #f8f9fa; }
`;

const RegisterBtn = styled(BaseActionBtn)`
  background-color: #5b73e8;
  color: white;
  &:hover { background-color: #3b5af2; box-shadow: 0 4px 12px rgba(91, 115, 232, 0.3); }
`;

const MyPageLink = styled.a`
  font-size: 14px;
  font-weight: 700;
  color: #495057;
  text-decoration: none;
  margin-right: 10px;
  &:hover { color: #5b73e8; }
`;

const LogoutBtn = styled.button`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  color: #868e96;
  cursor: pointer;
  &:hover { background-color: #fff1f0; color: #ff4d4f; border-color: #ffccc7; }
`;

export default Header;
