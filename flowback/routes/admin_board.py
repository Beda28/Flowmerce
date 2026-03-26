from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db import engine
from dto import dto_board
from repository import board
from utils import token

router = APIRouter()

@router.patch('/update/{bid}')
async def login(bid: str, data: dto_board.Post_Write, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    return await board.BoardUpdate(bid, data.title, data.content, db, admin=True)

@router.delete('/delete/{bid}')
async def login(bid: str, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    return await board.BoardDelete(bid, db, admin=True)
