from motor.motor_asyncio import AsyncIOMotorClient
import os

client = None
db = None

async def init_mongo():
    global client, db
    mongo_user = os.getenv("MONGO_USER")
    mongo_pass = os.getenv("MONGO_PASSWORD")
    client = AsyncIOMotorClient(f"mongodb://{mongo_user}:{mongo_pass}@flow-mongo:27017/")
    db = client.flowmerce
    print("MongoDB 클라이언트 초기화됨.")

async def close_mongo():
    global client
    if client:
        client.close()

def get_mongo_db():
    return db
