import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminUserDeleteSubmit } from "../../../api/user";

const AdminUserDelete = () => {
  const { id: uid } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!uid) return;
    const ListSetting = async () => {
      const res = await adminUserDeleteSubmit(uid);
      alert(res.data.message);
      navigate("/admin/user");
    };
    ListSetting();
  }, [uid, navigate]);

  return <></>;
};

export default AdminUserDelete;
