import json
from datetime import datetime
from typing import Dict, List
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from db import engine
from repository import chat as chat_repo
from utils import token

router = APIRouter()
active_connections: Dict[str, List[WebSocket]] = {}

class ChatRoomCreate(BaseModel):
    pid: str

@router.post('/room')
async def create_chat_room(data: ChatRoomCreate, db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    return await chat_repo.createChatRoom(uid, data.pid, db)

@router.get('/rooms')
async def get_chat_rooms(db: AsyncSession = Depends(engine.get_db), payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    result = await chat_repo.getChatRooms(uid, db)
    return {"result": result}

@router.get('/room/{room_id}/messages')
async def get_messages(room_id: str, payload: dict = Depends(token.CheckLogin)):
    uid = payload.get("uuid")
    await chat_repo.markAsRead(room_id, uid)
    result = await chat_repo.getMessages(room_id, uid)
    return {"result": result}

@router.websocket('/ws/{room_id}')
async def websocket_chat(websocket: WebSocket, room_id: str):
    await websocket.accept()
    if room_id not in active_connections:
        active_connections[room_id] = []
    active_connections[room_id].append(websocket)
    try:
        while True:
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)
            if data.get("type") == "auth": continue
            uid, message = data.get("uid"), data.get("message")
            if not uid or not message: continue
            is_read = len(active_connections[room_id]) >= 2
            await chat_repo.saveMessage(room_id, uid, message, is_read)
            payload = {
                "type": "new_message",
                "sender_uid": uid,
                "message": message,
                "created_at": datetime.utcnow().isoformat(),
                "is_read": is_read
            }
            for conn in active_connections[room_id]:
                try:
                    await conn.send_text(json.dumps(payload))
                except:
                    continue
    except WebSocketDisconnect:
        if websocket in active_connections[room_id]:
            active_connections[room_id].remove(websocket)