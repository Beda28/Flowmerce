from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from sqlalchemy import select, func, update, desc
from db import model
from utils import search

async def checkWriter(bid: str, uid: str, db: AsyncSession):
    writer_result = await db.execute(select(model.Board.writer).where(model.Board.bid == bid))
    writer = writer_result.scalar()
    if not writer:
        raise HTTPException(status_code=404, detail="게시글이 존재하지 않습니다.")
    if writer != uid:
        raise HTTPException(status_code=403, detail="본인의 글만 삭제할 수 있습니다.")
    
async def AddViewCount(bid: str, db: AsyncSession):
    await db.execute(update(model.Board)
                     .where(model.Board.bid == bid)
                     .values(viewcount=model.Board.viewcount + 1))
    await db.commit()
    return

async def getBoardList(db: AsyncSession, *, bid: str = None, page: int = 1, stype: str = None, keyword: str = None, uuid: str = None):
    offset = (page - 1) * 10

    query = (select(model.Board.bid,     model.Board.title, 
                    model.Board.content, model.User.id,
                    model.Board.date,    model.Board.viewcount)
                    .join(model.User, model.Board.writer == model.User.uid)
                    .order_by(desc(model.Board.date)))
    
    if bid:
        query = query.where(model.Board.bid == bid)
        res   = await db.execute(query)
        return res.mappings().first()
    
    if uuid: query = query.where(model.Board.writer == uuid)
    if stype and keyword:
        query = search.search(query, model, stype, keyword)

    count       = select(func.count()).select_from(query.subquery())
    total_res   = await db.execute(count)
    total_count = total_res.scalar() or 0
     
    query = query.offset(offset).limit(10)
    res   = await db.execute(query)
    return res.mappings().all(), total_count


async def BoardWrite(title: str, content: str, uuid: str, bid: str, db: AsyncSession):
    try:
        insert_data = model.Board(bid=str(bid), 
                                title=title, 
                                content=content, 
                                writer=uuid, 
                                date=func.now(),
                                viewcount=0)
        db.add(insert_data)
        await db.commit()
        return {"bid" : bid}
    
    except Exception as e:
        await db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail={"code": "SERVER_ERROR", "msg": "시스템 오류로 게시글을 작성하지 못했습니다."})


async def BoardUpdate(bid: str, title: str, content: str, db: AsyncSession, *, uid: str = None, admin: bool = False):
    try:
        if not admin: await checkWriter(bid, uid, db)
        await db.execute(update(model.Board)
                         .where(model.Board.bid == bid)
                         .values(title=title, content=content))
        
        await db.commit()
        return {"bid" : bid}
    
    except Exception as e:
        await db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail={"code": "SERVER_ERROR", "msg": "시스템 오류로 게시글을 수정하지 못했습니다."})
    
    
async def BoardDelete(bid: str, db: AsyncSession, *, uid: str = None, admin: bool = False):
    try:
        if not admin: await checkWriter(bid, uid, db)
        res  = await db.execute(select(model.Board).where(model.Board.bid == bid))
        post = res.scalars().first()

        await db.delete(post)
        await db.commit()
        return {"message" : "삭제 성공"}
    
    except Exception as e:
        await db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail={"code": "SERVER_ERROR", "msg": "시스템 오류로 게시글을 삭제하지 못했습니다."})
