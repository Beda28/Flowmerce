import styled from "styled-components";
import AdminHeader from "../../../components/AdminHeader";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminBoardUpdateSubmit, getBoardInfo } from "../../../api/board";

const AdminBoardUpdate = () => {
  const { id: bid } = useParams();
  const [title, settitle] = useState("");
  const [content, setcontent] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    await adminBoardUpdateSubmit(bid, title, content)
    alert("수정 성공");
    navigate(`/admin/board`);
  };

  useEffect(() => {
    const ListSetting = async () => {
      const res = await getBoardInfo(bid)
      settitle(res.data.result.title);
      setcontent(res.data.result.content);
    };
    ListSetting();
  }, [bid]);

  return (
    <>
      <AdminHeader />
      <WriteBody>
        <WriteCard>
          <FormTitle>게시글 수정</FormTitle>
          <FormGroup>
            <InputLabel>제목</InputLabel>
            <InputTag
              placeholder="제목을 입력해주세요."
              onChange={(e) => settitle(e.target.value)}
              value={title}
            />
          </FormGroup>
          <FormGroup>
            <InputLabel>내용</InputLabel>
            <InputArea
              placeholder="내용을 입력해주세요."
              onChange={(e) => setcontent(e.target.value)}
              value={content}
            />
          </FormGroup>
          <ButtonGroup>
            <CancelBtn onClick={() => navigate(-1)}>취소</CancelBtn>
            <SubmitBtn onClick={submit}>수정 완료</SubmitBtn>
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

export default AdminBoardUpdate;
