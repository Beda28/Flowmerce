export interface Product {
  pid: string;
  seller_uid: string;
  name: string;
  description: string;
  category: string[];
  image: string | null;
  price: number;
  date: string;
  stock: number;
}

export interface CartItem {
  cart_id: number;
  pid: string;
  quantity: number;
  date: string;
  name: string;
  price: number;
  image: string | null;
}

export interface OrderItem {
  order_id: string;
  pid: string;
  quantity: number;
  total_price: number;
  date: string;
  name: string;
  price: number;
  image: string | null;
}
