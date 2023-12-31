import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/historial.css';
import { Titulo } from '../Components/Titulo';

export const Historial = () => {
    const location = useLocation();
    const usuario = location.state || {};
    const [historialCompras, setHistorialCompras] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/historialCompras/${usuario.idUsuario}`)
            .then(response => response.json())
            .then(data => {
                setHistorialCompras(data.historialCompras);
                console.log(data.historialCompras);
            })
            .catch(error => {
                console.error('Error al obtener el historial de compras:', error);
            });
    }, [usuario.idUsuario]);

    return (
        <>
            <Titulo name={'Historial'} />
            <div className="historial-container">
                <h1 className="historial-title">Historial de Compras de {usuario.NombreCompleto}</h1>
                <table className="historial-table">
                    <thead>
                        <tr>
                            <th className="table-header">Fecha</th>
                            <th className="table-header">Monto</th>
                            <th className="table-header">Estado</th>
                            <th className="table-header">Productos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historialCompras.map(compra => (
                            <tr key={compra.idHistorialCompras} className="table-row">
                                <td className="table-data">{compra.Fecha}</td>
                                <td className="table-data">{compra.Monto}</td>
                                <td className="table-data">{compra.Estado}</td>
                                <td className="table-data">
                                    {compra.Productos && compra.Productos.split(',').map(productoCantidad => {
                                        const descripcion = productoCantidad.slice(0, -1); // Extraer la descripción
                                        const cantidad = productoCantidad.slice(-1); // Extraer la cantidad (suponiendo que está al final)

                                        return (
                                            <span key={productoCantidad}>
                                                {descripcion.trim()} ({cantidad.trim()}),{' '}
                                            </span>
                                        );
                                    })}
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </>
    );
};
