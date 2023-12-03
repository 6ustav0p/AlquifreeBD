
import React, { useState, useEffect } from 'react';
import '../Styles/wishlist.css'; // Asegúrate de tener un archivo de estilos similar al de tu historial

export const Wish = () => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId'); 
        if (userId) {
            fetch(`/wishlist/${userId}`)
                .then(response => response.json())
                .then(data => setWishlist(data))
                .catch(error => console.error('Error al cargar la lista de deseos:', error));
        }
    }, []);

    const eliminarDeWishlist = (productId) => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetch(`/wishlist/${userId}/${productId}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(() => {
                    setWishlist(wishlist.filter(item => item.idProducto !== productId));
                })
                .catch(error => console.error('Error al eliminar producto de la lista de deseos:', error));
        }
    };

    return (
        <div className="wishlist-container">
            <h2>Mi Lista de Deseos</h2>
            <table className="wishlist-table">
                <thead>
                    <tr>
                        <th className="table-header">Productos</th>
                        <th className="table-header">Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {wishlist.map((producto) => (
                        <tr key={producto.idProducto} className="table-row">
                            <td className="table-data">{producto.Descripcion}</td>
                            <td className="table-data">
                                <button onClick={() => eliminarDeWishlist(producto.idProducto)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

