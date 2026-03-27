import styled from "styled-components";
import Header from "../../components/Header";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productWriteSubmit, productUpdateSubmit, getProductInfo } from "../../api/product";

const ProductWrite = () => {
  const { id: pid } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isEdit = !!pid;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setImage(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submit = async () => {
    const category = categoryInput.split(",").map(c => c.trim()).filter(c => c);
    const priceNum = parseInt(price);
    const stockNum = parseInt(stock);
    
    if (isEdit && pid) {
      await productUpdateSubmit(pid, name, description, category, image, priceNum, stockNum);
    } else {
      await productWriteSubmit(name, description, category, image, priceNum, stockNum);
    }
    alert(isEdit ? "수정 성공" : "등록 성공");
    navigate("/product");
  };

  useEffect(() => {
    if (!pid) return;
    const ListSetting = async () => {
      const res = await getProductInfo(pid);
      const product = res.data.result;
      setName(product.name);
      setDescription(product.description);
      setCategoryInput(Array.isArray(product.category) ? product.category.join(", ") : product.category);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      if (product.image) {
        setImage(product.image);
        setPreviewUrl(`/uploads/${product.image}`);
      }
    };
    ListSetting();
  }, [pid]);

  return (
    <>
      <Header />
      <WriteBody>
        <WriteCard>
          <FormTitle>{isEdit ? "상품 수정" : "상품 등록"}</FormTitle>
          <FormGroup>
            <InputLabel>상품명</InputLabel>
            <InputTag
              placeholder="상품명을 입력해주세요."
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </FormGroup>
          <FormGroup>
            <InputLabel>상품 설명</InputLabel>
            <InputArea
              placeholder="상품 설명을 입력해주세요."
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </FormGroup>
          <FormGroup>
            <InputLabel>카테고리</InputLabel>
            <InputTag
              placeholder="카테고리를 입력해주세요. (쉼표로 구분, 예: 전자기기, 컴퓨터, 노트북)"
              onChange={(e) => setCategoryInput(e.target.value)}
              value={categoryInput}
            />
          </FormGroup>
          <FormGroup>
            <InputLabel>상품 이미지</InputLabel>
            <ImageUploadBox>
              {previewUrl ? (
                <PreviewContainer>
                  <PreviewImage src={previewUrl} alt="Preview" />
                  <RemoveBtn onClick={removeImage}>×</RemoveBtn>
                </PreviewContainer>
              ) : (
                <UploadPlaceholder onClick={() => fileInputRef.current?.click()}>
                  <UploadIcon>+</UploadIcon>
                  <UploadText>이미지 업로드</UploadText>
                </UploadPlaceholder>
              )}
              <HiddenInput
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </ImageUploadBox>
          </FormGroup>
          <FormGroup>
            <InputLabel>가격</InputLabel>
            <InputTag
              type="number"
              placeholder="가격을 입력해주세요."
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </FormGroup>
          <FormGroup>
            <InputLabel>재고</InputLabel>
            <InputTag
              type="number"
              placeholder="재고를 입력해주세요."
              onChange={(e) => setStock(e.target.value)}
              value={stock}
            />
          </FormGroup>
          <ButtonGroup>
            <CancelBtn onClick={() => navigate(-1)}>취소</CancelBtn>
            <SubmitBtn onClick={submit}>{isEdit ? "수정 완료" : "등록 완료"}</SubmitBtn>
          </ButtonGroup>
        </WriteCard>
      </WriteBody>
    </>
  );
};

const WriteBody = styled.div`
  width: 100%;
  padding: 150px 0 100px;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

const WriteCard = styled.div`
  width: 600px;
  background: white;
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #212529;
  margin-bottom: 40px;
`;

const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 25px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #495057;
  margin-bottom: 10px;
`;

const InputTag = styled.input`
  width: 100%;
  padding: 15px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #dee2e6;
  background: #fcfcfc;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #5b73e8; background: white; }
`;

const InputArea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 15px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #dee2e6;
  background: #fcfcfc;
  box-sizing: border-box;
  resize: none;
  &:focus { outline: none; border-color: #5b73e8; background: white; }
`;

const ImageUploadBox = styled.div`
  width: 200px;
  height: 200px;
`;

const PreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UploadPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border: 2px dashed #dee2e6;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
  &:hover { border-color: #5b73e8; background: #f8f9ff; }
`;

const UploadIcon = styled.span`
  font-size: 40px;
  color: #adb5bd;
`;

const UploadText = styled.span`
  font-size: 14px;
  color: #adb5bd;
  margin-top: 10px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 40px;
`;

const CancelBtn = styled.button`
  padding: 14px 30px;
  background: #f1f3f5;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
`;

const SubmitBtn = styled.button`
  padding: 14px 40px;
  background: #5b73e8;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: #3b5af2; }
`;

export default ProductWrite;
