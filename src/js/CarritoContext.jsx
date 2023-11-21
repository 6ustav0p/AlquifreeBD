// CarritoContext.js

import React, { createContext, useContext, useState } from 'react';

// Creamos el contexto del carrito
const CarritoContext = createContext();

// Hook personalizado para usar el contexto del carrito
export const useCarritoContext = () => {
  return useContext(CarritoContext);
};

// Componente proveedor del contexto del carrito
export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => [...prevCarrito, producto]);
  };
  

  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = (idProducto) => {
    const nuevoCarrito = carrito.filter((producto) => producto.id !== idProducto);
    setCarrito(nuevoCarrito);
  };

  // Valor que estará disponible en el contexto
  const carritoContextValue = {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
  };

  return (
    <CarritoContext.Provider value={carritoContextValue}>
      {children}
    </CarritoContext.Provider>
  );
};
