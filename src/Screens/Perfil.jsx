import React from "react";
import { useLocation } from "react-router-dom";
import "../Styles/perfil.css";
import Perfilimg from "../img/perfil_usuario.png";
import { Titulo } from "../Components/Titulo";
import { Footer } from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
export const Perfil = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = location.state || {};
  const handleCerrar = () => {
    let timerInterval;
    Swal.fire({
      title: "Cerrando sesion",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
      navigate("/", { state: '' });
    });
  }
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
                value={`${usuario.Info_Via} #${usuario.Numero}`}
                disabled
              />
              <input
                type="text"
                value={`${usuario.Ciudad} , ${usuario.Departamento}`}
                disabled
              />
              <button className="btn-cerrarsesion" onClick={handleCerrar}>Cerrar sesion</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
