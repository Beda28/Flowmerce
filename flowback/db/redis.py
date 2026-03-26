import redis.asyncio as redis
from typing import Optional
import os

REDIS_PASSWORD = os.getenv("REDIS_ROOT_PASSWORD")

REDIS_URL = f"redis://default:{REDIS_PASSWORD}@flow-redis:6379"

_redis_client: Optional[redis.Redis] = None

async def init_redis():
    global _redis_client
    if _redis_client is None:
        try:
            _redis_client = redis.from_url(REDIS_URL, decode_responses=True)

            await _redis_client.ping() 
            print("Redis 클라이언트 초기화됨.")
        except Exception as e:
            print(f"Redis 연결 초기화 실패: {e}")
            _redis_client = None
            raise

async def get_redis_client() -> redis.Redis:
    if _redis_client is None:
        await init_redis()
    return _redis_client

async def close_redis_connection():
    global _redis_client
    if _redis_client:
        await _redis_client.close()
        _redis_client = None
        print("Redis 클라이언트 종료됨.")
