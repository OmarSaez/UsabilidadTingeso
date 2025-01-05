import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/loan/');
}

const create = (loan, file) => {
    const formData = new FormData();
    // Agregar el objeto LoanEntity como una cadena JSON directamente
    formData.append("loan", JSON.stringify(loan));
    // Agregar el archivo
    formData.append("file", file);

    // Al usar FormData, el navegador se encarga de los encabezados (Content-Type), por lo que no debes definirlos manualmente.
    console.log("----DATOS QUE SE MANDARAN AL BACKEND----");
    console.log(formData.get("loan"));
    console.log(formData.get("file"));

    // Configuración explícita para axios
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data', // Asegúrate de que se mande como multipart
        }
    };

    return httpClient.post("/api/loan/", formData, config);
}


  
const get = id =>  {
    return httpClient.get(`/api/loan/${id}`);
}

const getForPDF = id => {
    return httpClient.get(`/api/loan/${id}/pdf`);
}

const getAllWithID = id => {
    return httpClient.get(`/api/loan/user/${id}`);
}

const update = data => {
    return httpClient.put('/api/loan/', data);
}

const remove = id => {
    return httpClient.delete(`/api/loan/${id}`);
}

const status = status => {
    return httpClient.get(`/api/loan/status/${status}`);
}

const type = type => {
    return httpClient.get(`/api/loan/type/${type}`);
}


const updateExecutive = (data, acountYears, balance) => {
    const balanceLast12 = balance.join(',');
    console.log('Balance Last 12 original:', balance);
    console.log('Balance Last 12:', balanceLast12); // Asegúrate de que esto sea un array
    console.log('Account Years:', acountYears); // Asegúrate de que esto sea un array

    return httpClient.put('/api/loan/executive', data, {params: { acountYears, balanceLast12 }});
};


const simulateLoan = (loanData) => {
    console.log("---Se ingreso a Service front simulation");
    return httpClient.post("/api/loan/simulate", loanData);
}


export default { getAll, create, get, getForPDF, getAllWithID, update, remove, status, type, updateExecutive, simulateLoan };