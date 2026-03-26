import client from "./client";

export const getBoardList = (pageNum: number) => {
  return client.get(`/board/list/${pageNum}`);
};

export const searchBoardList = (keyword: string, type: string, pageNum: number) => {
  return client.post("/board/search", {
    keyword: keyword,
    type: type,
    page: pageNum
  })
}

export const getBoardInfo = (bid: string | undefined) => {
  return client.get(`/board/info/${bid}`);
};

export const boardWriteSubmit = (title: string, content: string) => {
  return client.post("/board/write", {
    title: title,
    content: content,
  });
};

export const boardUpdateSubmit = (bid: string | undefined, title: string, content: string) => {
  return client.patch(`/board/update/${bid}`, {
      title: title,
      content: content,
  });
};

export const boardDeleteSubmit = (bid :string | undefined) => {
  return client.delete(`/board/delete/${bid}`);
};

export const adminBoardUpdateSubmit = (bid: string | undefined, title: string, content: string) => {
  return client.patch(`/admin/board/update/${bid}`, {
      title: title,
      content: content,
  });
};

export const adminBoardDeleteSubmit = (bid :string | undefined) => {
  return client.delete(`/admin/board/delete/${bid}`);
};
