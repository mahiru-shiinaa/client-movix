import { API_ENDPOINTS } from "../constants";
import { del, get, patch, post } from "../utils";

export const getAllCinema = () => get(API_ENDPOINTS.CINEMAS.LIST);

export const createCinema = (data) => post(API_ENDPOINTS.CINEMAS.CREATE, data);

export const getCinemaById = (id) => get(API_ENDPOINTS.CINEMAS.DETAIL_BY_ID(id));

export const updateCinema = (id, data) =>
  patch(API_ENDPOINTS.CINEMAS.UPDATE(id), data);


export const deleteCinema = (id) => del(API_ENDPOINTS.CINEMAS.DELETE(id));

  
export const updateCinemaStatus = (id, status) =>
  patch(API_ENDPOINTS.CINEMAS.UPDATE(id), { status });