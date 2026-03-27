from pydantic import BaseModel
from typing import List, Optional

class Post_Product_Write(BaseModel):
    name: str
    description: str
    category: List[str]
    image: Optional[str] = None
    price: int
    stock: int

class Post_Product_Update(BaseModel):
    name: str
    description: str
    category: List[str]
    image: Optional[str] = None
    price: int
    stock: int

class Post_Product_Search(BaseModel):
    keyword: str
    type: str
    page: int
    sort: Optional[str] = "newest"
