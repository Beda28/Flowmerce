import uvicorn
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, board, admin_board, admin_user, product, admin_product, cart, chat
from utils import token
from db import redis, mongo

@asynccontextmanager
async def lifespan(app: FastAPI):
    await redis.init_redis()
    await mongo.init_mongo()
    yield
    await redis.close_redis_connection()
    await mongo.close_mongo()

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

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router, prefix='/auth')
app.include_router(board.router, prefix='/board')
app.include_router(product.router, prefix='/product')
app.include_router(cart.router, prefix='/cart')
app.include_router(chat.router, prefix='/chat')
app.include_router(admin_board.router, prefix='/admin/board', dependencies=[Depends(token.CheckAdmin)])
app.include_router(admin_user.router, prefix='/admin/user', dependencies=[Depends(token.CheckAdmin)])
app.include_router(admin_product.router, prefix='/admin/product', dependencies=[Depends(token.CheckAdmin)])

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
