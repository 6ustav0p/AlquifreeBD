import React from "react";
import { useLocation } from "react-router-dom";
import "../Styles/perfil.css";
import Perfilimg from "../img/perfil.png";
import { Titulo } from "../Components/Titulo";
import { Footer } from "../Components/Footer";

export const Perfil = () => {
  const location = useLocation();
  const usuario = location.state || {};

  return (
    <>
    <Titulo name={"Usuario"} />
    <div className="container-perfil">
      <div className="perfil">
        <div className="fotoPerfil">
          <img src={Perfilimg} alt="" />
        </div>
        <div className="infoPerfil">
          <h3>Informacion personal</h3>

          <div className="campos">
            <label htmlFor="">Correo</label>
            <input type="text" value={usuario.Correo} disabled />
            <label htmlFor="">Nombre completo</label>
            <input
              type="text"
              value={`${usuario.PrimerNombre} ${usuario.SegundoNombre} ${usuario.PrimerApellido} ${usuario.SegundoApellido}`}
              disabled
            />
            <label htmlFor="">Telefono</label>
            <input type="text" value={usuario.Telefono} disabled />
            <label htmlFor="">Direccion</label>
            <input
              type="text"
              value={`${usuario.Calle} #${usuario.Numero}`}
              disabled
            />
            <input
              type="text"
              value={`${usuario.Ciudad} , ${usuario.Departamento}`}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
  );
};
