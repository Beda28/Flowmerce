from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db import engine
from dto import dto_auth
from repository import auth
from utils import token

router = APIRouter()

@router.post('/login')
async def login(data: dto_auth.Post_User, db: AsyncSession = Depends(engine.get_db)):
    return await auth.Login(data.id, data.pw, db)

@router.post('/register')
async def register(data: dto_auth.Post_User, db: AsyncSession = Depends(engine.get_db)):
    return await auth.Register(data.id, data.pw, db)

@router.post('/refresh')
async def refresh(refresh: dto_auth.Post_Refresh):
    return await token.refresh(refresh.refresh_token)

@router.post('/logout')
async def logout(payload: dict = Depends(token.CheckLogin)):
    return await auth.logout(payload)
