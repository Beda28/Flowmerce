from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from db import engine
from dto import dto_board
from repository import board
from utils import token
from uuid import uuid4

router = APIRouter()

@router.get('/list/{page}')
async def post_list(page: int, db: AsyncSession = Depends(engine.get_db)):
    result, total_count = await board.getBoardList(db, page=page)
    return {"result" : result, "total_count" : total_count}

@router.post('/search')
async def post_search(data: dto_board.Post_Search, db: AsyncSession = Depends(engine.get_db)):
    result, total_count = await board.getBoardList(db, stype=data.type, keyword=data.keyword, page=data.page)
    return {"result" : result, "total_count" : total_count}

@router.get('/info/{bid}')
async def post_info(bid: str, db: AsyncSession = Depends(engine.get_db)):
    await board.AddViewCount(bid, db)
    result = await board.getBoardList(db, bid=bid)
    if not result:
        raise HTTPException(status_code=404, detail="존재하지 않는 게시글입니다.")
    return {"result" : result}

@router.post('/write')
async def post_write(data: dto_board.Post_Write, request: Request, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckLogin)):
    bid = str(uuid4())
    return await board.BoardWrite(data.title, data.content, request.state.user["uuid"], bid, db)

@router.patch('/update/{bid}')
async def post_update(bid: str, data: dto_board.Post_Write, request: Request, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckLogin)):
    return await board.BoardUpdate(bid, data.title, data.content, db, uid=request.state.user["uuid"])

@router.delete('/delete/{bid}')
async def post_delete(bid: str, request: Request, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckLogin)):
    return await board.BoardDelete(bid, db, uid=request.state.user['uuid'])
