import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import loanService from "../services/loan.service";
import userService from "../services/user.service"; 
import { useNavigate } from 'react-router-dom'; 
import Button from '@mui/material/Button'; 
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Grid, Card, CardContent, Typography } from "@mui/material";
import Box from '@mui/material/Box';
import NavBar from './NavBar';
import InputAdornment from '@mui/material/InputAdornment';


const Loan = () => {
    const navigate = useNavigate();
    const { id, idLoan } = useParams();
    const [loanData, setLoanData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedRequirement, setSelectedRequirement] = useState('');
    const [openRequestR2, setOpenRequestR2] = useState(false); //false para abrir/cerrar correctamente
    const [accountYears, setAccountYears] = useState(""); // Años de la cuenta de ahorro
    const [balanceLast12, setBalanceLast12] = useState(Array(12).fill("")); // Balance de los últimos 12 meses



    useEffect(() => {
        loanService
          .get(idLoan)
          .then((response) => {
            setLoanData(response.data);
          })
          .catch((error) => {
            console.error("Error al obtener los datos del préstamo:", error);
          });
    }, [idLoan]);

    useEffect(() => {
        userService
          .get(id)
          .then((response) => {
            setUserData(response.data);
          })
          .catch((error) => {
            console.error("Error al obtener los datos del usuario:", error);
          });
    }, [id]);

    if (!loanData || !userData) {
        return <div>Cargando...</div>;
    }

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

    const getColor = (score) => {
        if (score == 8 || score == 7) return '#FF0000'; // rojo para rechazado o cancelada
        if (score == 6) return '#00FF00'; // verde si se aprobo
        if (score == 4 || score == 5) return '#FFC933'; //amarillo si esta previo a ser aprobada
        return '#4169E1'; // azul para todo lo demás
      };

    const getTypeText = (type) => {
        switch (type) {
            case 1: return "Primera vivienda";
            case 2: return "Segunda vivienda";
            case 3: return "Comercial";
            case 4: return "Remodelacion";
            default: return "Tipo de Crédito desconocido";
        }
    };

    const getRequirementStatus = (status) => {
        switch (status) {
        case 0: return "Rechazado";
        case 1: return "Cumplido";
        case 2: return "Pendiente";
        case 3: return "Requiere otra revisión";
        default: return "Estado desconocido";
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeStatus = () => {
        const updatedLoanData = { ...loanData, status: Number(selectedStatus) };
        
        loanService.update(updatedLoanData)
            .then(response => {
                console.log("Estado actualizado en el servidor:", response.data);
                setLoanData(updatedLoanData);
            })
            .catch(error => {
                console.error("Error al actualizar el estado:", error);
            });

        handleClose();
    };

    const handleOpenRequestR2 = () => {
        setOpenRequestR2(true); // Actualizado para abrir el diálogo
    }

    const handleCloseRequestR2 = () => {
        setOpenRequestR2(false); // Actualizado para cerrar el diálogo
    }

    const handleChangeRequestR2 = () => {
        const updatedLoanData = { ...loanData };
        updatedLoanData.evalue[1] = Number(selectedRequirement);
        
        loanService.update(updatedLoanData)
            .then(response => {
                console.log("Estado actualizado en el servidor:", response.data);
                setLoanData(updatedLoanData);
            })
            .catch(error => {
                console.error("Error al actualizar el estado:", error);
            });

        handleCloseRequestR2();
    };

    // Formatea el número con puntos
    const formatNumber = (value) => {
        if (!value) return '';
        const num = value.toString().replace(/\D/g, ''); // Elimina caracteres no numéricos
        return Number(num).toLocaleString('es-CL'); // Formato para Chile
    };
    
    // Maneja cambios y desformatea antes de guardar
    const handleBalanceChangeFormatted = (idx, formattedValue) => {
        const unformattedValue = formattedValue.replace(/\./g, ''); // Elimina puntos
        handleBalanceChange(idx, unformattedValue); // Llama la función original
    };
  

    // Función para manejar cambios en el input de años
    const handleAccountYearsChange = (e) => {
        setAccountYears(Number(e.target.value));
    };

    // Función para manejar cambios en cada input del balance
    const handleBalanceChange = (index, value) => {
        const newBalance = [...balanceLast12];
        // Permitir que el valor sea "" para poder borrar el input
        newBalance[index] = value === "" ? "" : Number(value);
        setBalanceLast12(newBalance);
    };
    

    const handleSubmit = () => {
        const updatedLoanData = { ...loanData };
    
        // Verifica que cada campo de balance no esté vacío
        if (balanceLast12.some(balance => balance === "")) {
            alert("Por favor, complete todos los campos del requisito 7, antes de poder verificar el estado.");
            return; // Salir de la función si hay campos vacíos
        }
    
        console.log('Balance Last 12:', balanceLast12);
    
        loanService.updateExecutive(updatedLoanData, accountYears, balanceLast12)
            .then(response => {
                console.log("Estado actualizado en el servidor:", response.data);
                setLoanData(updatedLoanData);
            })
            .catch(error => {
                console.log('Balance Last 12:', balanceLast12);
                console.error("Error al actualizar el estado:", error);
            });
    };

      // Función para descargar el PDF en Base64
      const downloadPDFBase64 = (base64Data, fileName = 'documento.pdf') => {
        if (!base64Data || typeof base64Data !== 'string') {
          console.error("Datos inválidos para descargar el PDF.");
          return;
        }
      
        try {
          // Convertir Base64 a un array de bytes
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
      
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
      
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error al procesar el PDF para descarga:", error);
        }
      };
      

  // Función para obtener y descargar el PDF
  const handleDownloadPDF = () => {
    loanService.getForPDF(idLoan)
      .then(response => {
        if (response.data) {
          console.log("PDF en Base64 recibido:", response.data); // Verifica el contenido recibido
          downloadPDFBase64(response.data, 'documento.pdf');
        } else {
          console.error("Respuesta vacía del servidor.");
        }
      })
      .catch(error => {
        console.error("Error descargando el PDF:", error);
      });
  };
  
    


    return (
        <div>
        <NavBar id={id} />
        <div style={{ padding: "20px" }}>
        </div>
          <Box 
                sx={{ 
                    backgroundColor: '#1976d2', // Color azul primario de MUI
                    color: 'white', 
                    padding: '10px', 
                    textAlign: 'center', 
                    width: '100%', 
                    marginBottom: '20px' 
                }}
                >
                <Typography variant="h6">Detalles del crédito</Typography>
            </Box>
      
          <Grid container spacing={3}>
            {/* Información del préstamo */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Datos del Préstamo</Typography>
                  <Typography>ID Préstamo: {idLoan}</Typography>
                  <Typography>ID Usuario: {id}</Typography>
                  <Typography>
                    Estado: <span style={{ color: getColor(loanData.status) }}>{getStatusText(loanData.status)}</span>
                  </Typography>
                  <Typography>Tipo de Crédito: {getTypeText(loanData.type)}</Typography>
                  <Typography>
                    Valor del Préstamo:{" "}
                    {new Intl.NumberFormat("es-CL", {
                      style: "decimal",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }).format(loanData.loanAmount)}
                  </Typography>
                  <Typography>Interés Anual: {loanData.yearInterest}</Typography>
                  <Typography>
                    Cuota Mensual:{" "}
                    {new Intl.NumberFormat("es-CL", {
                      style: "decimal",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }).format(loanData.monthlyPayment)}
                  </Typography>
                  <Typography>Total de Meses: {loanData.totalPayments}</Typography>
                </CardContent>
              </Card>
            </Grid>
      
            {/* Datos del cliente */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                    
                <Typography variant="h6">Datos del Cliente</Typography>
                  <Typography>RUT: {userData.rut}</Typography>
                  <Typography>
                    Nombre y Apellido: {userData.name} {userData.lastName}
                  </Typography>
                  <Typography>
                    Ingreso:{" "}
                    {new Intl.NumberFormat("es-CL", { style: "decimal", minimumFractionDigits: 0 }).format(loanData.income)}
                  </Typography>
                  <Typography>Antigüedad en Trabajo: {loanData.veteran}</Typography>
                  <Typography>
                    Deudas:{" "}
                    {new Intl.NumberFormat("es-CL", { style: "decimal", minimumFractionDigits: 0 }).format(loanData.totaldebt)}
                  </Typography>
                  <Typography>
                    Fecha de Nacimiento: {userData.birthDay}/{userData.birthMonth}/{userData.birthYear}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      
          {/* Requisitos */}
          <Box 
                sx={{ 
                    backgroundColor: '#1976d2', // Color azul primario de MUI
                    color: 'white', 
                    padding: '10px', 
                    textAlign: 'center', 
                    width: '100%', 
                    marginBottom: '20px' 
                }}
                >
                <Typography variant="h6">Estados de los requisitos</Typography>
            </Box>
            <h2>Se debe verificar el estado de todos los requisitos y tomar una decisión en base a ellos</h2>
            <h3>Se requiere revisión manual en los requisitos 2 y 7</h3>
            <Grid container spacing={3}>
            {loanData.evalue.map((status, index) => (
                <Grid item xs={12} sm={6} key={index}>
                <Card>
                    <CardContent>
                    <Typography variant="h6">Requisito {index + 1}</Typography>
                    <br/>
                    <Typography><b>Estado del requisito</b>: {getRequirementStatus(status)}</Typography>
                    <br/>
                    {/* Descripciones de los requisitos */}
                    {index === 0 && (
                        <>
                        <Typography variant="body1">
                            La relación cuota ingreso no debe ser mayor al 35%.
                        </Typography>
                        </>
                    )}
                    {index === 1 && (
                        <>
                        <Typography variant="body1">
                            Se debe revisar el historial crediticio del cliente en DICOM, esta es una revisión manual que debe hacer un ejecutivo.
                        </Typography>
                        <Button variant="contained" onClick={handleOpenRequestR2} sx={{ mt: 2 }}>Cambiar estado</Button>
                        <Dialog open={openRequestR2} onClose={handleCloseRequestR2}>
                            <DialogTitle>Cambiar estado de la solicitud</DialogTitle>
                            <DialogContent>
                            <Select value={selectedRequirement} onChange={(e) => setSelectedRequirement(e.target.value)} fullWidth>
                                <MenuItem value={0}>Rechazado</MenuItem>
                                <MenuItem value={1}>Cumplido</MenuItem>
                                <MenuItem value={2}>Pendiente de documentación</MenuItem>
                                <MenuItem value={3}>Requiere otra revisión</MenuItem>
                            </Select>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleCloseRequestR2}>Cancelar</Button>
                            <Button onClick={handleChangeRequestR2}>Guardar</Button>
                            </DialogActions>
                        </Dialog>
                        </>
                    )}
                    {index === 2 && (
                        <>
                        <Typography variant="body1">
                            Se verifica que el solicitante tenga al menos 2 años en su trabajo actual. No aplica si es independiente.
                        </Typography>
                        {/* Mensaje de advertencia en texto rojo si el solicitante es independiente */}
                        {loanData.isIndependent === 1 && (
                            <p style={{ color: 'red', fontWeight: 'bold' }}>
                                Advertencia: El solicitante es independiente. Se debe revisar sus ingresos de los últimos 2 o más años para evaluar su estabilidad financiera.
                            </p>
                        )}
                        </>
                    )}
                    {index === 3 && (
                        <>
                        <Typography variant="body1">
                            La relación entre la deuda, incluyendo la proyección de la cuota mensual, y el ingreso del solicitante no debe ser mayor al 50%.
                        </Typography>
                        </>
                    )}
                    {index === 4 && (
                        <>
                        <Typography variant="body1">
                            Estas limitantes son controladas al momento que se realiza la solicitud.
                        </Typography>
                        </>
                    )}
                    {index === 5 && (
                        <>
                        <Typography variant="body1">
                            El solicitante no puede tener 70 años o más.
                        </Typography>
                        </>
                    )}
                    {index === 6 && (
                    <>
                        <Typography variant="body1">
                            Para cumplir con el requisito número 7, debe proporcionar:
                        </Typography>
                        <br/>
                        <Typography variant="body1" component="ul">
                            <li>
                                La antigüedad de la cuenta de ahorros del solicitante (en años).
                            </li>
                            <li>
                                El saldo mensual de la cuenta durante los últimos 12 meses, ingresando el monto correspondiente a cada mes por separado.
                            </li>
                        </Typography>
                        <br/>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label>
                                  Ingrese la antigüedad de la cuenta de ahorros:
                          </label>
                          <input 
                              type="number" 
                              value={accountYears} 
                              onChange={handleAccountYearsChange} 
                              min="0" 
                              style={{ width: '30px', textAlign: 'right' }} 
                          />
                          <span>años</span>
                      </div>


                        
                        <br />
                        
                        <label>Balance de los últimos 12 meses:</label>
                        <div>
                        {balanceLast12.map((balance, idx) => (
                          <div key={idx} style={{  gap: '8px', marginBottom: '8px' }}>
                              <label style={{ minWidth: '70px' }}>Mes {idx + 1}: </label>
                              <input
                                  type="text" // Cambiado a 'text' para permitir formato
                                  value={formatNumber(balance)}
                                  onChange={(e) => handleBalanceChangeFormatted(idx, e.target.value)}
                                  style={{ width: '100px', textAlign: 'right' }}
                              />
                              <span> pesos chilenos</span>
                          </div>
                      ))}

                        </div>
                        
                        <br />
                        
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => {
                                if (window.confirm("¿Estas seguro que quieres evaluar el requisito 7 ahorro?")) {
                                    handleSubmit();
                                }
                            }}
                        >
                            Evaluar Requisito 7 Ahorro
                        </Button>

                        
                        <br /><br />
                    </>
                    )}

                    </CardContent>
                </Card>
                </Grid>
            ))}
            </Grid>

            <div>
              {/* Descargar PDF*/}
              
              <Card>
                <CardContent>
                  <Typography variant="h6">Documento Adjunto</Typography>
                  {/* Botón para descargar el PDF */}
                    <Button variant="contained" onClick={handleDownloadPDF}>Descargar PDF</Button>
                </CardContent>
              </Card>
            </div>

      
          {/* Botones */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button variant="contained" onClick={() => navigate(`/home/${id}`)} sx={{ marginRight: "10px" }}>
              Volver
            </Button>
            <Button variant="contained" onClick={handleOpen}>
              Cambiar Estado de la Solicitud
            </Button>
          </div>
      
          {/* Diálogo para cambiar estado */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Cambiar estado de la solicitud</DialogTitle>
            <DialogContent>
              <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} fullWidth>
                <MenuItem value={1}>Revisión inicial</MenuItem>
                <MenuItem value={2}>Pendiente de documentación</MenuItem>
                <MenuItem value={3}>En evaluación</MenuItem>
                <MenuItem value={4}>Pre-aprobado</MenuItem>
                <MenuItem value={5}>Aprobación final</MenuItem>
                <MenuItem value={6}>Aprobada</MenuItem>
                <MenuItem value={7}>Rechazada</MenuItem>
                <MenuItem value={8}>Cancelada por el cliente</MenuItem>
                <MenuItem value={9}>En desembolso</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleChangeStatus}>Guardar</Button>
            </DialogActions>
          </Dialog>
        </div>
      );
};

export default Loan;
