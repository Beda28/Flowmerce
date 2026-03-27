import json
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from sqlalchemy import select, func, update, desc, asc, insert
from db import model

async def getProductList(db: AsyncSession, *, pid: str = None, page: int = 1, stype: str = None, keyword: str = None, sort: str = "newest", seller_uid: str = None):
    offset = (page - 1) * 12

    query = select(model.Product.pid, model.Product.seller_uid, model.Product.name, model.Product.description,
                   model.Product.category, model.Product.image, model.Product.price, 
                   model.Product.date, model.Product.stock)
    
    if sort == "price_high":
        query = query.order_by(desc(model.Product.price))
    elif sort == "price_low":
        query = query.order_by(asc(model.Product.price))
    else:
        query = query.order_by(desc(model.Product.date))
    
    if pid:
        query = query.where(model.Product.pid == pid)
        res = await db.execute(query)
        result = res.mappings().first()
        if result and result.get("category"):
            result = dict(result)
            result["category"] = json.loads(result["category"])
        return result
    
    if seller_uid:
        query = query.where(model.Product.seller_uid == seller_uid)
    
    if stype and keyword:
        keyword_pattern = f"%{keyword}%"
        if stype == "all":
            query = query.where(
                (model.Product.name.ilike(keyword_pattern)) |
                (model.Product.description.ilike(keyword_pattern))
            )
        elif stype == "name":
            query = query.where(model.Product.name.ilike(keyword_pattern))
        elif stype == "category":
            query = query.where(model.Product.name.ilike(keyword_pattern))

    count = select(func.count()).select_from(query.subquery())
    total_res = await db.execute(count)
    total_count = total_res.scalar() or 0
     
    query = query.offset(offset).limit(12)
    res = await db.execute(query)
    results = res.mappings().all()
    results = [
        {**dict(row), "category": json.loads(row["category"]) if row.get("category") else []}
        for row in results
    ]
    return results, total_count


async def ProductWrite(name: str, description: str, category: list, seller_uid: str, image: str = None, price: int = 0, stock: int = 0, db: AsyncSession = None, pid: str = None, is_update: bool = False):
    try:
        category_json = json.dumps(category, ensure_ascii=False)
        
        if is_update:
            result = await db.execute(select(model.Product).where(model.Product.pid == pid))
            product = result.scalars().first()
            if not product:
                raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다.")
            if product.seller_uid != seller_uid:
                raise HTTPException(status_code=403, detail="본인의 상품만 수정 가능합니다.")
            
            await db.execute(
                update(model.Product).where(model.Product.pid == pid).values(
                    name=name,
                    description=description,
                    category=category_json,
                    image=image,
                    price=price,
                    stock=stock
                )
            )
        else:
            await db.execute(
                insert(model.Product).values(
                    pid=pid,
                    seller_uid=seller_uid,
                    name=name,
                    description=description,
                    category=category_json,
                    image=image,
                    price=price,
                    date=func.now(),
                    stock=stock
                )
            )
        await db.commit()
        return {"pid": pid}
    
    except Exception as e:
        await db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail={"code": "SERVER_ERROR", "msg": "시스템 오류로 상품을 처리하지 못했습니다."})


async def ProductDelete(pid: str, uid: str, db: AsyncSession):
    try:
        result = await db.execute(select(model.Product).where(model.Product.pid == pid))
        product = result.scalars().first()
        if not product:
            raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다.")
        if product.seller_uid != uid:
            raise HTTPException(status_code=403, detail="본인의 상품만 삭제 가능합니다.")
        
        await db.delete(product)
        await db.commit()
        return {"message": "삭제 성공"}
    
    except Exception as e:
        await db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail={"code": "SERVER_ERROR", "msg": "시스템 오류로 상품을 삭제하지 못했습니다."})
