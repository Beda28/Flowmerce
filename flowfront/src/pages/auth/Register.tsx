import { useState } from "react";
import Header from "../../components/Header";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { registerSubmit } from "../../api/auth";

const Register = () => {
  const [id, setId] = useState("");
  const [pw, setPW] = useState("");
  const navigate = useNavigate();

  const auth = async () => {
    const idRegex = /^[a-zA-Z0-9]{4,10}$/;
    if (!id.trim() || !pw.trim()) return alert("아이디와 비밀번호를 모두 입력해주세요.");
    if (!idRegex.test(id)) return alert("아이디는 4~10자의 영문 또는 숫자만 가능합니다.");
    if (pw.length < 8 || pw.length > 20) return alert("비밀번호는 8~20자 사이여야 합니다.");

    const res = await registerSubmit(id, pw);
    localStorage.setItem("FM_Access", res.data.access);
    localStorage.setItem("FM_Refresh", res.data.refresh);
    alert("회원가입 성공");
    navigate("/");
  };

  return (
    <>
      <Header />
      <RegisterBody>
        <RegisterBox>
          <RegisterTitle>Join Flowmerce</RegisterTitle>
          <RegisterSubtitle>다양한 상품을 만나보세요.</RegisterSubtitle>
          <InputGroup>
            <RegisterInput
              placeholder="사용할 아이디"
              onChange={(e) => setId(e.target.value)}
              value={id}
              maxLength={10}
            />
            <RegisterInput
              placeholder="사용할 비밀번호"
              onChange={(e) => setPW(e.target.value)}
              value={pw}
              type="password"
              maxLength={20}
            />
          </InputGroup>
          <RegisterButton onClick={auth}>회원가입 시작하기</RegisterButton>
          <HelperBox>
            이미 계정이 있으신가요?{" "}
            <span onClick={() => navigate("/login")}>로그인</span>
          </HelperBox>
        </RegisterBox>
      </RegisterBody>
    </>
  );
};

const RegisterBody = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  box-sizing: border-box;
`;

const RegisterBox = styled.div`
  width: 420px;
  padding: 50px 40px;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const RegisterTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #212529;
  margin-bottom: 8px;
`;

const RegisterSubtitle = styled.p`
  font-size: 15px;
  color: #868e96;
  margin-bottom: 35px;
`;

const InputGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
`;

const RegisterInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  font-size: 16px;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  background-color: #fcfcfc;
  box-sizing: border-box;
  transition: 0.2s;

  &:focus {
    outline: none;
    border-color: #5b73e8;
    background-color: #ffffff;
    box-shadow: 0 0 0 4px rgba(91, 115, 232, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  background-color: #5b73e8;
  color: #ffffff;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 4px 12px rgba(91, 115, 232, 0.2);

  &:hover {
    background-color: #3b5af2;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(91, 115, 232, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const HelperBox = styled.div`
  margin-top: 25px;
  font-size: 14px;
  color: #495057;

  span {
    color: #5b73e8;
    font-weight: 700;
    cursor: pointer;
    margin-left: 8px;
    text-decoration: underline;

    &:hover {
      color: #3b5af2;
    }
  }
`;

export default Register;
