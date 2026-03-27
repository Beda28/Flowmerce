import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminProductDeleteSubmit } from "../../../api/product";

const ProductDelete = () => {
  const { id: pid } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!pid) return;
    const ListSetting = async () => {
      const res = await adminProductDeleteSubmit(pid);
      alert(res.data.message);
      navigate("/admin/product");
    };
    ListSetting();
  }, [pid, navigate]);

  return <></>;
};

export default ProductDelete;
