// Importa BrowserRouter y otros componentes necesarios
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from "./Screens/Login";
import { Carrito } from "./Screens/Carrito";
import { Perfil } from "./Screens/Perfil";
import { Home } from "./Screens/Home";
import { Wish } from "./Screens/Wish";
import { Historial } from "./Screens/Historial";

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/wishlist" element={<Wish/>}/>
        <Route path="/historial" element={<Historial/>}/>
      </Routes>
   
    </Router>
  );
}

export default App

