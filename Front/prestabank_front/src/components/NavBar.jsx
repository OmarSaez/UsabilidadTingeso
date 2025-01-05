import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

const NavBar = ({ id }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    }

    return (
        <AppBar sx={{ backgroundColor: '#1565c0' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
                    Menú
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate(`/simulation/${id}`)}
                        sx={{ 
                            '&:hover': { transform: 'scale(1.1)', transition: '0.3s' }
                        }}
                    >
                        Simular Crédito
                    </Button>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate(`/apply-for-loan/${id}`)}
                        sx={{ 
                            '&:hover': { transform: 'scale(1.1)', transition: '0.3s' }
                        }}
                    >
                        Solicitar Crédito
                    </Button>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate(`/loan-evalue/${id}`)}
                        sx={{ 
                            '&:hover': { transform: 'scale(1.1)', transition: '0.3s' }
                        }}
                    >
                        Evaluar Crédito
                    </Button>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate(`/my-application/${id}`)}
                        sx={{ 
                            '&:hover': { transform: 'scale(1.1)', transition: '0.3s' }
                        }}
                    >
                        Mis solicitudes
                    </Button>
                    <Button 
                        color="inherit" 
                        onClick={handleLogout}
                        sx={{ 
                            '&:hover': { transform: 'scale(1.1)', transition: '0.3s' }
                        }}
                    >
                        Cerrar Sesión
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
