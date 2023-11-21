import React from 'react';
import { useLocation } from 'react-router-dom';
import "../Styles/carrito.css";
import { Titulo } from '../Components/Titulo';

export const Carrito = () => {
  const location = useLocation();
  const productosSeleccionados = location.state?.productosSeleccionados || [];

  return (
    <>
      <div className="Container">
        <Titulo name={"Carrito"} />
        <div>
          {productosSeleccionados.length > 0 ? (
            productosSeleccionados.map((producto, index) => (
              <div className="container-carrito" key={index}>


                <div className="container-carrito-prods">  <p>{producto.Descripcion}</p>
                  <p>Precio: ${producto.Precio}</p></div>
                <div className="container-carrito-func"></div>
              </div>
            ))
          ) : (
            <p>No hay productos en el carrito</p>
          )}
        </div>
      </div>
    </>
  );
};

