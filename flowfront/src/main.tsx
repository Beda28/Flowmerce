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
import AdminBoard from "./pages/admin/Board/Board.tsx";
import AdminBoardInfo from "./pages/admin/Board/BoardInfo.tsx";
import AdminBoardUpdate from "./pages/admin/Board/BoardUpdate.tsx";
import AdminBoardDelete from "./pages/admin/Board/BoardDelete.tsx";

createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/board" element={<Board />} />
      <Route path="/board/:id" element={<BoardInfo />} />
      <Route path="/board/write" element={<BoardWrite />} />
      <Route path="/board/update/:id" element={<BoardUpdate />} />
      <Route path="/board/delete/:id" element={<BoardDelete />} />
      <Route path="/admin/board" element={<AdminBoard />} />
      <Route path="/admin/board/:id" element={<AdminBoardInfo />} />
      <Route path="/admin/board/update/:id" element={<AdminBoardUpdate />} />
      <Route path="/admin/board/delete/:id" element={<AdminBoardDelete />} />
    </Routes>
  </Router>
);
