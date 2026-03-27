from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db import engine
from dto import dto_product
from repository import product
from utils import token
from uuid import uuid4

router = APIRouter()

@router.post('/write')
async def product_write(data: dto_product.Post_Product_Write, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    pid = str(uuid4())
    return await product.ProductWrite(data.name, data.description, data.category, data.image, data.price, data.stock, db, pid)

@router.patch('/update/{pid}')
async def product_update(pid: str, data: dto_product.Post_Product_Update, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    return await product.ProductWrite(data.name, data.description, data.category, data.image, data.price, data.stock, db, pid, True)

@router.delete('/delete/{pid}')
async def product_delete(pid: str, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    return await product.ProductDelete(pid, db)
