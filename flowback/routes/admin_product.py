from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db import engine
from dto import dto_product
from repository import product
from utils import token
from uuid import uuid4

router = APIRouter()

@router.get('/list')
async def product_list(db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    result, total_count = await product.getProductList(db, page=1, sort="newest")
    return {"result": result, "total_count": total_count}

@router.post('/write')
async def product_write(data: dto_product.Post_Product_Write, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    pid = str(uuid4())
    return await product.ProductWrite(data.name, data.description, data.category, "admin", data.image, data.price, data.stock, db, pid)

@router.patch('/update/{pid}')
async def product_update(pid: str, data: dto_product.Post_Product_Update, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    return await product.ProductWrite(data.name, data.description, data.category, "admin", data.image, data.price, data.stock, db, pid, True)

@router.delete('/delete/{pid}')
async def product_delete(pid: str, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    return await product.ProductDelete(pid, "admin", db)
