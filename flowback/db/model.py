from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, CHAR, VARCHAR, INT, DATETIME

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    uid = Column(CHAR(36), nullable=False, primary_key=True)
    id = Column(VARCHAR(10), nullable=False, unique=True)
    pw = Column(VARCHAR(255), nullable=False)
