import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminBoardDeleteSubmit } from "../../../api/board";

const AdminBoardDelete = () => {
  const { id: bid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const ListSetting = async () => {
      const res = await adminBoardDeleteSubmit(bid)
      alert(res.data.message);
      navigate("/admin/board");
    };
    ListSetting();
  }, [bid, navigate]);

  return <></>;
};

export default AdminBoardDelete;
