from pydantic import BaseModel

class Post_Search(BaseModel):
    keyword: str
    type: str
    page: int

class Post_Write(BaseModel):
    title: str
    content: str
