import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface PageProps {
  pageLength: number;
  pageIndex: string | number | undefined;
  url: string;
}

const PageNation = ({ pageLength, pageIndex, url }: PageProps) => {
  const pIndex = Number(pageIndex) || 1;
  const [startNum, setStartNum] = useState(Math.max(1, pIndex - 4));
  const navigate = useNavigate()

  if (pageLength < 1) return null;
  const firstNum = Math.min(startNum, Math.max(1, pageLength - 8));
  const pages = [];

  for (let i = firstNum; i < firstNum + 9 && i <= pageLength; i++) {
    pages.push(i);
  }

  const ChangePage = (page: number) => {
    navigate(`${url}/${page}`)
  }

  return (
    <PageBox>
      <ArrowBtn 
        disabled={startNum === 1}
        onClick={() => setStartNum((prev) => Math.max(1, prev - 1))}
      >
        &lt;
      </ArrowBtn>
      
      <PageList>
        {pages.map((p) => (
          <PageNumber 
            key={p} 
            $active={p === pIndex} 
            onClick={() => ChangePage(p)}
          >
            {p}
          </PageNumber>
        ))}
      </PageList>

      <ArrowBtn 
        disabled={firstNum + 8 >= pageLength}
        onClick={() => setStartNum((prev) => Math.min(Math.max(1, pageLength - 8), prev + 1))}
      >
        &gt;
      </ArrowBtn>
    </PageBox>
  );
};

const PageBox = styled.div`
  width: 100%;
  margin: 60px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const PageList = styled.div`
  display: flex;
  gap: 8px;
`;

const PageNumber = styled.button<{ $active?: boolean }>`
  min-width: 40px;
  height: 40px;
  padding: 0 10px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  background-color: ${({ $active }) => ($active ? "#5b73e8" : "transparent")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#495057")};
  border: 1px solid ${({ $active }) => ($active ? "#5b73e8" : "#dee2e6")};
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: ${({ $active }) => ($active ? "#3b5af2" : "#f8f9fa")};
    border-color: #5b73e8;
    color: ${({ $active }) => ($active ? "#ffffff" : "#5b73e8")};
  }
`;

const ArrowBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  background-color: white;
  color: #adb5bd;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;

  &:hover:not(:disabled) {
    background-color: #f8f9fa;
    border-color: #adb5bd;
    color: #495057;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export default PageNation;
