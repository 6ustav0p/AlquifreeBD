import React from "react";
import { Titulo } from "../Components/Titulo";
import "../Styles/carrito.css";

export const Carrito = () => {
  return (
    <>
      <div className="Container">
        <Titulo name={"Carrito"} />
        <div className="container-carrito">
          <div className="container-carrito-prods"></div>
          <div className="container-carrito-func"></div>
        </div>
      </div>
    </>
  );
};