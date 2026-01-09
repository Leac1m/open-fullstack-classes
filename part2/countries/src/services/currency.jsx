import axios from "axios";
const baseUrl = "https://open.er-api.com/v6/latest";

const getAll = () => axios.get(baseUrl).then((response) => response.data);

const get = (currency) => axios.get(`${baseUrl}/${currency}`).then((response) => response.data);

const update = (id, noteObject) =>
  axios.put(`${baseUrl}/${id}`, noteObject).then((response) => response.data);

const create = (noteObject) =>
  axios.post(`${baseUrl}`, noteObject).then((response) => response.data);

const remove = (id) =>
  axios.delete(`${baseUrl}/${id}`).then((response) => response.data);

export default { getAll, get, create, update, remove };
