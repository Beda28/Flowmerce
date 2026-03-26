import client from "./client";

export const getUserList = () => {
  return client.get("/admin/user/list");
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
