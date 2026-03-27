from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, CHAR, VARCHAR, INT, DATETIME, JSON

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

class Product(Base):
    __tablename__ = "product"
    
    pid = Column(CHAR(36), nullable=False, primary_key=True)
    name = Column(VARCHAR(100), nullable=False)
    description = Column(VARCHAR(500), nullable=False)
    category = Column(JSON, nullable=False)
    image = Column(VARCHAR(255), nullable=True)
    price = Column(INT, nullable=False)
    date = Column(DATETIME, nullable=False)
    stock = Column(INT, nullable=False)

class Cart(Base):
    __tablename__ = "cart"
    
    cart_id = Column(INT, nullable=False, primary_key=True, autoincrement=True)
    uid = Column(CHAR(36), nullable=False)
    pid = Column(CHAR(36), nullable=False)
    quantity = Column(INT, nullable=False)
    date = Column(DATETIME, nullable=False)

class Order(Base):
    __tablename__ = "orders"
    
    order_id = Column(CHAR(36), nullable=False, primary_key=True)
    uid = Column(CHAR(36), nullable=False)
    pid = Column(CHAR(36), nullable=False)
    quantity = Column(INT, nullable=False)
    total_price = Column(INT, nullable=False)
    date = Column(DATETIME, nullable=False)
