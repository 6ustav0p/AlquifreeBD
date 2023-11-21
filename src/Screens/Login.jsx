import React, { useState } from 'react';
import { Titulo } from '../Components/Titulo';
import '../Styles/login.css';
import Logo from '../img/logo.jpg';
import { useNavigate } from "react-router-dom";

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
        navigate("/", { state: { userId } });
      
        console.log('Usuario autenticado correctamente');
      } else {
        // Maneja errores si la solicitud no fue exitosa
        console.error('Error al autenticar usuario');
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
    }
  };

  return (
    <div className='container'>
      <Titulo name={'Login'} />
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
            className='button'
            value={'Sign in'}
          />
        </form>
      </div>
    </div>
  );
};
