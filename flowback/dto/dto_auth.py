from pydantic import BaseModel

class Post_User(BaseModel):
    id: str
    pw: str
    
class Post_Refresh(BaseModel):
    refresh_token: str
