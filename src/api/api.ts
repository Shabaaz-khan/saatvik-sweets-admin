import { api } from "../lib/api";

// Auth

export const login = async (payload: any) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};
export const register = async (payload: any) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};
// Categories

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const createCategory = async (payload: any) => {
  const { data } = await api.post("/categories", payload);
  return data;
};

export const updateCategory = async (id: string, payload: any) => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};
// =======================
// Types
// =======================

export const getTypes = async () => {
  const { data } = await api.get("/types");
  return data;
};

export const createType = async (payload: any) => {
  const { data } = await api.post("/types", payload);
  return data;
};

export const updateType = async (
  id: string,
  payload: any
) => {
  const { data } = await api.put(`/types/${id}`, payload);
  return data;
};

export const deleteType = async (id: string) => {
  const { data } = await api.delete(`/types/${id}`);
  return data;
};
// Products

// =======================
// Products
// =======================

export const getProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const createProduct = async (payload: any) => {
  const { data } = await api.post("/products", payload);
  return data;
};

export const updateProduct = async (
  id: string,
  payload: any
) => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
};

export const deleteProduct = async (id: string) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// Orders

// =======================
// Orders
// =======================

export const getOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

export const updateOrder = async (
  id: string,
  payload: any
) => {
  const { data } = await api.put(`/orders/${id}`, payload);
  return data;
};

// =======================
// coupons
// =======================

export const getCoupons = async () => {
  const { data } = await api.get("/coupons");
  return data;
};

export const createCoupon = async (payload: any) => {
  const { data } = await api.post("/coupons", payload);
  return data;
};

export const updateCoupon = async (id: string, payload: any) => {
  const { data } = await api.put(`/coupons/${id}`, payload);
  return data;
};

export const deleteCoupon = async (id: string) => {
  const { data } = await api.delete(`/coupons/${id}`);
  return data;
};
// =======================
// CorporateInquiries
// =======================
export const getCorporateInquiries = async () => {
  const { data } = await api.get("/corporate");

  return data;
};

export const updateCorporateInquiry = async (
  id: string,
  payload: any
) => {
  const { data } = await api.put(
    `/corporate/${id}`,
    payload
  );

  return data;
};

// =======================
// Settings
// =======================
export const getSettings = async () => {
  const { data } = await api.get("/settings");
  return data;
};

export const updateSettings = async (payload: any) => {
  const { data } = await api.put("/settings", payload);
  return data;
};

// =======================
// Corporate CMS
// =======================

export const getCorporatePage = async () => {
  const { data } = await api.get("/corporate-page");
  return data;
};

export const updateCorporatePage = async (payload: any) => {
  const { data } = await api.put(
    "/corporate-page",
    payload
  );

  return data;
};
export async function getMenuPage() {
  const { data } = await api.get("/menu-page");
  return data;
}

export async function updateMenuPage(payload: any) {
  const { data } = await api.put("/menu-page", payload);
  return data;
}
// ABOUT PAGE

export async function getAboutPage() {
  const { data } = await api.get("/about-page");
  return data;
}

export async function updateAboutPage(payload: any) {
  const { data } = await api.put("/about-page", payload);
  return data;
}
export async function getHomePage() {
  const { data } = await api.get("/home-page");
  return data;
}

export async function updateHomePage(payload: any) {
  const { data } = await api.put("/home-page", payload);
  return data;
}
export async function getLegalPage() {
  const { data } = await api.get("/legal");
  return data;
}

export async function updateLegalPage(payload: any) {
  const { data } = await api.put("/legal", payload);
  return data;
}
export async function getContactPage() {
  const { data } = await api.get("/contact-page");
  return data;
}

export async function updateContactPage(payload: any) {
  const { data } = await api.put("/contact-page", payload);
  return data;
}