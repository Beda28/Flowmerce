from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from sqlalchemy import select, func, delete, update, insert, desc
from db import model

async def getCartList(db: AsyncSession, uid: str):
    query = (select(model.Cart.cart_id, model.Cart.pid, model.Cart.quantity, model.Cart.date,
                    model.Product.name, model.Product.price, model.Product.image)
             .join(model.Product, model.Cart.pid == model.Product.pid)
             .where(model.Cart.uid == uid))
    res = await db.execute(query)
    return res.mappings().all()

async def addToCart(uid: str, pid: str, quantity: int, db: AsyncSession):
    try:
        result = await db.execute(select(model.Cart).where(model.Cart.uid == uid, model.Cart.pid == pid))
        existing = result.scalars().first()
        
        if existing:
            await db.execute(
                update(model.Cart).where(model.Cart.uid == uid, model.Cart.pid == pid).values(
                    quantity=model.Cart.quantity + quantity
                )
            )
        else:
            await db.execute(
                insert(model.Cart).values(
                    uid=uid,
                    pid=pid,
                    quantity=quantity,
                    date=func.now()
                )
            )
        await db.commit()
        return {"message": "장바구니에 추가되었습니다."}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail={"code": "SERVER_ERROR", "msg": "시스템 오류로 장바구니에 추가하지 못했습니다."})

async def updateCartQuantity(cart_id: int, quantity: int, uid: str, db: AsyncSession):
    try:
        result = await db.execute(select(model.Cart).where(model.Cart.cart_id == cart_id, model.Cart.uid == uid))
        cart = result.scalars().first()
        if not cart:
            raise HTTPException(status_code=404, detail="장바구니 항목을 찾을 수 없습니다.")
        
        if quantity <= 0:
            await db.delete(cart)
        else:
            await db.execute(
                update(model.Cart).where(model.Cart.cart_id == cart_id).values(quantity=quantity)
            )
        await db.commit()
        return {"message": "수정이 완료되었습니다."}
    except Exception as e:
        await db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail={"code": "SERVER_ERROR", "msg": "시스템 오류로 수정하지 못했습니다."})

async def deleteCartItem(cart_id: int, uid: str, db: AsyncSession):
    try:
        result = await db.execute(select(model.Cart).where(model.Cart.cart_id == cart_id, model.Cart.uid == uid))
        cart = result.scalars().first()
        if not cart:
            raise HTTPException(status_code=404, detail="장바구니 항목을 찾을 수 없습니다.")
        
        await db.delete(cart)
        await db.commit()
        return {"message": "삭제 성공"}
    except Exception as e:
        await db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail={"code": "SERVER_ERROR", "msg": "시스템 오류로 삭제하지 못했습니다."})

async def clearCart(uid: str, db: AsyncSession):
    try:
        await db.execute(delete(model.Cart).where(model.Cart.uid == uid))
        await db.commit()
        return {"message": "장바구니가 비워졌습니다."}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail={"code": "SERVER_ERROR", "msg": "시스템 오류로 장바구니를 비우지 못했습니다."})

async def createOrder(uid: str, cart_items, db: AsyncSession):
    try:
        from uuid import uuid4
        order_id = str(uuid4())
        total_price = 0
        
        user_result = await db.execute(select(model.User.balance).where(model.User.uid == uid))
        user_balance = user_result.scalars().first()
        
        for item in cart_items:
            result = await db.execute(select(model.Product).where(model.Product.pid == item["pid"]))
            product = result.scalars().first()
            if not product:
                raise HTTPException(status_code=404, detail=f"상품 {item['pid']}을 찾을 수 없습니다.")
            if product.stock < item["quantity"]:
                raise HTTPException(status_code=400, detail=f"상품 {product.name}의 재고가 부족합니다.")
            
            item_total = product.price * item["quantity"]
            total_price += item_total
        
        if user_balance < total_price:
            raise HTTPException(status_code=400, detail={"code": "INSUFFICIENT_BALANCE", "msg": "잔고가 부족합니다."})
        
        for item in cart_items:
            result = await db.execute(select(model.Product).where(model.Product.pid == item["pid"]))
            product = result.scalars().first()
            
            await db.execute(
                update(model.Product).where(model.Product.pid == item["pid"]).values(
                    stock=product.stock - item["quantity"]
                )
            )
            
            item_total = product.price * item["quantity"]
            
            await db.execute(
                insert(model.Order).values(
                    order_id=order_id,
                    uid=uid,
                    pid=item["pid"],
                    quantity=item["quantity"],
                    total_price=item_total,
                    date=func.now(),
                    status="paid",
                    status_updated_at=func.now(),
                    status_updated_by=uid
                )
            )
        
        new_balance = user_balance - total_price
        await db.execute(update(model.User).where(model.User.uid == uid).values(balance=new_balance))
        await db.execute(delete(model.Cart).where(model.Cart.uid == uid))
        await db.commit()
        return {"order_id": order_id, "total_price": total_price}
    except Exception as e:
        await db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail={"code": "SERVER_ERROR", "msg": "시스템 오류로 주문하지 못했습니다."})

async def getOrderList(db: AsyncSession, uid: str):
    query = (select(model.Order.order_id, model.Order.pid, model.Order.quantity, 
                    model.Order.total_price, model.Order.date, model.Order.status,
                    model.Product.name, model.Product.price, model.Product.image,
                    model.Product.seller_uid)
             .join(model.Product, model.Order.pid == model.Product.pid)
             .where(model.Order.uid == uid)
             .order_by(desc(model.Order.date)))
    res = await db.execute(query)
    return res.mappings().all()

async def getOrderDetail(db: AsyncSession, order_id: str):
    query = (select(model.Order, model.Product.name, model.Product.image, model.Product.seller_uid)
             .join(model.Product, model.Order.pid == model.Product.pid)
             .where(model.Order.order_id == order_id))
    res = await db.execute(query)
    return res.mappings().first()

async def updateOrderStatus(db: AsyncSession, order_id: str, new_status: str, user_id: str):
    try:
        result = await db.execute(select(model.Order).where(model.Order.order_id == order_id))
        order = result.scalars().first()
        if not order:
            raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다.")
        
        old_status = order.status
        
        if new_status == "cancelled" and old_status not in ["cancelled", "completed"]:
            product_result = await db.execute(select(model.Product).where(model.Product.pid == order.pid))
            product = product_result.scalars().first()
            if product:
                await db.execute(
                    update(model.Product).where(model.Product.pid == order.pid).values(
                        stock=product.stock + order.quantity
                    )
                )
            
            user_result = await db.execute(select(model.User).where(model.User.uid == order.uid))
            user = user_result.scalars().first()
            if user:
                new_balance = user.balance + order.total_price
                await db.execute(
                    update(model.User).where(model.User.uid == order.uid).values(balance=new_balance)
                )
        
        order.status = new_status
        order.status_updated_at = func.now()
        order.status_updated_by = user_id
        await db.commit()
        return {"message": "주문 상태가 업데이트되었습니다.", "status": new_status}
    except Exception as e:
        await db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail={"code": "SERVER_ERROR", "msg": "시스템 오류로 상태를 변경하지 못했습니다."})

async def getAllOrders(db: AsyncSession):
    query = (select(model.Order, model.Product.name, model.Product.image, model.User.id)
             .join(model.Product, model.Order.pid == model.Product.pid)
             .join(model.User, model.Order.uid == model.User.uid)
             .order_by(desc(model.Order.date)))
    res = await db.execute(query)
    return res.mappings().all()

from sqlalchemy import update, insert, delete, desc
