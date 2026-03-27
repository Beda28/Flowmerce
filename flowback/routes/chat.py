from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from db import engine, mongo
from repository import chat as chat_repo
from utils import token
from uuid import uuid4
from datetime import datetime
import json

router = APIRouter()

class ChatRoomCreate(BaseModel):
    pid: str

class ChatMessage(BaseModel):
    message: str

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
    result = await chat_repo.getMessages(room_id, uid)
    return {"result": result}

@router.websocket('/ws/{room_id}')
async def websocket_chat(websocket: WebSocket, room_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            msg_data = json.loads(data)
            await chat_repo.saveMessage(room_id, msg_data.get("uid"), msg_data.get("message"))
            await websocket.send_text(json.dumps({"type": "success"}))
    except WebSocketDisconnect:
        pass
