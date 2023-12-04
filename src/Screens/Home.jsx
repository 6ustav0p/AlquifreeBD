import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Footer } from '../Components/Footer'
import { Titulo } from '../Components/Titulo'
import { Navbar } from '../Components/Navbar'
import { Bienvenida } from '../Components/Bienvenida'
import { Publicaciones } from '../Components/Publicaciones'
import Swal from 'sweetalert2';
export const Home = () => {
    const location = useLocation();
    const { userId} = location.state || {};
    const [usuario, setUsuario] = useState(null);
    if (userId !== '') {
        useEffect(() => {
            fetch(`http://localhost:3000/usuario/${userId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Usuario no encontrado XD');
                    }
                    return response.json();
                })
                .then((data) => {
                    setUsuario(data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }, [userId]);
    }
    return (
        <>
            {usuario  ? (
                <div className="container">
                    <Titulo name={'Alquifree'} />
                    <div className="header">
                        <Navbar usuario={usuario} />
                    </div>
                    <Bienvenida />
                    <Publicaciones usuario={usuario} />

                    <Footer />
                </div>
            ) : (
                <div className="container">
                    <Titulo name={'Alquifree'} />
                    <div className="header">
                        <Navbar />
                    </div>
                    <Bienvenida />
                    <Publicaciones />

                    <Footer />
                </div>
            )}

        </>
    )
}
