import client from "./client";

export const getUserList = (page: number = 1) => {
  return client.get(`/admin/user/list?page=${page}`);
};

export const getUserInfo = (uid: string) => {
  return client.get(`/admin/user/${uid}`);
};

export const adminUserUpdateSubmit = (uid: string, id: string) => {
  return client.patch(`/admin/user/${uid}`, {
    id: id,
  });
};

export const adminUserDeleteSubmit = (uid: string) => {
  return client.delete(`/admin/user/${uid}`);
};

export const adminUpdateBalance = (uid: string, amount: number) => {
  return client.post(`/admin/user/${uid}/balance`, { amount });
};
