// Importaciones
import * as React from 'react';
import { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'; 
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import userService from '../services/user.service';

const LoginAccount = () => {
    const navigate = useNavigate();

    const enterAccount = () => {
        navigate('/'); // Redirige a la ruta principal
    }

    // Definición de estados
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = useState('');

    // Función para manejar el envío del formulario
    const handleLogin = async (event) => {
        event.preventDefault();
        
        try {
            const response = await userService.getWithEmail(email); // Intenta obtener el usuario por email
            const user = response.data;

            if (user && user.password === password) { // Verifica la contraseña
                alert("Inicio de sesión exitoso");
                navigate(`/home/${user.id}`); // Cambia esta ruta según a dónde quieras redirigir tras el login exitoso
            } else {
                alert("El correo o contraseña con erroneos");
            }
        } catch (error) {
            console.log("Error en el inicio de sesión", error);
            alert("Error: Usuario no encontrado o credenciales incorrectas.");
        }
    };

    // Botones e interfaz
    return (
        <div>
            <h1>Ingrese una cuenta</h1>
            <h3>Por favor rellene los datos</h3>

            <Box sx={{ '& > :not(style)': { m: 1, mx: 11} }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <AccountCircle sx={{ color: 'action.active', mr: 1.5, my: 2 }} />
                    <TextField 
                        id="input-email" 
                        label="Correo" 
                        variant="outlined" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </Box>
            </Box> 

            <Box
                component="form"
                onSubmit={handleLogin} // Maneja el envío del formulario
                sx={{ '& > :not(style)': { m: 1, width: '24ch' } }}
                noValidate
                autoComplete="off"
            >   
                <TextField
                    id="input-password"
                    label="Contraseña"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <br />
                <Button 
                    variant="contained" 
                    type="submit" // Envía el formulario
                    sx={{ mt: 2 }} // Añade un margen superior para separación
                >
                    Iniciar sesión
                </Button>

                <Button 
                    variant="contained" 
                    onClick={enterAccount}
                    type="button" // Este botón no debe enviar el formulario
                    sx={{ mt: 2 }} // Añade un margen superior para separación
                >
                    Volver
                </Button>
            </Box>
        </div>
    );
}

export default LoginAccount;
