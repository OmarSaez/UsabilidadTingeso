import * as React from 'react';
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';
import Button from '@mui/material/Button'; 
import { useNavigate } from 'react-router-dom';
import { Box, Typography, MenuItem, Select, InputLabel, TextField, FormControl, Grid } from '@mui/material';
import loanService from '../services/loan.service';
import InputAdornment from '@mui/material/InputAdornment';


const Simulation = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    // Estados para los inputs y la cuota mensual calculada
    const [loanType, setLoanType] = useState('');
    const [propertyValue, setPropertyValue] = useState('');
    const [requiredLoan, setRequiredLoan] = useState('');
    const [yearsToPay, setYearsToPay] = useState('');
    const [yearInterestRate, setYearInterestRate] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState(''); // Estado para la cuota mensual calculada

    // Restricciones basadas en el tipo de préstamo
    const loanTypeLimits = {
        "1": { maxLoanPercentage: 80, maxYears: 30, interestRate: 4.5 },
        "2": { maxLoanPercentage: 70, maxYears: 20, interestRate: 5.5 },
        "3": { maxLoanPercentage: 60, maxYears: 25, interestRate: 6.5 },
        "4": { maxLoanPercentage: 50, maxYears: 15, interestRate: 5.0 },
    };

    // Manejar cambio del tipo de préstamo
    const handleLoanTypeChange = (e) => {
        const selectedType = e.target.value;
        setLoanType(selectedType);
        setRequiredLoan('');
        setYearsToPay('');
        setYearInterestRate(loanTypeLimits[selectedType].interestRate);
    };

    const handlePropertyValueChange = (e) => {
        const formattedValue = e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        setPropertyValue(formattedValue);
    };

    const handleRequiredLoanChange = (e) => {
        const formattedValue = e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const numericValue = parseFloat(formattedValue.replace(/\./g, ''));
        const maxLoan = (propertyValue.replace(/\./g, '') * loanTypeLimits[loanType].maxLoanPercentage) / 100;
        
        if (formattedValue === '') {
            setRequiredLoan('');
            return;
        }

        if (numericValue <= maxLoan) {
            setRequiredLoan(formattedValue);
        } else {
            alert(`ADVERTENCIA: El préstamo máximo permitido es el ${loanTypeLimits[loanType].maxLoanPercentage}% del valor del inmueble (monto máximo: ${maxLoan.toLocaleString('es-CL')})`);
        }
    };

    const handleYearsToPayChange = (e) => {
        const maxYears = loanTypeLimits[loanType].maxYears;
        if (e.target.value <= maxYears && e.target.value >= 0) {
            setYearsToPay(e.target.value);
        } else {
            alert(`ADVERTENCIA: El máximo de años permitidos es ${maxYears}`);
        }
    };

    const handleCalculate = async () => {
        const simulate = {
            loanAmount: parseFloat(requiredLoan.replace(/\./g, '')),
            yearInterestRate: yearInterestRate,
            yearPayments: yearsToPay,
        };

        console.log("Datos enviados al backend:", simulate);

        try {
            const response = await loanService.simulateLoan(simulate); // SimulateLoan devuelve la cuota mensual calculada
            // Formateamos el número para mostrar con separadores de miles y sin decimales
            const formattedPayment = new Intl.NumberFormat('es-CL').format(Math.round(response.data));
            setMonthlyPayment(formattedPayment); // Guarda el valor de la cuota mensual en el estado
                
        } catch (error) {
            console.error("Error al intentar calcular el préstamo:", error);
            alert("Ocurrió un error al intentar calcular el préstamo. Por favor, intenta nuevamente.");
        }
    };

    return (
        <div>
            <NavBar id={id} />
            <h1>Simulación de crédito</h1>
            <h2>Aquí puedes ver cuánto saldrá cada cuota de la hipoteca</h2>
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
                            label="Valor del inmueble" 
                            placeholder="Ingrese el valor del inmueble a Hipotecar" 
                            InputProps={{
                                endAdornment: <InputAdornment position="end">pesos chilenos</InputAdornment>,
                            }}
                        />
                        <br/>

                        <TextField 
                            type="text" 
                            value={requiredLoan} 
                            onChange={handleRequiredLoanChange} 
                            label="Préstamo requerido" 
                            placeholder="Ingrese el valor del préstamo requerido" 
                            disabled={!loanType || !propertyValue} 
                            InputProps={{
                                endAdornment: <InputAdornment position="end">pesos chilenos</InputAdornment>,
                            }}
                        />
                        <br/>

                        <TextField 
                            type="number" 
                            value={yearsToPay} 
                            onChange={handleYearsToPayChange} 
                            label="Total de años a pagar" 
                            placeholder="Ingrese el total de años para pagar del prestamo" 
                            disabled={!loanType} 
                            InputProps={{
                                endAdornment: <InputAdornment position="end">años</InputAdornment>,
                            }} 
                        />
                        <br/>

                        <Button 
                            variant="contained" 
                            onClick={handleCalculate}
                            type="button"
                            sx={{ mt: 2 }}
                        >
                            Click para Calcular la cuota mensual
                        </Button>
                        <br/>

                        <TextField 
                            type="text" 
                            value={monthlyPayment} 
                            label="Resultado de la cuota mesnual" 
                            color="secondary" 
                            focused 
                            InputProps={{
                                readOnly: true,
                                endAdornment: <InputAdornment position="end">pesos chilenos</InputAdornment>,
                            }} 
                        />
                        <br/>



                    </FormControl>

                    <Button 
                        variant="contained" 
                        onClick={() => navigate(`/home/${id}`)}
                        type="button"
                        sx={{ mt: 2 }}
                    >
                        Volver
                    </Button>
                </Grid>
            </Box>
        </div>
    );
};

export default Simulation;
