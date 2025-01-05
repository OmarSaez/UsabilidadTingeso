import * as React from 'react';
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';

const Home = () => {
    // Extraemos el id de la URL
    const { id } = useParams();

    return(
        <div>
            <NavBar id={id} />
            <h2>Seleccione alguna opción de arriba 😁</h2>
        </div>
    );
}

export default Home;
