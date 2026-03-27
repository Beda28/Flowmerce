import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import AdminHeader from "../../../components/AdminHeader";
import { useEffect, useState } from "react";
import type { Product } from "../../../types/product";
import { getProductInfo } from "../../../api/product";

const AdminProductInfo = () => {
  const { id: pid } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!pid) return;
    const ListSetting = async () => {
      const res = await getProductInfo(pid);
      setProduct(res.data.result);
    };
    ListSetting();
  }, [pid]);

  return (
    <>
      <AdminHeader />
      <ProductMain>
        <ProductCard>
          <ProductImage src={product?.image ? `/uploads/${product.image}` : undefined} />
          <ProductDetails>
            <ProductCategory>
              {Array.isArray(product?.category) 
                ? product?.category.join(" > ") 
                : product?.category}
            </ProductCategory>
            <ProductName>{product?.name || "상품명을 불러오는 중..."}</ProductName>
            <ProductPrice>{product?.price?.toLocaleString() || 0}원</ProductPrice>
            
            <ProductInfoRow>
              <InfoLabel>재고</InfoLabel>
              <InfoValue>{product?.stock || 0}개</InfoValue>
            </ProductInfoRow>
            
            <ProductInfoRow>
              <InfoLabel>등록일</InfoLabel>
              <InfoValue>{product?.date?.slice(0, 10) || "-"}</InfoValue>
            </ProductInfoRow>

            <ProductDesc>
              {product?.description || "상품 설명이 없습니다."}
            </ProductDesc>

            <ButtonGroup>
              <BackBtn onClick={() => navigate("/admin/product")}>목록으로</BackBtn>
              <EditBtn onClick={() => navigate(`/admin/product/update/${product?.pid}`)}>수정</EditBtn>
              <DeleteBtn onClick={() => navigate(`/admin/product/delete/${product?.pid}`)}>삭제</DeleteBtn>
            </ButtonGroup>
          </ProductDetails>
        </ProductCard>
      </ProductMain>
    </>
  );
};

const ProductMain = styled.div`
  width: 100%;
  padding: 120px 0 100px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  min-height: 100vh;
`;

const ProductCard = styled.div`
  width: 1000px;
  background: white;
  border-radius: 20px;
  padding: 50px;
  display: flex;
  gap: 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const ProductImage = styled.img<{ src?: string }>`
  width: 400px;
  height: 400px;
  object-fit: cover;
  background: ${props => props.src ? "none" : "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)"};
  border-radius: 15px;
  flex-shrink: 0;
`;

const ProductDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductCategory = styled.p`
  font-size: 14px;
  color: #868e96;
  margin-bottom: 10px;
`;

const ProductName = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #212529;
  margin-bottom: 20px;
`;

const ProductPrice = styled.p`
  font-size: 36px;
  font-weight: 800;
  color: #5b73e8;
  margin-bottom: 30px;
`;

const ProductInfoRow = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f5;
`;

const InfoLabel = styled.span`
  width: 100px;
  font-size: 14px;
  font-weight: 600;
  color: #868e96;
`;

const InfoValue = styled.span`
  font-size: 15px;
  color: #212529;
`;

const ProductDesc = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #495057;
  margin-top: 30px;
  flex: 1;
  white-space: pre-wrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 40px;
`;

const BackBtn = styled.button`
  flex: 1;
  padding: 16px;
  background: #f1f3f5;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  color: #495057;
  cursor: pointer;
  &:hover { background: #e9ecef; }
`;

const EditBtn = styled.button`
  flex: 1;
  padding: 16px;
  background: #5b73e8;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  &:hover { background: #3b5af2; }
`;

const DeleteBtn = styled.button`
  flex: 1;
  padding: 16px;
  background: white;
  border: 1px solid #ff4d4f;
  border-radius: 10px;
  font-weight: 600;
  color: #ff4d4f;
  cursor: pointer;
  &:hover { background: #fff1f0; }
`;

export default AdminProductInfo;
