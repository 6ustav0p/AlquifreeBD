import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import imgProducto1 from '../productosimg/1.png'
import imgProducto2 from '../productosimg/2.png'
import imgProducto3 from '../productosimg/3.png'
import imgProducto4 from '../productosimg/4.png'
import imgProducto5 from '../productosimg/5.png'
import imgProducto6 from '../productosimg/6.png'
import Swal from 'sweetalert2';

export const Publicaciones = ({ usuario }) => {
    const [productos, setProductos] = useState([]);
  
    const imagenesProductos = [imgProducto1, imgProducto2, imgProducto3, imgProducto4, imgProducto5,imgProducto6];

    useEffect(() => {
        fetch('http://localhost:3000/productos')
            .then(response => response.json())
            .then(data => setProductos(data))
            .catch(error => console.error('Error:', error));
    }, []);

    // Resto de tu código

    const agregarAlCarrito = (producto) => {

        
            fetch('http://localhost:3000/agregarAlCarrito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: usuario.idUsuario,
                    productId: producto.idProducto,
                    quantity: 1,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    // Aquí puedes actualizar la interfaz si es necesario o manejar la respuesta del backend
                    console.log('Producto agregado al carrito:', data);
                    // Deshabilitar el botón después de agregar al carrito
                    Swal.fire({
                        title: "Producto agregado al carrito",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton:false
                      });
                    producto.agregadoAlCarrito = true;
                })
                .catch(error => console.error('Error:', error));
    };

    const agregarALaWishlist = (producto) => {
        fetch('http://localhost:3000/wishlist/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: usuario.idUsuario,
                productId: producto.idProducto,
            }),
        })
            .then(response => response.json())
            .then(data => {
                // Aquí puedes actualizar la interfaz si es necesario o manejar la respuesta del backend
                console.log('Producto agregado a la wishlist:', data);
                // Deshabilitar el botón después de agregar a la wishlist
                Swal.fire({
                    title: "Producto agregado a la wishlist",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton:false
                  });
                producto.agregadoALaWishlist = true;
            })
            .catch(error => console.error('Error:', error));
    };



    return (
        <>
            <div className="publicaciones">
                <h1>Elige aquí lo que deseas alquilar ⬇</h1>
                <div className="publicacioneslista">
                    {productos.map((producto) => (
                        <div className="publicacion" key={producto.idProducto}>
                            <img src={imagenesProductos[producto.idProducto - 1]} alt={`Producto ${producto.idProducto}`} />
                            <div className="detalleproducto">
                                <p className="productonombre">{producto.Descripcion}</p>
                                <p>${producto.Precio}/día</p>
                                <p>({producto.Stock} unidades)</p>
                                <div className='publicacionBtn'>
                                    <button
                                        onClick={() => agregarAlCarrito(producto)}
                                        disabled={producto.agregadoAlCarrito}
                                    >
                                        Alquilar
                                    </button>
                                    <button
                                        onClick={() => agregarALaWishlist(producto)}
                                        disabled={producto.agregadoALaWishlist}
                                    >
                                        Guardar
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
