from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from db import engine
from repository import cart

router = APIRouter()

@router.get('/list')
async def admin_order_list(db: AsyncSession = Depends(engine.get_db)):
    result = await cart.getAllOrders(db)
    return {"result": result}
