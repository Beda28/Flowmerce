import styled from "styled-components";
import AdminHeader from "../../../components/AdminHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "../../../types/product";
import { searchProductList } from "../../../api/product";
import PageNation from "../../../components/PageNation";

const AdminProductPage = () => {
  const { page } = useParams();
  const pageNum = Number(page) || 1;
  const [totalcount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("newest");
  const pageCount = Math.ceil(totalcount / 12) || 1;

  const LookProduct = (pid: string) => {
    navigate(`/admin/product/${pid}`);
  };

  const SearchSubmit = async () => {
    const res = await searchProductList(search, type, pageNum, sort);
    setProducts(res.data.result);
    setTotalCount(res.data.total_count);
  };

  useEffect(() => {
    const ListSetting = async () => {
      const res = await searchProductList("", "all", pageNum, sort);
      setProducts(res.data.result);
      setTotalCount(res.data.total_count);
    };
    ListSetting();
  }, [pageNum, sort]);

  return (
    <>
      <AdminHeader />
      <ProductBody>
        <ProductBox>
          <Title>상품 관리</Title>
          <SearchBox>
            <CateBox onChange={(e) => setType(e.target.value)} value={type}>
              <CateContent value="all">전체</CateContent>
              <CateContent value="name">상품명</CateContent>
              <CateContent value="category">카테고리</CateContent>
            </CateBox>
            <SearchInput
              placeholder="상품 검색..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <SearchButton onClick={SearchSubmit}>검색</SearchButton>
            <SortBox onChange={(e) => setSort(e.target.value)} value={sort}>
              <SortContent value="newest">최신순</SortContent>
              <SortContent value="price_high">가격높은순</SortContent>
              <SortContent value="price_low">가격낮은순</SortContent>
            </SortBox>
            <WriteButton href="/admin/product/write">상품 등록</WriteButton>
          </SearchBox>

          <TableWrapper>
            <ProductHeader>
              <ProductHeaderItem width={10}>번호</ProductHeaderItem>
              <ProductHeaderItem width={30}>상품명</ProductHeaderItem>
              <ProductHeaderItem width={20}>카테고리</ProductHeaderItem>
              <ProductHeaderItem width={15}>가격</ProductHeaderItem>
              <ProductHeaderItem width={15}>재고</ProductHeaderItem>
              <ProductHeaderItem width={10}>등록일</ProductHeaderItem>
            </ProductHeader>
            <ProductMain>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <ProductMainItem key={product.pid} onClick={() => LookProduct(product.pid)}>
                    <ProductMainText width={10}>{index + 1 + (pageNum - 1) * 12}</ProductMainText>
                    <ProductMainText width={30}>{product.name}</ProductMainText>
                    <ProductMainText width={20}>
                      {Array.isArray(product.category) ? product.category.join(", ") : product.category}
                    </ProductMainText>
                    <ProductMainText width={15}>{product.price.toLocaleString()}원</ProductMainText>
                    <ProductMainText width={15}>{product.stock}개</ProductMainText>
                    <ProductMainText width={10}>{product.date?.slice(0, 10)}</ProductMainText>
                  </ProductMainItem>
                ))
              ) : (
                <EmptyState>상품이 존재하지 않습니다.</EmptyState>
              )}
            </ProductMain>
          </TableWrapper>
          <PageNation pageLength={pageCount} pageIndex={pageNum} url="/admin/product"/>
        </ProductBox>
      </ProductBody>
    </>
  );
};

const ProductBody = styled.div`
  width: 100%;
  padding: 120px 0 60px;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

const ProductBox = styled.div`
  width: 1200px;
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

const SortBox = styled.select`
  padding: 10px 15px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #495057;
  outline: none;
  &:focus { border-color: #5b73e8; }
`;

const SortContent = styled.option``;

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

const ProductHeader = styled.div`
  width: 100%;
  height: 54px;
  display: flex;
  background-color: #f1f3f9;
  border-bottom: 1px solid #e9ecef;
`;

const ProductHeaderItem = styled.div<{ width: number }>`
  width: ${({ width }) => width}%;
  height: 100%;
  font-size: 14px;
  font-weight: 700;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductMain = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ProductMainItem = styled.div`
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

const ProductMainText = styled.div<{ width: number }>`
  width: ${({ width }) => width}%;
  font-size: 14px;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  width: 100%;
  padding: 100px 0;
  text-align: center;
  color: #adb5bd;
  font-size: 16px;
`;

export default AdminProductPage;
