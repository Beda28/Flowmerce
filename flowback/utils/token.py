from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timedelta
from fastapi import Header, Request, HTTPException, Depends
from db import redis
import os

KEY = os.getenv("JWT_KEY")
AL = "HS256"

async def create_tokens(id: str, uuid: str):
    access_exp = datetime.utcnow() + timedelta(minutes=30)
    access_payload = {"id": id, "uuid": str(uuid), "type": "access", "exp": access_exp}
    access_token = jwt.encode(access_payload, KEY, AL)

    refresh_exp = datetime.utcnow() + timedelta(days=7)
    refresh_payload = {"id": id, "uuid": str(uuid), "type": "refresh", "exp": refresh_exp}
    refresh_token = jwt.encode(refresh_payload, KEY, AL)

    rd = await redis.get_redis_client()
    await rd.set(f"refresh_{uuid}", refresh_token, ex=timedelta(days=7))

    return access_token, refresh_token

async def CheckLogin(request: Request, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail={"code": "UNAUTHORIZED", "msg": "로그인이 필요합니다."})
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail={"code": "INVALID_TOKEN", "msg": "유효하지 않은 인증 방식입니다."})
        
        payload = jwt.decode(token, KEY, algorithms=[AL])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail={"code": "INVALID_TOKEN", "msg": "잘못된 접근입니다."})
        
        request.state.user = payload
        return payload

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail={"code": "TOKEN_EXPIRED", "msg": "인증 세션이 만료되었습니다."})
    except JWTError:
        raise HTTPException(status_code=401, detail={"code": "INVALID_TOKEN", "msg": "변조되었거나 유효하지 않은 토콘입니다."})

async def CheckAdmin(user: dict = Depends(CheckLogin)):
    if user.get("id") != "admin":
        raise HTTPException(status_code=403, detail={"code": "FORBIDDEN", "msg": "관리자 권한이 없습니다."})
    return user

async def refresh(refresh_token: str):
    try:
        payload = jwt.decode(refresh_token, KEY, algorithms=[AL])
        user_id = payload.get("id")
        user_uuid = payload.get("uuid")
        
        rd = await redis.get_redis_client()
        stored_token = await rd.get(f"refresh_{user_uuid}")
        
        if not stored_token or stored_token != refresh_token:
            raise HTTPException(status_code=401, detail={"code": "REFRESH_INVALID", "msg": "세션이 유효하지 않습니다. 다시 로그인해주세요."})
        
        access_exp = datetime.utcnow() + timedelta(minutes=30)
        access_payload = {"id": user_id, "uuid": user_uuid, "type": "access", "exp": access_exp}
        new_access = jwt.encode(access_payload, KEY, AL)
        
        return {"access": new_access}
        
    except (JWTError, ExpiredSignatureError):
        raise HTTPException(status_code=401, detail={"code": "REFRESH_EXPIRED", "msg": "리프레시 세션이 만료되었습니다. 다시 로그인해주세요."})
