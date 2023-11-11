import React from 'react'
import Cart from '../img/cart.png'
import Perfil from '../img/perfil.png'

export const Navbar = () => {
    return (
        <>
            <nav className="navbar">
                <ul className="listanavbar">
                    <li id="hovernav"> <a id="links" href="#">Inicio</a></li>
                    <li id="hovernav"> <a id="links" href="">Publicar</a></li>
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
                        <div className="perfil">
                            <img className="cartimg" src={Cart}></img>
                            <img className="perfilimg" src={Perfil}></img>
                                <p>Gustavo Padilla Ruiz</p>
                        </div>
                    </li>
                </ul>
            </nav>
        </>
    )
}
