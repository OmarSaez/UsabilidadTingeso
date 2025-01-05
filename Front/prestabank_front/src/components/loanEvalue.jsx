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
import EditIcon from "@mui/icons-material/Edit";
import { useParams } from "react-router-dom";

const LoanEvalue = () => {
    const navigate = useNavigate();
    const [loans, setLoans] = useState([]);
    const { id } = useParams(); //ID DEL USUARIO QUE ACCESIO A LA PAGINA

    const init = () => {
        loanService
          .getAll()
          .then((response) => {
            console.log("Mostrando lista de solicitudes de préstamo del usuario.", response.data);
            setLoans(response.data);
          })
          .catch((error) => {
            console.log("Error al intentar mostrar la lista de préstamos del usuario.", error);
          });
      };
    
      useEffect(() => {
        init();
      }, [id]);
    
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

      const handleEvalue = (idLoan) => {
        console.log("Printing id", idLoan);
        navigate(`/loan-evalue/${id}/${idLoan}`);
      };
    
      return (
        <div>
            <NavBar id={id} />
            <TableContainer component={Paper}>
            <h3>Lista de solicitudes de préstamo</h3>
            <hr />
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                <TableRow>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    ID Solicitud
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Estado
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Tipo de Crédito
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Interés Anual
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Cuota Mensual
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Total de meses a pagar
                    </TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {loans.map((loan) => (
                    <TableRow key={loan.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell align="right">{loan.id}</TableCell>
                        <TableCell align="right">{getStatusText(loan.status)}</TableCell>
                        <TableCell align="right">{getTypeText(loan.type)}</TableCell>
                        <TableCell align="right">
                            {new Intl.NumberFormat("es-CL", { style: "decimal" }).format(loan.yearInterest) }
                        </TableCell>
                        <TableCell align="right">
                            {new Intl.NumberFormat("es-CL", { style: "decimal" }).format(loan.monthlyPayment)}
                        </TableCell>
                        <TableCell align="right">{loan.totalPayments}</TableCell>
                        <TableCell align="right">
                        <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => handleEvalue(loan.id)}
                        style={{ marginLeft: "0.5rem" }}
                        startIcon={<EditIcon />}
                        >
                        Evaluar
                        </Button>
                        </TableCell>

                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
      );
}

export default LoanEvalue;