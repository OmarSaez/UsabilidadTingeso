import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import loanService from "../services/loan.service";
import Button from "@mui/material/Button"; 
import CancelIcon from '@mui/icons-material/Cancel';
import { useParams } from "react-router-dom";

const MyApplication = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const { id } = useParams();
  const [insurance, setInsurance] = useState('');
  const [commission, setCommission] = useState('');
  const [totalCost, setTotalCost] = useState('');

  const init = () => {
    loanService
      .getAllWithID(id)
      .then((response) => {
        console.log("Mostrando lista de solicitudes de préstamo del usuario.", response.data);
        setLoans(response.data);
      })
      .catch((error) => {
        console.log("Error al intentar mostrar la lista de préstamos del usuario.", error);
      });
  };

   // Función para traducir el estado de préstamo a texto descriptivo
   const getStatusText = (status) => {
    switch (status) {
      case 1: return "Revisión inicial";
      case 2: return "Pendiente de documentación";
      case 3: return "En evaluación";
      case 4: return "Pre-aprobado";
      case 5: return "Aprobación final";
      case 6: return "Aprobada";
      case 7: return "Rechazada";
      case 8: return "Cancelada por el cliente";
      case 9: return "En desembolso";
      default: return "Estado desconocido";
    }
  };

  // Función para traducir el tipo de crédito a texto descriptivo
  const getTypeText = (type) => {
    switch (type) {
      case 1: return "Primera vivienda";
      case 2: return "Segunda vivienda";
      case 3: return "Propiedad comercial";
      case 4: return "Remodelación";
      default: return "Tipo desconocido";
    }
  };

  useEffect(() => {
    init();
  }, [id]);

  const handleCancel = (loan) => {
    const updatedLoanData = { ...loan, status: 8 };
        
    loanService.update(updatedLoanData)
      .then(response => {
        console.log("Estado actualizado en el servidor:", response.data);
        setLoanData(updatedLoanData);
      })
      .catch(error => {
        console.error("Error al actualizar el estado:", error);
      });
    window.location.reload();
  }
  return (
    <div>
      <NavBar id={id} />
      <TableContainer component={Paper}>
        <h3>Lista de solicitudes de préstamo</h3>
        <hr />
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>ID Solicitud</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Estado</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Tipo de Crédito</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Interés Anual</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Cuota Mensual</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Total de meses a pagar</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Costo seguro por incendio</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Costo por seguro desgravamen</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Costo por administración</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Total a pagar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow
                key={loan.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}              >
                <TableCell align="right">{loan.id}</TableCell>
                <TableCell align="right">{getStatusText(loan.status)}</TableCell>
                <TableCell align="right">{getTypeText(loan.type)}</TableCell>
                <TableCell align="right">
                  {new Intl.NumberFormat("es-CL", { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(loan.yearInterest)}
                </TableCell>
                <TableCell align="right">
                  {new Intl.NumberFormat("es-CL", { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(loan.monthlyPayment)}
                </TableCell>
                <TableCell align="right">{new Intl.NumberFormat("es-CL", { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(loan.totalPayments)}</TableCell>
                
                <TableCell align="right">{"20.000"}</TableCell> {/*Costo seguro de incendio*/}
                <TableCell align="right">{new Intl.NumberFormat("es-CL", { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(loan.ingesurce)}</TableCell>
                <TableCell align="right">{new Intl.NumberFormat("es-CL", { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(loan.commission)}</TableCell>
                <TableCell align="right">{new Intl.NumberFormat("es-CL", { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(loan.totalCost)}</TableCell>

                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => handleCancel(loan)}
                    style={{ marginLeft: "0.5rem" }}
                    startIcon={<CancelIcon />}
                  >
                    Cancelar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MyApplication;
