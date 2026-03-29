import json
import re
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy import select, update
from db import model, redis
from uuid import uuid4
from utils import token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def CheckInput(id: str, pw: str = None):
    id_regex = re.compile(r"^[a-zA-Z0-9]{4,10}$")
    if not id:
        raise HTTPException(status_code=400, detail={"code": "EMPTY_FIELD", "msg": "아이디를 입력해주세요."})
    if not id_regex.match(id):
        raise HTTPException(status_code=400, detail={"code": "INVALID_ID", "msg": "아이디는 4~10자 영문/숫자만 가능합니다."})
    if pw and (len(pw) < 8 or len(pw) > 20):
        raise HTTPException(status_code=400, detail={"code": "INVALID_PW", "msg": "비밀번호는 8~20자 사이여야 합니다."})

async def Login(id: str, pw: str, db: AsyncSession):
    if not id or not pw:
        raise HTTPException(status_code=400, detail={"code": "EMPTY_FIELD", "msg": "아이디와 비밀번호를 입력해주세요."})
    
    user = await db.execute(select(model.User).where(model.User.id == id))
    info = user.scalars().first()

    if not info or not pwd_context.verify(pw, info.pw):
        raise HTTPException(status_code=401, detail={"code": "LOGIN_FAILED", "msg": "아이디 또는 비밀번호가 틀렸습니다."})
    
    access, refresh = await token.create_tokens(id, str(info.uid), info.role)
    return {"access": access, "refresh": refresh}

async def Register(id: str, pw: str, db: AsyncSession):
    CheckInput(id, pw)
    
    try:
        password  = pwd_context.hash(pw)
        user_uuid = uuid4()

        adduser = model.User(uid=str(user_uuid), id=id, pw=password)
        db.add(adduser)
            
        await db.commit()
        access, refresh = await token.create_tokens(id, str(user_uuid))
        return {"access": access, "refresh": refresh}
    
    except Exception as e:
        await db.rollback()
        print(f"Register error: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail={"code": "REGISTER_FAILED", "msg": "회원가입에 실패했습니다."})

async def logout(payload):
    user_uuid = payload.get("uuid")
    rd = await redis.get_redis_client()
    await rd.delete(f"refresh_{user_uuid}")
    return {"message": "로그아웃 성공"}

async def getProfile(uid: str, db: AsyncSession):
    result = await db.execute(select(model.User.uid, model.User.id, model.User.intro, model.User.balance).where(model.User.uid == uid))
    user = result.mappings().first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    return dict(user)

async def updateProfile(uid: str, db: AsyncSession, new_id: str = None, new_pw: str = None, intro: str = None):
    try:
        result = await db.execute(select(model.User).where(model.User.uid == uid))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
        
        update_data = {}
        
        if new_id and new_id != user.id:
            CheckInput(new_id)
            existing = await db.execute(select(model.User).where(model.User.id == new_id))
            if existing.scalars().first():
                raise HTTPException(status_code=400, detail={"code": "DUPLICATE_ID", "msg": "이미 사용중인 아이디입니다."})
            update_data["id"] = new_id
        
        if new_pw:
            CheckInput(user.id, new_pw)
            update_data["pw"] = pwd_context.hash(new_pw)
        
        if intro is not None:
            update_data["intro"] = intro if intro else None
        
        if update_data:
            await db.execute(update(model.User).where(model.User.uid == uid).values(**update_data))
            await db.commit()
        
        return {"message": "프로필 수정 완료"}
    
    except Exception as e:
        await db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail={"code": "SERVER_ERROR", "msg": "프로필 수정에 실패했습니다."})

async def addBalance(uid: str, amount: int, db: AsyncSession):
    if amount <= 0:
        raise HTTPException(status_code=400, detail={"code": "INVALID_AMOUNT", "msg": "1원 이상 입력해주세요."})
    
    try:
        result = await db.execute(select(model.User).where(model.User.uid == uid))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
        
        new_balance = user.balance + amount
        await db.execute(update(model.User).where(model.User.uid == uid).values(balance=new_balance))
        await db.commit()
        
        return {"message": "잔고 충전 완료", "balance": new_balance}
    
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail={"code": "SERVER_ERROR", "msg": "잔고充值에 실패했습니다."})
