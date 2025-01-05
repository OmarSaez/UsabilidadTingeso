import axios from "axios";

const prestabankBackendServer = import.meta.env.VITE_PRESTABANK_BACKEND_SERVER;
const prestabankBackendPort = import.meta.env.VITE_PRESTABANK_BACKEND_PORT;

console.log(prestabankBackendServer)
console.log(prestabankBackendPort)

export default axios.create({
    baseURL: `http://${prestabankBackendServer}:${prestabankBackendPort}`,
    headers: {
        'Content-Type': 'application/json'
    }
});