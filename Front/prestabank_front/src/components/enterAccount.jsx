//Importaciones
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; // Importar el botón
import { useNavigate } from 'react-router-dom';


const EnterAccount = () => {
    //Logica creo
    const navigate = useNavigate();//Inicia el hook de navegacion
    
    const createAccount = () => {
        navigate('/create'); //Redigire a la ruta para crear cuenta
    }

    const loginAccount = () => {
        navigate('/login');
    }

    //Cosas a poner en pantalla
    return(
        <div>
            <h1>BIENVENIDO 🏛️</h1>
            <h2>Prestabanco su hipoteca segura</h2>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <h3>Porfavor cree una cuenta o ingresa a una ya creada</h3>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
            >
                <Button  //Boton de crear cuenta
                    variant="contained" // Cambia el estilo del botón
                    onClick={createAccount} //Indica que al accer click se redirige
                    sx={{
                    bgcolor: 'primary.main', // Color de fondo
                    color: 'white', // Color del texto
                    '&:hover': {
                    bgcolor: 'primary.dark', // Color al pasar el mouse
                            },
                        }}
                >
                    Crear cuenta
                </Button>

                <Button //Boton de logearse
                    variant="contained" // Cambia el estilo del botón
                    onClick={loginAccount}
                    sx={{
                    bgcolor: 'primary.main', // Color de fondo
                    color: 'white', // Color del texto
                    '&:hover': {
                    bgcolor: 'primary.dark', // Color al pasar el mouse
                            },
                        }}
                >
                    Ingresar
                </Button>
            </Box>
        </div>
        
    );
};

export default EnterAccount;