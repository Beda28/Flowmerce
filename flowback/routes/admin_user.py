from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from db import engine, model
from dto import dto_admin_user
from utils import token

router = APIRouter()

@router.get('/list')
async def user_list(db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    result = await db.execute(select(model.User.uid, model.User.id))
    users = result.mappings().all()
    return {"result": users}

@router.get('/{uid}')
async def user_info(uid: str, db: AsyncSession = Depends(engine.get_db), _ = Depends(token.CheckAdmin)):
    result = await db.execute(select(model.User).where(model.User.uid == uid))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    return {"result": {"uid": user.uid, "id": user.id}}

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
