import styled from "styled-components";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { getId } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import { boardWriteSubmit } from "../../api/board";

const BoardWrite = () => {
  const [title, settitle] = useState("");
  const [content, setcontent] = useState("");
  const id = getId();
  const navigate = useNavigate();

  const submit = async () => {
    await boardWriteSubmit(title, content);
    alert("작성 성공");
    navigate(`/board`);
  };

  useEffect(() => {
    if (!id) {
      alert("로그인 후에 이용할 수 있습니다.");
      navigate("/login");
    }
  }, [id, navigate]);

  return (
    <>
      <Header />
      <WriteBody>
        <WriteCard>
          <FormTitle>게시글 작성</FormTitle>
          <FormGroup>
            <InputLabel>제목</InputLabel>
            <InputTag
              placeholder="게시글의 제목을 입력해주세요."
              onChange={(e) => settitle(e.target.value)}
              value={title}
            />
          </FormGroup>
          <FormGroup>
            <InputLabel>내용</InputLabel>
            <InputArea
              placeholder="내용을 정성껏 입력해주세요."
              onChange={(e) => setcontent(e.target.value)}
              value={content}
            />
          </FormGroup>
          <ButtonGroup>
            <CancelBtn onClick={() => navigate(-1)}>취소</CancelBtn>
            <SubmitBtn onClick={submit}>작성 완료</SubmitBtn>
          </ButtonGroup>
        </WriteCard>
      </WriteBody>
    </>
  );
};

const WriteBody = styled.div`
  width: 100%;
  padding: 150px 0 100px;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

const WriteCard = styled.div`
  width: 850px;
  background: white;
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #212529;
  margin-bottom: 40px;
`;

const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 25px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #495057;
  margin-bottom: 10px;
`;

const InputTag = styled.input`
  width: 100%;
  padding: 15px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #dee2e6;
  background: #fcfcfc;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #5b73e8; background: white; }
`;

const InputArea = styled.textarea`
  width: 100%;
  height: 400px;
  padding: 15px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #dee2e6;
  background: #fcfcfc;
  box-sizing: border-box;
  resize: none;
  &:focus { outline: none; border-color: #5b73e8; background: white; }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 40px;
`;

const CancelBtn = styled.button`
  padding: 14px 30px;
  background: #f1f3f5;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
`;

const SubmitBtn = styled.button`
  padding: 14px 40px;
  background: #5b73e8;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: #3b5af2; }
`;

export default BoardWrite;
