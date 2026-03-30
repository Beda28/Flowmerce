from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from db import engine
from repository import cart
from utils import token

router = APIRouter()

class CartItem(BaseModel):
    pid: str
    quantity: int

class CartItems(BaseModel):
    items: list[CartItem]

@router.get('/list')
async def cart_list(request: Request, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    result = await cart.getCartList(db, uid)
    return {"result": result}

@router.post('/add')
async def add_to_cart(data: CartItem, request: Request, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    return await cart.addToCart(uid, data.pid, data.quantity, db)

@router.patch('/update/{cart_id}')
async def update_cart(cart_id: int, quantity: int, request: Request, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    return await cart.updateCartQuantity(cart_id, quantity, uid, db)

@router.delete('/delete/{cart_id}')
async def delete_cart(cart_id: int, request: Request, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    return await cart.deleteCartItem(cart_id, uid, db)

@router.delete('/clear')
async def clear_cart(request: Request, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    return await cart.clearCart(uid, db)

@router.post('/order')
async def order_from_cart(data: CartItems, request: Request, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    items = [item.model_dump() for item in data.items]
    return await cart.createOrder(uid, items, db)

@router.get('/order/list')
async def order_list(request: Request, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    result = await cart.getOrderList(db, uid)
    return {"result": result}

@router.get('/order/sales')
async def get_sales_orders(request: Request, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    result = await cart.getSalesOrderList(db, uid)
    return {"result": result}

@router.get('/order/{order_id}')
async def order_detail(order_id: str, request: Request, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    result = await cart.getOrderDetail(db, order_id)
    if not result:
        raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다.")
    return {"result": result}

@router.post('/order/{order_id}/pay')
async def pay_order(order_id: str, request: Request, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    detail = await cart.getOrderDetail(db, order_id)
    if not detail or detail["uid"] != uid:
        raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다.")
    return await cart.updateOrderStatus(db, order_id, "paid", uid)

@router.post('/order/{order_id}/cancel')
async def cancel_order(order_id: str, request: Request, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    detail = await cart.getOrderDetail(db, order_id)
    if not detail:
        raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다.")
    if detail["uid"] != uid and detail["seller_uid"] != uid:
        raise HTTPException(status_code=403, detail="권한이 없습니다.")
    return await cart.updateOrderStatus(db, order_id, "cancelled", uid)

@router.patch('/order/{order_id}/status')
async def update_order_status(order_id: str, status: str, request: Request, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    detail = await cart.getOrderDetail(db, order_id)
    if not detail:
        raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다.")
    if detail["seller_uid"] != uid:
        raise HTTPException(status_code=403, detail="판매자만 상태를 변경할 수 있습니다.")
    if status not in ["shipping", "completed"]:
        raise HTTPException(status_code=400, detail="유효하지 않은 상태입니다.")
    return await cart.updateOrderStatus(db, order_id, status, uid)

from fastapi import HTTPException
