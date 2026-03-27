import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import type { Product } from "../../types/product";
import { getProductInfo, addToCart } from "../../api/product";

const ProductInfo = () => {
  const { id: pid } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product>();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!pid) return;
    const ListSetting = async () => {
      const res = await getProductInfo(pid);
      setProduct(res.data.result);
    };
    ListSetting();
  }, [pid]);

  const handleAddToCart = async () => {
    if (!pid || !product) return;
    try {
      await addToCart(pid, quantity);
      alert("장바구니에 추가되었습니다.");
      navigate("/cart");
    } catch (e) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  const handleBuyNow = async () => {
    if (!pid || !product) return;
    try {
      await addToCart(pid, quantity);
      navigate("/cart");
    } catch (e) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < (product?.stock || 1)) setQuantity(quantity + 1);
  };

  return (
    <>
      <Header />
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

            <ProductInfoRow>
              <InfoLabel>수량</InfoLabel>
              <QuantityBox>
                <QtyBtn onClick={decreaseQuantity}>-</QtyBtn>
                <QtyValue>{quantity}</QtyValue>
                <QtyBtn onClick={increaseQuantity}>+</QtyBtn>
              </QuantityBox>
            </ProductInfoRow>

            <TotalPrice>
              <TotalLabel>총 금액</TotalLabel>
              <TotalValue>{(product?.price || 0) * quantity}원</TotalValue>
            </TotalPrice>

            <ProductDesc>
              {product?.description || "상품 설명이 없습니다."}
            </ProductDesc>

            <ButtonGroup>
              <BackBtn onClick={() => navigate("/product")}>목록으로</BackBtn>
              <CartBtn onClick={handleAddToCart}>장바구니</CartBtn>
              <BuyBtn onClick={handleBuyNow}>구매하기</BuyBtn>
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
  background: ${props => props.src ? 'none' : 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)'};
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

const QuantityBox = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const QtyBtn = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: white;
  font-size: 18px;
  cursor: pointer;
  &:hover { background: #f8f9fa; }
`;

const QtyValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  width: 40px;
  text-align: center;
`;

const TotalPrice = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  margin-top: 10px;
`;

const TotalLabel = styled.span`
  width: 100px;
  font-size: 16px;
  font-weight: 700;
  color: #495057;
`;

const TotalValue = styled.span`
  font-size: 24px;
  font-weight: 800;
  color: #5b73e8;
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

const CartBtn = styled.button`
  flex: 1;
  padding: 16px;
  background: #ffffff;
  border: 2px solid #5b73e8;
  border-radius: 10px;
  font-weight: 700;
  color: #5b73e8;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: #f8faff; }
`;

const BuyBtn = styled.button`
  flex: 2;
  padding: 16px;
  background: #5b73e8;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: #3b5af2; }
`;

export default ProductInfo;
