import styled from "styled-components";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../../types/product";
import { getCartList, updateCartQuantity, deleteCartItem, clearCart, orderFromCart } from "../../api/product";

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const res = await getCartList();
      setItems(res.data.result || []);
      setSelected([]);
    } catch {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const toggleSelect = (cartId: number) => {
    setSelected(prev =>
      prev.includes(cartId) ? prev.filter(id => id !== cartId) : [...prev, cartId]
    );
  };

  const toggleAll = () => {
    if (selected.length === items.length) {
      setSelected([]);
    } else {
      setSelected(items.map(item => item.cart_id));
    }
  };

  const changeQuantity = async (cartId: number, delta: number) => {
    const item = items.find(i => i.cart_id === cartId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    await updateCartQuantity(cartId, newQty);
    loadCart();
  };

  const removeItem = async (cartId: number) => {
    await deleteCartItem(cartId);
    loadCart();
  };

  const removeSelected = async () => {
    for (const cartId of selected) {
      await deleteCartItem(cartId);
    }
    loadCart();
  };

  const handleClear = async () => {
    if (!confirm("장바구니를 비우시겠습니까?")) return;
    await clearCart();
    loadCart();
  };

  const selectedItems = items.filter(item => selected.includes(item.cart_id));
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (selectedItems.length === 0) {
      alert("상품을 선택해주세요.");
      return;
    }
    try {
      const res = await orderFromCart(selectedItems.map(i => ({ pid: i.pid, quantity: i.quantity })));
      alert(`주문이 완료되었습니다.\n총 금액: ${res.data.total_price.toLocaleString()}원`);
      loadCart();
    } catch {
      alert("주문에 실패했습니다.");
    }
  };

  return (
    <>
      <Header />
      <CartBody>
        <CartBox>
          <Title>장바구니</Title>

          <ActionRow>
            <CheckAll onClick={toggleAll}>
              <Checkbox $checked={selected.length === items.length && items.length > 0} />
              전체선택
            </CheckAll>
            <ActionBtns>
              <ActionBtn onClick={removeSelected}>선택삭제</ActionBtn>
              <ActionBtn onClick={handleClear}>장바구니 비우기</ActionBtn>
            </ActionBtns>
          </ActionRow>

          <TableWrapper>
            <TableHeader>
              <HeaderItem width={5}>선택</HeaderItem>
              <HeaderItem width={45}>상품정보</HeaderItem>
              <HeaderItem width={15}>수량</HeaderItem>
              <HeaderItem width={15}>금액</HeaderItem>
              <HeaderItem width={10}>삭제</HeaderItem>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map(item => (
                  <TableRow key={item.cart_id}>
                    <Cell width={5}>
                      <Checkbox
                        $checked={selected.includes(item.cart_id)}
                        onClick={() => toggleSelect(item.cart_id)}
                      />
                    </Cell>
                    <Cell width={45}>
                      <ProductInfo>
                        <ProductImage src={item.image ? `/uploads/${item.image}` : undefined} />
                        <ProductName onClick={() => navigate(`/product/${item.pid}`)}>{item.name}</ProductName>
                      </ProductInfo>
                    </Cell>
                    <Cell width={15}>
                      <QuantityBox>
                        <QtyBtn onClick={() => changeQuantity(item.cart_id, -1)}>-</QtyBtn>
                        <QtyValue>{item.quantity}</QtyValue>
                        <QtyBtn onClick={() => changeQuantity(item.cart_id, 1)}>+</QtyBtn>
                      </QuantityBox>
                    </Cell>
                    <Cell width={15}>
                      <ItemPrice>{(item.price * item.quantity).toLocaleString()}원</ItemPrice>
                    </Cell>
                    <Cell width={10}>
                      <DeleteBtn onClick={() => removeItem(item.cart_id)}>삭제</DeleteBtn>
                    </Cell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <Cell width={100} style={{ gridColumn: "1 / -1" }}>
                    <EmptyState>장바구니가 비어있습니다.</EmptyState>
                  </Cell>
                </TableRow>
              )}
            </TableBody>
          </TableWrapper>

          <SummaryBox>
            <SummaryRow>
              <SummaryLabel>선택상품</SummaryLabel>
              <SummaryValue>{selectedItems.length}개</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>총 금액</SummaryLabel>
              <SummaryValue $highlight>{totalPrice.toLocaleString()}원</SummaryValue>
            </SummaryRow>
          </SummaryBox>

          <OrderBtn onClick={handleOrder}>주문하기</OrderBtn>
        </CartBox>
      </CartBody>
    </>
  );
};

const CartBody = styled.div`
  width: 100%;
  padding: 120px 0 60px;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

const CartBox = styled.div`
  width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: #212529;
  margin-bottom: 30px;
`;

const ActionRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CheckAll = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  cursor: pointer;
`;

const Checkbox = styled.div<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.$checked ? "#5b73e8" : "#dee2e6"};
  border-radius: 4px;
  background: ${props => props.$checked ? "#5b73e8" : "white"};
  position: relative;
  cursor: pointer;
  &::after {
    content: "${props => props.$checked ? "✓" : ""}";
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
  }
`;

const ActionBtns = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionBtn = styled.button`
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  cursor: pointer;
  &:hover { background: #f8f9fa; }
`;

const TableWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
`;

const TableHeader = styled.div`
  display: flex;
  background: #f1f3f5;
  padding: 15px 0;
`;

const HeaderItem = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: #495057;
`;

const TableBody = styled.div``;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f1f3f5;
`;

const Cell = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ProductImage = styled.img<{ src?: string }>`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  background: ${props => props.src ? "none" : "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)"};
`;

const ProductName = styled.span`
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  &:hover { color: #5b73e8; }
`;

const QuantityBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QtyBtn = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  &:hover { background: #f8f9fa; }
`;

const QtyValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  width: 30px;
  text-align: center;
`;

const ItemPrice = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #5b73e8;
`;

const DeleteBtn = styled.button`
  padding: 6px 14px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  color: #e03131;
  cursor: pointer;
  &:hover { background: #fff5f5; }
`;

const EmptyState = styled.div`
  padding: 60px 0;
  color: #adb5bd;
  font-size: 16px;
  width: 100%;
  text-align: center;
`;

const SummaryBox = styled.div`
  width: 100%;
  background: white;
  border-radius: 15px;
  padding: 25px 40px;
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
  gap: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const SummaryLabel = styled.span`
  font-size: 14px;
  color: #868e96;
`;

const SummaryValue = styled.span<{ $highlight?: boolean }>`
  font-size: ${props => props.$highlight ? "24px" : "16px"};
  font-weight: 800;
  color: ${props => props.$highlight ? "#5b73e8" : "#212529"};
`;

const OrderBtn = styled.button`
  width: 100%;
  padding: 18px;
  background: #5b73e8;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-top: 25px;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: #3b5af2; }
`;

export default Cart;
