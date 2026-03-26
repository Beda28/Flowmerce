from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, CHAR, VARCHAR, INT, DATETIME

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    uid = Column(CHAR(36), nullable=False, primary_key=True)
    id = Column(VARCHAR(10), nullable=False, unique=True)
    pw = Column(VARCHAR(255), nullable=False)

class Board(Base):
    __tablename__ = "board"
    
    bid = Column(CHAR(36), nullable=False, primary_key=True)
    title = Column(VARCHAR(50), nullable=False)
    content = Column(VARCHAR(1000), nullable=False)
    writer = Column(CHAR(36), nullable=False)
    date = Column(DATETIME, nullable=False)
    viewcount = Column(INT, nullable=False)
