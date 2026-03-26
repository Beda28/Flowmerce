import re
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy import select
from db import model, redis
from uuid import uuid4
from utils import token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def CheckInput(id: str, pw: str):
    id_regex = re.compile(r"^[a-zA-Z0-9]{4,10}$")
    if not id or not pw:
        raise HTTPException(status_code=400, detail={"code": "EMPTY_FIELD", "msg": "아이디와 비밀번호를 입력해주세요."})
    if not id_regex.match(id):
        raise HTTPException(status_code=400, detail={"code": "INVALID_ID", "msg": "아이디는 4~10자 영문/숫자만 가능합니다."})
    if len(pw) < 8 or len(pw) > 20:
        raise HTTPException(status_code=400, detail={"code": "INVALID_PW", "msg": "비밀번호는 8~20자 사이여야 합니다."})

async def Login(id: str, pw: str, db: AsyncSession):
    if not id or not pw:
        raise HTTPException(status_code=400, detail={"code": "EMPTY_FIELD", "msg": "아이디와 비밀번호를 입력해주세요."})
    
    user = await db.execute(select(model.User).where(model.User.id == id))
    info = user.scalars().first()

    if not info or not pwd_context.verify(pw, info.pw):
        raise HTTPException(status_code=401, detail={"code": "LOGIN_FAILED", "msg": "아이디 또는 비밀번호가 틀렸습니다."})
    
    access, refresh = await token.create_tokens(id, str(info.uid))
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
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail={"code": "REGISTER_FAILED", "msg": "회원가입에 실패했습니다."})

async def logout(payload):
    user_uuid = payload.get("uuid")
    rd = await redis.get_redis_client()
    await rd.delete(f"refresh_{user_uuid}")
    return {"message": "로그아웃 성공"}
