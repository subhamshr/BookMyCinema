import { APIs } from "../constants";
import { instance } from "../utils/axios";
import { getToken } from "../utils/storage";

// user and admin routes
const list = (limit, page) => {
  const isAdmin =
    JSON.parse(localStorage.getItem("currentUser"))?.roles?.includes("admin") ||
    false;
  return instance.get(
    `${APIs.ORDERS}?limit=${limit}&page=${page}&showAll=${isAdmin}`,
    {
      headers: {
        token: getToken("token"),
      },
    }
  );
};
const getById = (id) => {
  return instance.get(`${APIs.ORDERS}/${id}`, {
    headers: {
      token: getToken("token"),
    },
  });
};

// admin routes
const create = (payload) => {
  return instance.post(APIs.ORDERS, payload, {
    headers: {
      token: getToken("token"),
    },
  });
};
const update = (id, payload) => {
  return instance.put(`${APIs.ORDERS}/${id}`, payload, {
    headers: {
      token: getToken("token"),
    },
  });
};

const updateStatus = (id, payload) => {
  return instance.patch(`${APIs.ORDERS}/${id}/status`, payload, {
    headers: {
      token: getToken("token"),
    },
  });
};

const OrderServices = {
  create,
  list,
  getById,
  update,
  updateStatus,
};

export default OrderServices;
