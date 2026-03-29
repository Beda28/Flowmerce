import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageProps {
  pageLength: number;
  pageIndex: string | number | undefined;
  url: string;
}

const PageNation = ({ pageLength, pageIndex, url }: PageProps) => {
  const pIndex = Number(pageIndex) || 1;
  const [startNum, setStartNum] = useState(Math.max(1, pIndex - 4));
  const navigate = useNavigate();

  if (pageLength < 1) return null;
  const firstNum = Math.min(startNum, Math.max(1, pageLength - 8));
  const pages = [];

  for (let i = firstNum; i < firstNum + 9 && i <= pageLength; i++) {
    pages.push(i);
  }

  const ChangePage = (page: number) => {
    navigate(`${url}/${page}`);
  };

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        disabled={startNum === 1}
        onClick={() => setStartNum((prev) => Math.max(1, prev - 1))}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => ChangePage(p)}
            className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all ${
              p === pIndex
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25"
                : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground hover:border-primary/50"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        disabled={firstNum + 8 >= pageLength}
        onClick={() => setStartNum((prev) => Math.min(Math.max(1, pageLength - 8), prev + 1))}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PageNation;
