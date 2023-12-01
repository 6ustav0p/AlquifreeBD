import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../Styles/carrito.css';
import { Titulo } from '../Components/Titulo';
import imgProducto1 from '../productosimg/1.png';
import imgProducto2 from '../productosimg/2.png';
import imgProducto3 from '../productosimg/3.png';
import imgProducto4 from '../productosimg/4.png';
import imgProducto5 from '../productosimg/5.png';

export const Carrito = () => {
  const location = useLocation();
  const usuario = location.state || {};
  const [productosEnCarrito, setProductosEnCarrito] = useState([]);

  const guardarCompra = async () => {
    try {
      const userId = usuario.idUsuario;
      let total = 0;
      productosEnCarrito.forEach(producto => {
        if (typeof producto.Precio === 'number') {
          total += producto.Precio;
        }
      });
      // Obtener los productos actuales en el carrito para realizar la compra
      const response = await fetch(`http://localhost:3000/guardarCompra`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId , total}),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la compra');
      }

      // Vaciar el carrito después de guardar la compra exitosamente
      setProductosEnCarrito([]);
      vaciarCarrito(userId);
    } catch (error) {
      console.error('Error al guardar la compra:', error);
    }
  };


  const vaciarCarrito = (userId) => {
    fetch(`http://localhost:3000/productosEnCarrito/${userId}`)
      .then(response => response.json())
      .then(data => {
        const productosEnCarrito = data.productosEnCarrito;
        const promises = productosEnCarrito.map(producto =>
          eliminarProducto(producto.idProducto)
        );
        Promise.all(promises)
          .then(() => setProductosEnCarrito([])) // Vaciar carrito al completar todas las eliminaciones
          .catch(error => console.error('Error:', error));
      })
      .catch(error => console.error('Error:', error));
  };
  const eliminarProducto = async (idProducto) => {
    try {
      const response = await fetch(`http://localhost:3000/eliminarProducto/${usuario.idUsuario}/${idProducto}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto del carrito');
      }

      // Actualizar productos en carrito después de eliminar el producto
      const updatedProducts = await fetch(`http://localhost:3000/productosEnCarrito/${usuario.idUsuario}`)
        .then(response => response.json())
        .then(data => data.productosEnCarrito)
        .catch(error => {
          console.error('Error obteniendo productos en el carrito:', error);
          return [];
        });

      // Actualizar el estado con los nuevos productos en el carrito
      setProductosEnCarrito(updatedProducts);
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Ocurrió un error al eliminar el producto del carrito');
    }
  };


  useEffect(() => {
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
      if (typeof producto.Precio === 'number') {
        total += producto.Precio;
      }
    });
    return total;
  };
  

  const imagenesProductos = [imgProducto1, imgProducto2, imgProducto3, imgProducto4, imgProducto5];

  return (
    <div className="container-carrito">
      <Titulo name={'Carrito'} />
      <div className="carrito">
        <div className="carrito-productos">
          <h1>Carrito ({productosEnCarrito.length} productos)</h1>
          {productosEnCarrito.length > 0 ? (
            productosEnCarrito.map((producto, index) => (
              <div key={index} className="producto">
                <img src={imagenesProductos[producto.idProducto - 1]} alt={`Producto ${producto.idProducto}`} />
                <div className="producto-info">
                  <p className="producto-nombre">{producto.Descripcion}</p>
                  <p className="producto-precio">{`Precio: $${producto.Precio}`}</p>
                  <button onClick={() => eliminarProducto(producto.idProducto)} className="btn-eliminar">
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-cart">No hay productos en el carrito</p>
          )}
        </div>
        <div className="carrito-resumen">
          <button onClick={() => vaciarCarrito(usuario.idUsuario)} className="btn-vaciar">
            Vaciar Carrito
          </button>
          <h1>Resumen de Compra</h1>
          {productosEnCarrito.length > 0 ? (
            productosEnCarrito.map((producto, index) => (
              <div key={index} className="producto-resumen">
                <p>{producto.Descripcion}</p>
                <p>{`Precio: $${producto.Precio}`}</p>
              </div>
            ))
          ) : (
            <p className="empty-cart">No hay productos en el carrito</p>
          )}
          <p className="total">Total: ${calcularTotal()}</p>
          <button onClick={() => guardarCompra()} className="btn-guardar-compra">
            Guardar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
