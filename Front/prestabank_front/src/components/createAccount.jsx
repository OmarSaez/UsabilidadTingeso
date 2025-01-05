//Importaciones
import * as React from 'react';
import { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'; // Importar el botón
import { useNavigate } from 'react-router-dom';
import userService from '../services/user.service';

const CreateAccount = () => {

    const navigate = useNavigate();//Inicia el hook de navegacion

    const enterAccount = () => {
        navigate('/'); //Redigire a la ruta para crear cuenta
    }

    //Definicion de estados
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = React.useState('');
    const [rut, setRut] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState({ email: '', rut: '', password: '' }); // Estado de mensajes de error
    const [errorMessageBackend, setErrorMessageBackend] = useState('');

    //Funcion para manejar el envio del formulario aqui va todo relacionado amandar al backend
    const saveUser = async (event) => {
        event.preventDefault(); //Evita que se recargue la pagina

        //Verificar que el correo, contraseña y rut no este vacia
        setErrorMessage({email:'', rut:'', password:''});//reiniciamos los errores

        let hasError = false;
        let newErrorMessage = {email:'', rut:'', password:''};

        if (!email) {
            newErrorMessage.email = 'Por favor ingrese un correo';
            hasError = true;
        }

        if (!rut) {
            newErrorMessage.rut = 'Por favor ingrese un RUT';
            hasError = true;
        }

        if (!password) {
            newErrorMessage.password = 'Por favor ingrese una contraseña';
            hasError = true;
        }

        // Si hubo algún error, actualizamos el estado y detenemos el flujo
        if (hasError) {
            setErrorMessage(newErrorMessage);
            return;
        }

        //Se crea objeto con valores del los campos, deben de llamarse igual que en backend
        const user = {
            name: name,
            lastName: lastName,
            email: email,
            rut: rut,
            birthDay: day,
            birthMonth: month,
            birthYear: year,
            password: password
        };
        // Si hubo algún error, actualizamos el estado y detenemos el flujo
        if (hasError) {
            setErrorMessage(newErrorMessage); // Actualizamos el estado con los errores
            return;
        }

        //Llamar al servicio de user para mandar data al backend
        try {
            await userService.create(user);
            alert('Cuenta creada exitosamente'); // Acción si el usuario es creado con éxito
            setErrorMessage({ email: '', rut: '', password: '' }); // Reiniciar errores al éxito
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessageBackend(error.response.data); // Aquí mostramos el mensaje "El correo ya está registrado"
                alert(errorMessageBackend);
            } else {
                setErrorMessageBackend('Ocurrió un error al crear la cuenta.'); // Manejo de errores genérico
            }
        }

        console.log('Datos del usuario:', user);

    };

    return(
        <div>
            <h1>Crea un cuenta</h1>
            <h3>Porfavor ingrese los datos</h3>

            <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          >
            <TextField id="input-name" label="Nombre" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
            <br/>
            <TextField id="input-lastName" label="Apellido" variant="outlined" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <br/>
            <TextField id="input-email" label="Correo" variant="outlined"  value={email} onChange={(e) => setEmail(e.target.value)} error={!!errorMessage.email} helperText={errorMessage.email}/>
            <br/>
            <TextField id="input-RUT" label="RUT" variant="outlined"value={rut} onChange={(e) => setRut(e.target.value)} error={!!errorMessage.rut} helperText={errorMessage.rut}/>
            <br/>
            <TextField
            id="input-day"
            label="Dia de nacimiento"
            type="number"
            slotProps={{
                inputLabel: {
                shrink: true,
                },
            }}
            value={day} 
            onChange={(e) => setDay(e.target.value)}
            />  
            <br/>
            <TextField
            id="input-day"
            label="Mes de nacimiento"
            type="number"
            slotProps={{
                inputLabel: {
                shrink: true,
                },
            }}
            value={month} 
            onChange={(e) => setMonth(e.target.value)}
            />  
            <br/>
            <TextField
            id="input-year"
            label="Año de nacimiento"
            type="number"
            slotProps={{
                inputLabel: {
                shrink: true,
                },
            }}
            value={year} 
            onChange={(e) => setYear(e.target.value)}
            />  
            <br/>
            <TextField 
            id="outlined-password-input" 
            label="Password" 
            type="password" 
            autoComplete="current-password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            error={!!errorMessage.password} // Muestra el estado de error si no hay contraseña
            helperText={errorMessage.password} // Muestra el mensaje de error si aplica
            />
            <br/>
            <br/>
            <br/>
            <Button  //Boton de crear cuenta
                variant="contained" // Cambia el estilo del botón
                onClick={(e) => saveUser(e)}
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

            <Button  //Boton de volver inicio
                variant="contained" // Cambia el estilo del botón
                onClick={enterAccount} //Volver al menu de inicio
                sx={{
                bgcolor: 'primary.main', // Color de fondo
                color: 'white', // Color del texto
                '&:hover': {
                bgcolor: 'primary.dark', // Color al pasar el mouse
                        },
                    }}
                >
                Volver
            </Button>  
            </Box>

            {errorMessageBackend && <p style={{ color: 'red' }}>{errorMessageBackend}</p>}

        </div>
    );
}

export default CreateAccount;