from fastapi import APIRouter, Depends, Request
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
