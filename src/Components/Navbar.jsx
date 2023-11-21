import { Link } from "react-router-dom";
import React from 'react'
import Cart from '../img/cart.png'
import Perfil from '../img/perfil.png'
import Wish from '../img/wish.png'
export const Navbar = ({ usuario }) => {
    return (

        <>
            <nav className="navbar">
                <ul className="listanavbar">
                    <li id="hovernav">
                        <Link to='/'>Inicio</Link>
                    </li>
                    <li id="hovernav">
                        <Link to='/'>Publicar</Link>
                    </li>
                    <li>
                        <div class="search-container">
                            <input type="text" className="search-input" name="q" placeholder="🔎 Buscar..." autoComplete="off" />
                            <button type="submit" className="search-button">Buscar</button>
                        </div>
                    </li>
                    <li id="hovernav">
                        <div className="categorias">
                            <ul>
                                <li>
                                    <p>Categorias</p>
                                    <ul>
                                        <li><a href="">Lugares</a></li>
                                        <li><a href="">Vehiculos</a></li>
                                        <li><a href="">Electrodomesticos</a></li>
                                        <li><a href="">Ropa para eventos</a></li>
                                        <li><a href="">Mobiliario</a></li>
                                        <li><a href="">Otro...</a></li>
                                    </ul>
                                </li>

                            </ul>
                        </div>
                    </li>
                    <li>
                        <div className="imgNav">
                            <Link to='/carrito'><img className="cartimg" src={Cart}></img></Link>

                            <Link to='wishlist'><img src={Wish} className="cartimg" /></Link>

                            <Link
                                to='/perfil'>  <img className="perfilimg" src={Perfil}>
                                </img></Link>
                        </div>

                    </li>
                    <li>
                        {usuario ? (
                            <Link to='/' className="sesion">{usuario.PrimerNombre}</Link>
                        ) : (
                            <Link to='/login' className="sesion">Login</Link>
                        )}

                    </li>
                </ul>
            </nav>

        </>


    )
}
