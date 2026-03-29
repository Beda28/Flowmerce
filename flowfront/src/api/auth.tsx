import client from "./client";

export const loginSubmit = (id: string, pw: string) => {
  return client.post("/auth/login", {
    id: id,
    pw: pw,
  });
};

export const registerSubmit = (id: string, pw: string) => {
  return client.post("/auth/register", {
    id: id,
    pw: pw,
  });
};

export const logout = () => {
  return client.post("/auth/logout")
}

export const addBalance = (amount: number) => {
  return client.post("/auth/balance", { amount })
}
