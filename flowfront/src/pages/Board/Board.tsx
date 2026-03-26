import styled from "styled-components";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Board } from "../../types/board";
import { getBoardList, searchBoardList } from "../../api/board";
import PageNation from "../../components/PageNation";

const BoardPage = () => {
  const { page } = useParams();
  const pageNum = Number(page) || 1;
  const [totalcount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Board[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("Board.title");
  const pageCount = Math.ceil(totalcount / 10) || 1;

  const LookPost = (uuid: string) => {
    navigate(`/board/${uuid}`);
  };

  const SearchSubmit = async () => {
    const res = await searchBoardList(search, type, pageNum);
    setPosts(res.data.result);
    setTotalCount(res.data.total_count);
  };

  useEffect(() => {
    const ListSetting = async () => {
      const res = await getBoardList(pageNum);
      setPosts(res.data.result);
      setTotalCount(res.data.total_count);
    };

    ListSetting();
  }, [pageNum]);

  return (
    <>
      <Header />
      <BoardBody>
        <BoardBox>
          <SearchBox>
            <CateBox
              onChange={(e) => setType(e.target.value)}
              value={type}
            >
              <CateContent value={"Board.title"}>제목</CateContent>
              <CateContent value={"User.id"}>작성자</CateContent>
            </CateBox>
            <SearchInput
              placeholder="게시글 검색..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <SearchButton onClick={SearchSubmit}>검색</SearchButton>
            <WriteButton href="/board/write">글쓰기</WriteButton>
          </SearchBox>

          <TableWrapper>
            <BoardHeader>
              <BoardHeaderItem width={10}>번호</BoardHeaderItem>
              <BoardHeaderItem width={45}>제목</BoardHeaderItem>
              <BoardHeaderItem width={20}>작성자</BoardHeaderItem>
              <BoardHeaderItem width={15}>날짜</BoardHeaderItem>
              <BoardHeaderItem width={10}>조회</BoardHeaderItem>
            </BoardHeader>
            <BoardMain>
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <BoardMainItem
                    key={post.bid}
                    onClick={() => LookPost(post.bid)}
                  >
                    <BoardMainText width={10}>{index + 1 + (pageNum - 1) * 10}</BoardMainText>
                    <BoardMainText width={45} $flex={true} className="title">
                      {post.title}
                    </BoardMainText>
                    <BoardMainText width={20}>{post.id}</BoardMainText>
                    <BoardMainText width={15}>
                      {post.date.slice(0, 10)}
                    </BoardMainText>
                    <BoardMainText width={10}>{post.viewcount}</BoardMainText>
                  </BoardMainItem>
                ))
              ) : (
                <EmptyState>게시글이 존재하지 않습니다.</EmptyState>
              )}
            </BoardMain>
          </TableWrapper>
          <PageNation pageLength={pageCount} pageIndex={pageNum} url="/board"/>
        </BoardBox>
      </BoardBody>
    </>
  );
};

const BoardBody = styled.div`
  width: 100%;
  padding: 120px 0 60px;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

const BoardBox = styled.div`
  width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
`;

const CateBox = styled.select`
  padding: 10px 15px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #495057;
  outline: none;
  &:focus { border-color: #5b73e8; }
`;

const CateContent = styled.option``;

const SearchInput = styled.input`
  width: 250px;
  padding: 10px 16px;
  font-size: 14px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  outline: none;
  &:focus { border-color: #5b73e8; }
`;

const SearchButton = styled.button`
  padding: 10px 24px;
  background-color: #ffffff;
  color: #5b73e8;
  border: 1px solid #5b73e8;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background-color: #f8faff; }
`;

const WriteButton = styled.a`
  padding: 10px 24px;
  background-color: #5b73e8;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.2s;
  &:hover { background-color: #3b5af2; }
`;

const TableWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
`;

const BoardHeader = styled.div`
  width: 100%;
  height: 54px;
  display: flex;
  background-color: #f1f3f9;
  border-bottom: 1px solid #e9ecef;
`;

const BoardHeaderItem = styled.div<{ width: number }>`
  width: ${({ width }) => width}%;
  height: 100%;
  font-size: 14px;
  font-weight: 700;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BoardMain = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const BoardMainItem = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f8f9fa;
  transition: 0.2s;
  &:hover {
    cursor: pointer;
    background-color: #f8faff;
    .title { color: #5b73e8; }
  }
`;

const BoardMainText = styled.div<{ width: number; $flex?: boolean }>`
  width: ${({ width }) => width}%;
  font-size: 15px;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: ${({ $flex }) => ($flex ? "flex-start" : "center")};
  padding: ${({ $flex }) => ($flex ? "0 20px" : "0")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &.title {
    font-weight: 500;
    transition: 0.2s;
  }
`;

const EmptyState = styled.div`
  width: 100%;
  padding: 100px 0;
  text-align: center;
  color: #adb5bd;
  font-size: 16px;
`;

export default BoardPage;
