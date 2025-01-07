import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from './NavBar';
import loanService from '../services/loan.service';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button'; 
import { Box, MenuItem, Select, InputLabel, TextField, FormControl, Grid, FormControlLabel, Radio, RadioGroup, FormLabel } from '@mui/material';

const ApplyForLoan = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loanType, setLoanType] = useState('');
    const [propertyValue, setPropertyValue] = useState('');
    const [requiredLoan, setRequiredLoan] = useState('');
    const [yearsToPay, setYearsToPay] = useState('');
    const [yearInterestRate, setYearInterestRate] = useState('');
    const [income, setIncome] = useState('');
    const [veteran, setVeteran] = useState('');
    const [totaldebt, setTotaldebt] = useState('');
    const [papers, setPapers] = useState(null);
    const [isIndependent, setIsIndependent] = useState('');
    const [fileName, setFileName] = useState(''); // Estado para almacenar el nombre del archivo

    const propertyValueRef = useRef();
    const requiredLoanRef = useRef();
    const yearsToPayRef = useRef();
    const incomeRef = useRef();
    const veteranRef = useRef();
    const totaldebtRef = useRef();

    

    const loanTypeLimits = {
        "1": { maxLoanPercentage: 80, maxYears: 30, interestRate: 4.5 },
        "2": { maxLoanPercentage: 70, maxYears: 20, interestRate: 5.5 },
        "3": { maxLoanPercentage: 60, maxYears: 25, interestRate: 6.5 },
        "4": { maxLoanPercentage: 50, maxYears: 15, interestRate: 5.0 },
    };

    const handleLoanTypeChange = (e) => {
        const selectedType = e.target.value;
        setLoanType(selectedType);
        setRequiredLoan('');
        setYearsToPay('');
        setYearInterestRate(loanTypeLimits[selectedType].interestRate);
    };

    const formatNumber = (value) => {
        const numericValue = value.replace(/\D/g, ''); // Elimina cualquier carácter que no sea un número
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Aplica el formato con puntos
    };
    
    const handlePropertyValueChange = (e) => {
        const formattedValue = formatNumber(e.target.value);
        setPropertyValue(formattedValue);
    };
    
    const handleRequiredLoanChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, ''); // Quitar puntos para comparar valores numéricos
        const maxLoan = (parseInt(propertyValue.replace(/\./g, '')) * loanTypeLimits[loanType].maxLoanPercentage) / 100;
    
        // Verificar si el campo está vacío
        if (rawValue === '') {
            setRequiredLoan('');
            return;
        }
    
        if (parseInt(rawValue) <= maxLoan) {
            const formattedValue = formatNumber(rawValue);
            setRequiredLoan(formattedValue);
        } else {
            alert(`ADVERTENCIA: El préstamo máximo permitido es el ${loanTypeLimits[loanType].maxLoanPercentage}% del valor del inmueble (monto máximo: ${formatNumber((maxLoan).toString())})`);
        }
    };
    
    
    const handleYearsToPayChange = (e) => {
        const maxYears = loanTypeLimits[loanType]?.maxYears || 0;
        const value = e.target.value;
        if (value <= maxYears && value >= 0) {
            setYearsToPay(value);
        } else {
            alert(`ADVERTENCIA: El máximo de años permitidos es ${maxYears}`);
        }
    };

    const handleIncomeChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
        const formattedValue = formatNumber(rawValue); // Aplica el formato con puntos
        setIncome(formattedValue); // Actualiza el estado con el valor formateado
    };

    const handleTotalDebtChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
        const formattedValue = formatNumber(rawValue); // Aplica el formato con puntos
        setTotaldebt(formattedValue); // Actualiza el estado con el valor formateado
    };
    
    
    
    

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setPapers(selectedFile);
            setFileName(selectedFile.name); // Actualiza el nombre del archivo
        } else {
            alert("Por favor, selecciona un archivo PDF.");
            setPapers(null);
            setFileName(''); // Limpiar el nombre si el archivo no es válido
        }
    };

    const handleLoanCreate = async () => {
        const loan = {
            idUser: id,
            type: loanType,
            yearInterest: yearInterestRate,
            maxDuration: yearsToPay,
            income: parseFloat(income.replace(/\./g, '')), // Convertir a número después de eliminar puntos
            veteran,
            totaldebt: parseFloat(totaldebt.replace(/\./g, '')), // Convertir a número después de eliminar puntos
            loanAmount: parseFloat(requiredLoan.replace(/\./g, '')), // Convertir a número después de eliminar puntos
            isIndependent: isIndependent === 'yes' ? 1 : 0,
        };
        

        try {
            await loanService.create(loan, papers);
            alert("Se mandó la solicitud de crédito");
            navigate(`/home/${id}`);
        } catch (error) {
            console.error("Error al intentar enviar el préstamo:", error);
            alert("Ocurrió un error al intentar mandar el préstamo. Por favor, intenta nuevamente.");
        }
    };

    return (
        
        <div>
            <NavBar id={id} />
            <h1>Solicitar un crédito</h1>
            <h2>Por favor ingrese todos los datos y al final comprobantes de ellos</h2>
            <Box sx={{ '& > :not(style)': { ml: 0, mr: -30, mt: 6, mb: 5 } }}>
                <Grid container spacing={1}>
                    <FormControl fullWidth margin="normal">
                    <InputLabel>Seleccione el tipo de préstamo hipotecario</InputLabel>
                        <Select value={loanType} onChange={handleLoanTypeChange} label="Tipo de prestamo">
                            <MenuItem value="" disabled>Seleccione el tipo de préstamo</MenuItem>
                            <MenuItem value="1"><b>Primera vivienda</b> : Interes 4.5% anual - Maximo prestamo 80% del inmueble</MenuItem>
                            <MenuItem value="2"><b>Segunda vivienda</b> : Interes 5.5% anual - Maximo prestamo 70% del inmueble</MenuItem>
                            <MenuItem value="3"><b>Propiedad comercial</b> : Interes 6.5% anual - Maximo prestamo 60% del inmueble</MenuItem>
                            <MenuItem value="4"><b>Remodelación</b> : Interes 5.0% anual - Maximo prestamo 50% del inmueble</MenuItem>
                        </Select>
                        <br/>

                        <TextField
                            type="text"
                            value={propertyValue}
                            onChange={handlePropertyValueChange}
                            onKeyPress={(e) => { if (e.key === 'Enter') requiredLoanRef.current.focus(); }}
                            label="Valor del inmueble a hipotecar"
                            placeholder="Ingresa el valor del inmueble"
                            inputRef={propertyValueRef}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">pesos chilenos</InputAdornment>,
                            }} 
                        />
                        <br/>

                        <TextField
                            type="text"
                            value={requiredLoan}
                            onChange={handleRequiredLoanChange}
                            onKeyPress={(e) => { if (e.key === 'Enter') yearsToPayRef.current.focus(); }}
                            label="Cantidad del préstamo requerido"
                            placeholder="Ingresa el préstamo requerido"
                            disabled={!loanType || !propertyValue}
                            inputRef={requiredLoanRef}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">pesos chilenos</InputAdornment>,
                            }}
                        />
                        <br/>

                        <TextField
                            type="text"
                            value={yearsToPay}
                            onChange={handleYearsToPayChange}
                            onKeyPress={(e) => { if (e.key === 'Enter') incomeRef.current.focus(); }}
                            label="Total de años a pagar el prestamo"
                            placeholder="Ingresa los años para pagar"
                            disabled={!loanType}
                            inputRef={yearsToPayRef}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">años</InputAdornment>,
                            }}
                        />
                        <br/>

                        <TextField
                            type="text"
                            value={income}
                            onChange={handleIncomeChange}
                            onKeyPress={(e) => { if (e.key === 'Enter') veteranRef.current.focus(); }}
                            label="Salario mensual"
                            placeholder="Ingreso mensual"
                            inputRef={incomeRef}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">pesos chilenos</InputAdornment>,
                            }}
                        />
                        <br/>

                        <TextField
                            type="number"
                            value={veteran}
                            onChange={(e) => setVeteran(e.target.value)}
                            onKeyPress={(e) => { if (e.key === 'Enter') totaldebtRef.current.focus(); }}
                            label="Antiguedad en el trabajo actual"
                            placeholder="tiempo en años que lleva dentro del trabajo"
                            inputRef={veteranRef}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">años</InputAdornment>,
                            }}
                        />
                        <br/>


                        <TextField
                            type="text"
                            value={totaldebt}
                            onChange={handleTotalDebtChange}
                            label="Total de insumos basicos y deudas mensuales"
                            placeholder="Ingrese el total de insumos basicos y deudas que tenga actualmente en el mes"
                            inputRef={totaldebtRef}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">pesos chilenos</InputAdornment>,
                            }}
                        />

                        <br/>
                        
                        <FormControl component="fieldset">
                            <FormLabel component="legend">¿Eres trabajador independiente?</FormLabel>
                            <RadioGroup row value={isIndependent} onChange={e => setIsIndependent(e.target.value)}>
                                <FormControlLabel value="yes" control={<Radio />} label="Sí" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>

                        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                        Haz click para subir comprobantes en formato PDF
                            <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
                        </Button>

                        {/* Mostrar el nombre del archivo cargado si existe */}
                        {fileName && (
                            <div style={{ marginTop: '10px' }}>
                                <strong>Archivo cargado: </strong> {fileName}
                            </div>
                        )}

                        <br/>
                        <Button 
                            variant="contained" 
                            onClick={() => {
                                if (window.confirm("¿Estas seguro que quieres enviar la solicitud?")) {
                                    handleLoanCreate();
                                }
                            }}
                            type="button"
                            sx={{ mt: 2 }}
                        >
                            Enviar solicitud de crédito
                        </Button>

                    </FormControl>
                </Grid>
            </Box>
        </div>
    );
};

export default ApplyForLoan;
