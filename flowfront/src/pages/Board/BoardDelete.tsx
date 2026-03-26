import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { boardDeleteSubmit } from "../../api/board";

const BoardDelete = () => {
  const { id: bid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const ListSetting = async () => {
      const res = await boardDeleteSubmit(bid)
      alert(res.data.message);
      navigate("/board");
    };
    ListSetting();
  }, [bid, navigate]);

  return <></>;
};

export default BoardDelete;
