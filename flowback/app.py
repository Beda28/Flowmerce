import uvicorn
from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, board, admin_board, admin_user
from utils import token
from db import redis

@asynccontextmanager
async def lifespan(app: FastAPI):
    await redis.init_redis()
    yield
    await redis.close_redis_connection()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth.router, prefix='/auth')
app.include_router(board.router, prefix='/board')
app.include_router(admin_board.router, prefix='/admin/board', dependencies=[Depends(token.CheckAdmin)])
app.include_router(admin_user.router, prefix='/admin/user', dependencies=[Depends(token.CheckAdmin)])

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
