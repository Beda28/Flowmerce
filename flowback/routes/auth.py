from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
from db import engine
from dto import dto_auth
from repository import auth
from utils import token

router = APIRouter()

class ProfileUpdate(BaseModel):
    id: Optional[str] = None
    pw: Optional[str] = None
    intro: Optional[str] = None

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

@router.get('/profile')
async def get_profile(db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    return await auth.getProfile(uid, db)

@router.patch('/profile')
async def update_profile(data: ProfileUpdate, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    return await auth.updateProfile(uid, db, data.id, data.pw, data.intro)

class BalanceUpdate(BaseModel):
    amount: int

@router.post('/balance')
async def add_balance(data: BalanceUpdate, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    return await auth.addBalance(uid, data.amount, db)
