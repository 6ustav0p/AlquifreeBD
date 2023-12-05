import React, { useState } from 'react';
import { Titulo } from '../Components/Titulo';
import '../Styles/login.css';
import Logo from '../img/logo.jpg';
import Swal from 'sweetalert2';
import { Link, useNavigate } from "react-router-dom";
export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { userId } = data;
        const { nombre } = data;
        Swal.fire({
          title: `Bienvenido de vuelta ${nombre}!`,
          showClass: {
            popup: 'animate__animated animate__fadeInUp animate__faster',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutDown animate__faster',
          },
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        navigate("/", { state: { userId } });
        console.log('Usuario autenticado correctamente');
      } else {
        // Maneja errores si la solicitud no fue exitosa
        console.error('Error al autenticar usuario');
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Parece que las credenciales son incorrectas!",
        });
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
    }
  };

  return (
    <>
      <Titulo name={'Login'} />
      <div className='container-login'>
        <div className='login'>
          <div className='logo'><img src={Logo} alt="" /></div>
          <p>Bienvenido a Alquifree donde encontraras todo para tus eventos</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder='Correo'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder='Contraseña'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="submit"
              className='button-crear'
              value={'Sign in'}
            />
          </form>
          <div className='creaCuenta'>
            <p>¿No tiene cuenta?</p>
            <Link to='/registro'>Crear cuenta</Link>
          </div>
        </div>
      </div>
    </>
  );
};
