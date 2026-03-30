from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from sqlalchemy import select, or_, insert
from db import model, mongo
from uuid import uuid4
from datetime import datetime

async def createChatRoom(buyer_uid: str, pid: str, db: AsyncSession):
    try:
        result = await db.execute(select(model.Product).where(model.Product.pid == pid))
        product = result.scalars().first()
        if not product:
            raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다.")
        if product.seller_uid == buyer_uid:
            raise HTTPException(status_code=400, detail="본인 상품에는 문의할 수 없습니다.")
        
        existing = await db.execute(
            select(model.ChatRoom).where(
                model.ChatRoom.pid == pid,
                model.ChatRoom.buyer_uid == buyer_uid
            )
        )
        if existing.scalars().first():
            raise HTTPException(status_code=400, detail="이미 문의방이 존재합니다.")
        
        room_id = str(uuid4())
        await db.execute(
            insert(model.ChatRoom).values(
                room_id=room_id,
                pid=pid,
                buyer_uid=buyer_uid,
                seller_uid=product.seller_uid,
                created_at=datetime.utcnow()
            )
        )
        await db.commit()
        return {"room_id": room_id}
    except Exception as e:
        await db.rollback()
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail="채팅방 생성에 실패했습니다.")

async def getChatRooms(uid: str, db: AsyncSession):
    query = (
        select(
            model.ChatRoom.room_id,
            model.ChatRoom.pid,
            model.ChatRoom.created_at,
            model.Product.name.label("product_name"), 
            model.Product.image, 
            model.Product.price,
            model.User.id.label("buyer_id")
        )
        .join(model.Product, model.ChatRoom.pid == model.Product.pid)
        .join(model.User, model.ChatRoom.buyer_uid == model.User.uid)
        .where(or_(model.ChatRoom.buyer_uid == uid, model.ChatRoom.seller_uid == uid))
        .order_by(model.ChatRoom.created_at.desc())
    )
    res = await db.execute(query)
    return [dict(room) for room in res.mappings().all()]

async def saveMessage(room_id: str, sender_uid: str, message: str, is_read: bool = False):
    db = mongo.get_mongo_db()
    await db.messages.insert_one({
        "room_id": room_id,
        "sender_uid": sender_uid,
        "message": message,
        "created_at": datetime.utcnow(),
        "is_read": is_read
    })

async def getMessages(room_id: str, uid: str):
    db = mongo.get_mongo_db()
    cursor = db.messages.find({"room_id": room_id}).sort("created_at", 1)
    messages = await cursor.to_list(length=300)
    for msg in messages:
        msg["_id"] = str(msg["_id"])
        msg["created_at"] = msg["created_at"].isoformat()
    return messages

async def markAsRead(room_id: str, reader_uid: str):
    db = mongo.get_mongo_db()
    await db.messages.update_many(
        {"room_id": room_id, "sender_uid": {"$ne": reader_uid}, "is_read": False},
        {"$set": {"is_read": True}}
    )