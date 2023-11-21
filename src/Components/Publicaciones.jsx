import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import imgProducto1 from '../productosimg/1.png'
import imgProducto2 from '../productosimg/2.png'
import imgProducto3 from '../productosimg/3.png'
import imgProducto4 from '../productosimg/4.png'
import imgProducto5 from '../productosimg/5.png'

export const Publicaciones = () => {

    const [productos, setProductos] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const navigate = useNavigate();


    const imagenesProductos = [imgProducto1, imgProducto2, imgProducto3, imgProducto4, imgProducto5];

    useEffect(() => {
        fetch('http://localhost:3000/productos')
            .then(response => response.json())
            .then(data => setProductos(data))
            .catch(error => console.error('Error:', error));
    }, []);
    const agregarAlCarrito = (producto) => {
        setProductosSeleccionados([...productosSeleccionados, producto]);
    };

    const handleIrACarrito = () => {
        navigate('/carrito', { state: { productosSeleccionados } });
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
                                <button onClick={() => agregarAlCarrito(producto)}>Alquilar</button>
                                <button id="guardar">Guardar</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleIrACarrito}>Ir al carrito</button>
            </div>
        </>
    )
}
