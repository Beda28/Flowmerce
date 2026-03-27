import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./pages/auth/Login.tsx";
import Index from "./pages/Index.tsx";
import Register from "./pages/auth/Register.tsx";
import Board from "./pages/Board/Board.tsx";
import BoardInfo from "./pages/Board/BoardInfo.tsx";
import BoardWrite from "./pages/Board/BoardWrite.tsx";
import BoardUpdate from "./pages/Board/BoardUpdate.tsx";
import BoardDelete from "./pages/Board/BoardDelete.tsx";
import Product from "./pages/Product/Product.tsx";
import ProductInfo from "./pages/Product/ProductInfo.tsx";
import Cart from "./pages/Cart/Cart.tsx";
import AdminBoard from "./pages/admin/Board/Board.tsx";
import AdminBoardInfo from "./pages/admin/Board/BoardInfo.tsx";
import AdminBoardUpdate from "./pages/admin/Board/BoardUpdate.tsx";
import AdminBoardDelete from "./pages/admin/Board/BoardDelete.tsx";
import AdminProduct from "./pages/admin/Product/Product.tsx";
import AdminProductInfo from "./pages/admin/Product/ProductInfo.tsx";
import AdminProductWrite from "./pages/admin/Product/ProductWrite.tsx";
import AdminProductDelete from "./pages/admin/Product/ProductDelete.tsx";
import AdminUser from "./pages/admin/User/User.tsx";
import AdminUserInfo from "./pages/admin/User/UserInfo.tsx";
import AdminUserUpdate from "./pages/admin/User/UserUpdate.tsx";
import AdminUserDelete from "./pages/admin/User/UserDelete.tsx";

createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product" element={<Product />} />
      <Route path="/product/:id" element={<ProductInfo />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/board" element={<Board />} />
      <Route path="/board/:id" element={<BoardInfo />} />
      <Route path="/board/write" element={<BoardWrite />} />
      <Route path="/board/update/:id" element={<BoardUpdate />} />
      <Route path="/board/delete/:id" element={<BoardDelete />} />
      <Route path="/admin/product" element={<AdminProduct />} />
      <Route path="/admin/product/:id" element={<AdminProductInfo />} />
      <Route path="/admin/product/write" element={<AdminProductWrite />} />
      <Route path="/admin/product/update/:id" element={<AdminProductWrite />} />
      <Route path="/admin/product/delete/:id" element={<AdminProductDelete />} />
      <Route path="/admin/board" element={<AdminBoard />} />
      <Route path="/admin/board/:id" element={<AdminBoardInfo />} />
      <Route path="/admin/board/update/:id" element={<AdminBoardUpdate />} />
      <Route path="/admin/board/delete/:id" element={<AdminBoardDelete />} />
      <Route path="/admin/user" element={<AdminUser />} />
      <Route path="/admin/user/:id" element={<AdminUserInfo />} />
      <Route path="/admin/user/update/:id" element={<AdminUserUpdate />} />
      <Route path="/admin/user/delete/:id" element={<AdminUserDelete />} />
    </Routes>
  </Router>
);
