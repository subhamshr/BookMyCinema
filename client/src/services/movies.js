import { APIs } from "../constants";
import { instance } from "../utils/axios";
import { getToken } from "../utils/storage";

// user and admin routes
const list = (limit, page, title) => {
  return instance.get(
    `${APIs.MOVIES}?limit=${limit}&page=${page}&title=${title}`
  );
};
const getBySlug = (slug) => {
  return instance.get(`${APIs.MOVIES}/${slug}`);
};

// admin routes
const create = (payload) => {
  return instance.post(APIs.MOVIES, payload, {
    headers: {
      token: getToken("token"),
      "Content-Type": "multipart/form-data",
    },
  });
};
const update = (slug, payload) => {
  return instance.put(`${APIs.MOVIES}/${slug}`, payload, {
    headers: {
      token: getToken("token"),
      "Content-Type": "multipart/form-data",
    },
  });
};
const updateReleaseDate = (slug, payload) => {
  return instance.patch(`${APIs.MOVIES}/${slug}/release-date`, payload, {
    headers: {
      token: getToken("token"),
    },
  });
};
const updateSeats = (slug, payload) => {
  return instance.patch(`${APIs.MOVIES}/${slug}/seats`, payload, {
    headers: {
      token: getToken("token"),
    },
  });
};
const remove = (slug) => {
  return instance.delete(`${APIs.MOVIES}/${slug}`, {
    headers: {
      token: getToken("token"),
    },
  });
};

const MovieServices = {
  create,
  list,
  getBySlug,
  update,
  updateReleaseDate,
  updateSeats,
  remove,
};

export default MovieServices;
