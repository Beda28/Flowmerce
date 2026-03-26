import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import AdminHeader from "../../../components/AdminHeader";
import { useEffect, useState } from "react";
import type { Board } from "../../../types/board";
import { getBoardInfo } from "../../../api/board";

const AdminBoardInfo = () => {
  const { id: bid } = useParams();
  const [posts, setPosts] = useState<Board>();
  const navigate = useNavigate();

  useEffect(() => {
    const ListSetting = async () => {
      const res = await getBoardInfo(bid)
      setPosts(res.data.result);
    };
    ListSetting();
  }, [bid]);

  return (
    <>
      <AdminHeader />
      <ReadMain>
        <ReadCard>
          <PostHeader>
            <PostTitle>{posts?.title || "제목을 불러오는 중..."}</PostTitle>
            <PostMeta>
              <MetaLeft>
                <AuthorName>{posts?.id}</AuthorName>
                <Divider />
                <PostDate>{posts?.date?.slice(0, 10)}</PostDate>
              </MetaLeft>
              <MetaRight>
                조회수 <span>{posts?.viewcount || 0}</span>
              </MetaRight>
            </PostMeta>
          </PostHeader>
          
          <ContentArea>
            {posts?.content || "내용이 없습니다."}
          </ContentArea>

          <FooterActions>
            <ListBtn onClick={() => navigate("/admin/board")}>목록으로</ListBtn>
            <UserActions>
              <EditBtn onClick={() => navigate(`/admin/board/update/${posts?.bid}`)}>수정</EditBtn>
              <DeleteBtn onClick={() => navigate(`/admin/board/delete/${posts?.bid}`)}>삭제</DeleteBtn>
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
  width: 900px;
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
  margin-bottom: 20px;
  line-height: 1.4;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetaLeft = styled.div`
  display: flex;
  align-items: center;
  color: #868e96;
  font-size: 15px;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: #495057;
`;

const Divider = styled.span`
  width: 1px;
  height: 12px;
  background: #dee2e6;
  margin: 0 15px;
`;

const PostDate = styled.span``;

const MetaRight = styled.div`
  font-size: 14px;
  color: #adb5bd;
  span { color: #495057; font-weight: 600; }
`;

const ContentArea = styled.div`
  min-height: 300px;
  font-size: 17px;
  line-height: 1.8;
  color: #343a40;
  white-space: pre-wrap;
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

export default AdminBoardInfo;
