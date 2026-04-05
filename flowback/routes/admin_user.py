from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel
from db import engine, model
from dto import dto_admin_user
from utils import token

router = APIRouter()

class BalanceUpdate(BaseModel):
    amount: int

@router.get('/list')
async def user_list(page: int = 1, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    offset = (page - 1) * 20
    result = await db.execute(select(model.User.uid, model.User.id, model.User.balance).limit(20).offset(offset))
    users = result.mappings().all()
    count_result = await db.execute(select(model.User))
    total = len(count_result.all())
    return {"result": users, "total_count": total}

@router.get('/{uid}')
async def user_info(uid: str, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    result = await db.execute(select(model.User).where(model.User.uid == uid))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    return {"result": {"uid": user.uid, "id": user.id, "balance": user.balance}}

@router.patch('/{uid}')
async def user_update(uid: str, data: dto_admin_user.Post_User_Update, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    result = await db.execute(select(model.User).where(model.User.uid == uid))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    
    check_id = await db.execute(select(model.User).where(model.User.id == data.id))
    existing = check_id.scalars().first()
    if existing and existing.uid != uid:
        raise HTTPException(status_code=400, detail="이미 사용 중인 아이디입니다.")
    
    await db.execute(update(model.User).where(model.User.uid == uid).values(id=data.id))
    await db.commit()
    return {"message": "수정 성공"}

@router.delete('/{uid}')
async def user_delete(uid: str, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    result = await db.execute(select(model.User).where(model.User.uid == uid))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    
    await db.delete(user)
    await db.commit()
    return {"message": "삭제 성공"}

@router.post('/{uid}/balance')
async def update_balance(uid: str, data: BalanceUpdate, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    result = await db.execute(select(model.User).where(model.User.uid == uid))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    
    new_balance = user.balance + data.amount
    if new_balance < 0:
        raise HTTPException(status_code=400, detail="잔고가 부족합니다.")
    
    await db.execute(update(model.User).where(model.User.uid == uid).values(balance=new_balance))
    await db.commit()
    return {"message": "잔고가 수정되었습니다.", "balance": new_balance}
