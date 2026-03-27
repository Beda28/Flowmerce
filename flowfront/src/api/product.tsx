import client from "./client";

export const getProductList = (pageNum: number) => {
  return client.get(`/product/list/${pageNum}`);
};

export const searchProductList = (keyword: string, type: string, pageNum: number, sort: string = "newest") => {
  return client.post("/product/search", {
    keyword: keyword,
    type: type,
    page: pageNum,
    sort: sort
  })
}

export const getProductInfo = (pid: string) => {
  return client.get(`/product/info/${pid}`);
};

export const adminProductWriteSubmit = (name: string, description: string, category: string[], image: string | null, price: number, stock: number) => {
  return client.post("/admin/product/write", {
    name: name,
    description: description,
    category: category,
    image: image,
    price: price,
    stock: stock,
  });
};

export const adminProductUpdateSubmit = (pid: string, name: string, description: string, category: string[], image: string | null, price: number, stock: number) => {
  return client.patch(`/admin/product/update/${pid}`, {
    name: name,
    description: description,
    category: category,
    image: image,
    price: price,
    stock: stock,
  });
};

export const adminProductDeleteSubmit = (pid: string) => {
  return client.delete(`/admin/product/delete/${pid}`);
};

export const getCartList = () => {
  return client.get("/cart/list");
};

export const addToCart = (pid: string, quantity: number) => {
  return client.post("/cart/add", {
    pid: pid,
    quantity: quantity
  });
};

export const updateCartQuantity = (cartId: number, quantity: number) => {
  return client.patch(`/cart/update/${cartId}?quantity=${quantity}`);
};

export const deleteCartItem = (cartId: number) => {
  return client.delete(`/cart/delete/${cartId}`);
};

export const clearCart = () => {
  return client.delete("/cart/clear");
};

export const orderFromCart = (items: { pid: string; quantity: number }[]) => {
  return client.post("/cart/order", {
    items: items
  });
};

export const getOrderList = () => {
  return client.get("/cart/order/list");
};
