import React from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/perfil.css'
import Perfilimg from '../img/perfil.png'
export const Perfil = () => {
  const location = useLocation();
  const usuario = location.state || {};

  return (
    <>
      <div className='container'>
        <div className='perfil'>
          <div className='fotoPerfil'>
            <img src={Perfilimg} alt="" />
          </div>
          <div>
            <h3>Informacion personal</h3>
            <label htmlFor="">Correo</label>
            <input type="text" value={usuario.Correo} disabled />
            <label htmlFor="">Nombre completo</label>
            <input type="text" value={`${usuario.PrimerNombre} ${usuario.SegundoNombre} ${usuario.PrimerApellido} ${usuario.SegundoApellido}`} disabled/>
            <label htmlFor="">Telefono</label>
            <input type="text" value={usuario.Telefono} disabled/>
            <label htmlFor="">Direccion</label>
            <input type="text" value={`${usuario.Calle} #${usuario.Numero}`} disabled/>
            <input type="text" value={`${usuario.Ciudad} , ${usuario.Departamento}`} disabled/>

          </div>
        </div>
      </div>
    </>
  );
};
