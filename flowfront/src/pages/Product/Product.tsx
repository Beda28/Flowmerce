import styled from "styled-components";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "../../types/product";
import { searchProductList } from "../../api/product";
import { getId } from "../../utils/token";
import PageNation from "../../components/PageNation";

const ProductPage = () => {
  const { page } = useParams();
  const pageNum = Number(page) || 1;
  const [totalcount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("newest");
  const pageCount = Math.ceil(totalcount / 12) || 1;
  const isLoggedIn = getId() !== null;

  const LookProduct = (pid: string) => {
    navigate(`/product/${pid}`);
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
      <Header />
      <ProductBody>
        <ProductBox>
          <Title>상품</Title>
          <SearchBox>
            <LeftBox>
              <CateBox onChange={(e) => setType(e.target.value)} value={type}>
                <CateContent value="all">전체</CateContent>
                <CateContent value="name">상품명</CateContent>
                <CateContent value="category">카테고리</CateContent>
              </CateBox>
              <SearchInput
                placeholder="상품 검색..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                onKeyDown={(e) => e.key === "Enter" && SearchSubmit()}
              />
              <SearchButton onClick={SearchSubmit}>검색</SearchButton>
              <SortBox onChange={(e) => setSort(e.target.value)} value={sort}>
                <SortContent value="newest">최신순</SortContent>
                <SortContent value="price_high">가격높은순</SortContent>
                <SortContent value="price_low">가격낮은순</SortContent>
              </SortBox>
            </LeftBox>
            {isLoggedIn && <SellButton onClick={() => navigate("/product/write")}>판매하기</SellButton>}
          </SearchBox>

          <ProductGrid>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.pid} onClick={() => LookProduct(product.pid)}>
                  <ProductImage src={product.image ? `/uploads/${product.image}` : undefined} />
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductCategory>
                      {Array.isArray(product.category) 
                        ? product.category.join(", ") 
                        : product.category}
                    </ProductCategory>
                    <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
                  </ProductInfo>
                </ProductCard>
              ))
            ) : (
              <EmptyState>상품이 존재하지 않습니다.</EmptyState>
            )}
          </ProductGrid>
          <PageNation pageLength={pageCount} pageIndex={pageNum} url="/product"/>
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
  font-size: 36px;
  font-weight: 900;
  color: #212529;
  margin-bottom: 30px;
  letter-spacing: 2px;
`;

const SearchBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const LeftBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SellButton = styled.button`
  padding: 10px 24px;
  background-color: #5b73e8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background-color: #3b5af2; }
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

const ProductGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img<{ src?: string }>`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: ${props => props.src ? 'none' : 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)'};
`;

const ProductInfo = styled.div`
  padding: 20px;
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #212529;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductCategory = styled.p`
  font-size: 13px;
  color: #868e96;
  margin-bottom: 12px;
`;

const ProductPrice = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #5b73e8;
`;

const EmptyState = styled.div`
  width: 100%;
  padding: 100px 0;
  text-align: center;
  color: #adb5bd;
  font-size: 16px;
  grid-column: 1 / -1;
`;

export default ProductPage;
