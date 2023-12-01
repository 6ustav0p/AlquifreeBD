import React, { useState, useEffect } from 'react';

export const ProductDetails = ({ productId }) => {
    const [productName, setProductName] = useState('');

    useEffect(() => {
        // Hacer la solicitud al servidor para obtener los detalles del producto
        fetch(`http://localhost:3000/productos/${productId}`)
            .then(response => response.json())
            .then(data => {
                // Aquí se asume que el servidor devuelve un objeto con el nombre del producto
                setProductName(data.nombre);
            })
            .catch(error => {
                console.error('Error al obtener detalles del producto:', error);
            });
    }, [productId]);

    return (
        <span>{productName}</span>
    );
};
