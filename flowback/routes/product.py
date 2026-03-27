from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from db import engine
from dto import dto_product
from repository import product
from utils import token
from uuid import uuid4

router = APIRouter()

@router.get('/list/{page}')
async def product_list(page: int, db: AsyncSession = Depends(engine.get_db)):
    result, total_count = await product.getProductList(db, page=page)
    return {"result": result, "total_count": total_count}

@router.post('/search')
async def product_search(data: dto_product.Post_Product_Search, db: AsyncSession = Depends(engine.get_db)):
    result, total_count = await product.getProductList(db, stype=data.type, keyword=data.keyword, page=data.page, sort=data.sort)
    return {"result": result, "total_count": total_count}

@router.get('/info/{pid}')
async def product_info(pid: str, db: AsyncSession = Depends(engine.get_db)):
    result = await product.getProductList(db, pid=pid)
    if not result:
        raise HTTPException(status_code=404, detail="존재하지 않는 상품입니다.")
    return {"result": result}
