import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "../Styles/carrito.css";
import { Titulo } from '../Components/Titulo';
import imgProducto1 from '../productosimg/1.png'
import imgProducto2 from '../productosimg/2.png'
import imgProducto3 from '../productosimg/3.png'
import imgProducto4 from '../productosimg/4.png'
import imgProducto5 from '../productosimg/5.png'
export const Carrito = () => {
  const location = useLocation();
  const usuario = location.state || {};
  const [productosEnCarrito, setProductosEnCarrito] = useState([]);

  const vaciarCarrito = () => {
    fetch(`http://localhost:3000/vaciarCarrito/${usuario.idUsuario}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        setProductosEnCarrito([]);
        // Manejo adicional según sea necesario
      })
      .catch(error => console.error('Error:', error));
  };

  const imagenesProductos = [imgProducto1, imgProducto2, imgProducto3, imgProducto4, imgProducto5];
  useEffect(() => {
    // Realizar la solicitud al backend para obtener los productos del carrito
    fetch(`http://localhost:3000/productosEnCarrito/${usuario.idUsuario}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setProductosEnCarrito(data.productosEnCarrito);
      })
      .catch(error => console.error('Error:', error));

  }, [usuario.idUsuario]);
  const calcularTotal = () => {
    let total = 0;
    productosEnCarrito.forEach(producto => {
      total += producto.Precio;
    });
    return total;
  };
  return (
    <>
      <div className="Container">
        <Titulo name={"Carrito"} />

        <div className='container-carrito'>
          <div className="container-carrito-prods">
            <h1>Carrito {'(' + productosEnCarrito.length + ' prod.)'}</h1>
            {productosEnCarrito.length > 0 ? (

              productosEnCarrito.map((producto, index) => (
                <div key={index}>
                  <div >
                    <img src={imagenesProductos[producto.idProducto - 1]} />
                    <p>{producto.Descripcion}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay productos en el carrito</p>
            )}

          </div>

          <div className="container-carrito-func">
            <button onClick={vaciarCarrito}>Vaciar Carrito</button>
            <h1>Productos</h1>
            {productosEnCarrito.length > 0 ? (


              productosEnCarrito.map((producto, index) => (
                <div key={index}>
                  <div >
                    <p>{producto.Descripcion} - {producto.Precio}</p>
                  </div>
                </div>

              ))
            ) : (<p>No hay productos en el carrito</p>)}
            <p>Total: {calcularTotal()}</p>
          </div>
        </div>
      </div>
    </>
  );
};

