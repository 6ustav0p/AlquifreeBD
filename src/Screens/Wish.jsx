import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/Wishlist.css'; // Asegúrate de tener los estilos para la wishlist si los necesitas
import imgProducto1 from '../productosimg/1.png';
import imgProducto2 from '../productosimg/2.png';
import imgProducto3 from '../productosimg/3.png';
import imgProducto4 from '../productosimg/4.png';
import imgProducto5 from '../productosimg/5.png';
import imgProducto6 from '../productosimg/6.png'
import { Titulo } from '../Components/Titulo';
import Swal from 'sweetalert2';
export const Wish = () => {
    const location = useLocation();
    const usuario = location.state || {};
    const [productosEnWishlist, setProductosEnWishlist] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/wishlist/${usuario.idUsuario}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setProductosEnWishlist(data.wishlist); // Cambio en la asignación de la variable
            })
            .catch(error => console.error('Error:', error));
    }, [usuario.idUsuario]);

    // Dentro del componente funcional Wish

    const eliminarProducto = (productId) => {
        fetch(`http://localhost:3000/wishlist/eliminar`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: usuario.idUsuario,
                productId: productId,
            }),
        })
            .then(response => {
                if (response.ok) {
                    // Actualizar la lista de productos después de eliminar
                    setProductosEnWishlist(productosEnWishlist.filter(producto => producto.idProducto !== productId));
                } else {
                    console.error('Error al eliminar el producto de la wishlist');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const agregarCarrito = (productId) => {
        fetch('http://localhost:3000/agregarAlCarrito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: usuario.idUsuario,
                productId: productId,
                quantity: 1,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Producto agregado al carrito:', data);
                eliminarProducto(productId);
                Swal.fire({
                    title: "Producto agregado al carrito",
                    icon: "success"
                  });
                producto.agregadoAlCarrito = true;
            })
            .catch(error => console.error('Error:', error));
    };


    const imagenesProductos = [imgProducto1, imgProducto2, imgProducto3, imgProducto4, imgProducto5, imgProducto6];

    return (
        <>
            <Titulo name={'WishList'} />
            <div className="container-wishlist">
                <div className="wishlist">
                    {productosEnWishlist.length > 0 ? (
                        productosEnWishlist.map((producto, index) => (
                            <div key={index} className="producto-wishlist">
                                <img src={imagenesProductos[producto.idProducto - 1]} alt={`Producto ${producto.idProducto}`} />
                                <p>{producto.Descripcion}</p>
                                <p>{`Precio: $${producto.Precio}`}</p>
                                <button onClick={() => eliminarProducto(producto.idProducto)}>Quitar</button>
                                <button onClick={() => agregarCarrito(producto.idProducto)}>Agregar al carrito</button>
                            </div>
                        ))
                    ) : (
                        <p className="empty-wishlist">No hay productos en la wishlist</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Wish;
