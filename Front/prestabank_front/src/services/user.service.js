import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/user/');
}

const create = data => {
    return httpClient.post("/api/user/", data);
}

const get = id => {
    return httpClient.get(`/api/user/${id}`);
}

const getWithEmail = email => {
    return httpClient.get(`/api/user/with/${email}`)
}

const update = data => {
    return httpClient.put('api/user/', data);
}

const remove = id => {
    return httpClient.delete(`/api/user/${id}`);
}

export default {getAll, create, get, getWithEmail, update, remove};