import React, { useState, useEffect } from 'react';
import { Titulo } from '../Components/Titulo';
import '../Styles/registro.css'
import { Link, useNavigate } from "react-router-dom";
export const Registro = () => {
  const [tipoVia, setTipoVia] = useState('');
  const navigate = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
  const [InfoVia, setInfoVia] = useState('');
  const [numero, setNumero] = useState('');
  const [usuario, setUsuario] = useState({
    correo: '',
    telefono: '',
    contrasena: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    ciudadId: ''
  });

  useEffect(() => {
    fetch('http://localhost:3000/departamentos')
      .then((response) => response.json())
      .then((data) => setDepartamentos(data))
      .catch((error) => console.error('Error fetching departamentos:', error));
  }, []);

  // Obtener la lista de ciudades dado un departamento seleccionado
  const handleDepartamentoChange = (e) => {
    const departamentoId = e.target.value;
    fetch(`http://localhost:3000/ciudades/${departamentoId}`)
      .then((response) => response.json())
      .then((data) => setCiudades(data))
      .catch((error) => console.error('Error fetching ciudades:', error));
  };


  // Función para crear una nueva dirección
  const handleCrearDireccion = async () => {
    try {
      const response = await fetch('http://localhost:3000/direccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ciudadId: ciudadSeleccionada,
          InfoVia: tipoVia+ " "+ InfoVia,
          numero: numero,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Error al crear la dirección');
      }
    } catch (error) {
      console.error('Error creando dirección:', error);
      throw error;
    }
  };

  const handleCrearUsuario = async (event) => {
    event.preventDefault();

    try {
      const direccionData = await handleCrearDireccion(); // Crear la dirección primero

      // Agregar la direcciónId al objeto usuario
      const usuarioConDireccion = { ...usuario, direccionId: direccionData.insertId };

      const response = await fetch('http://localhost:3000/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioConDireccion), // Enviar el usuario con la direcciónId
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Usuario creado correctamente:', data);
        navigate("/login");
      } else {
        console.error('Error creando usuario:', response.statusText);
      }
    } catch (error) {
      console.error('Error creando usuario:', error);
    }
  };



  // Función para manejar cambios en los campos del usuario
  const handleInputChange = event => {
    const { name, value } = event.target;
    setUsuario({ ...usuario, [name]: value });
  };

  return (
    <>
      <Titulo name={'Registro'} />
      <div className='registro-content'>
        <form className='registro-form' onSubmit={handleCrearUsuario}>
          <input type="text" name="correo" placeholder="Correo" onChange={handleInputChange} autoComplete='off' className='registro-input correo-input' />
          <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleInputChange} autoComplete='off' className='registro-input contrasena-input' />
          <input type="text" name="telefono" placeholder="Teléfono" onChange={handleInputChange} autoComplete='off' className='registro-input telefono-input' />
          <input type="text" name="primerNombre" placeholder="Primer Nombre" onChange={handleInputChange} autoComplete='off' className='registro-input primer-nombre-input' />
          <input type="text" name="segundoNombre" placeholder="Segundo Nombre" onChange={handleInputChange} autoComplete='off' className='registro-input segundo-nombre-input' />
          <input type="text" name="primerApellido" placeholder="Primer Apellido" onChange={handleInputChange} autoComplete='off' className='registro-input primer-apellido-input' />
          <input type="text" name="segundoApellido" placeholder="Segundo Apellido" onChange={handleInputChange} autoComplete='off' className='registro-input segundo-apellido-input' />

          <label className='registro-label'>Departamento:</label>
          <select onChange={handleDepartamentoChange} className='registro-select departamento-select'>
            <option value="">Selecciona un departamento</option>
            {departamentos.map((departamento) => (
              <option key={departamento.idDepartamento} value={departamento.idDepartamento}>
                {departamento.Nombredpto}
              </option>
            ))}
          </select>

          <label className='registro-label'>Ciudad:</label>
          <select onChange={(e) => setCiudadSeleccionada(e.target.value)} className='registro-select ciudad-select'>
            <option value="">Selecciona una ciudad</option>
            {ciudades.map((ciudad) => (
              <option key={ciudad.idCiudad} value={ciudad.idCiudad}>
                {ciudad.Nombre}
              </option>
            ))}
          </select>

          <label className='registro-label'>Tipo de vía:</label>
          <select value={tipoVia} onChange={(e) => setTipoVia(e.target.value)} className='registro-select tipo-via-select'>
            <option value="">Selecciona un tipo de vía</option>
            <option value="Calle">Calle</option>
            <option value="Carrera">Carrera</option>
            <option value="Avenida">Avenida</option>
            {/* Agrega más opciones según sea necesario */}
          </select>

          <label className='registro-label'>Especifica direccion:</label>
          <input
            type="text"
            value={InfoVia}
            onChange={(e) => setInfoVia(e.target.value)} // Concatena el tipo de vía con el nombre de la calle
            className='registro-input calle-input'
          />

          <label className='registro-label'>Número:</label>
          <input type="number" value={numero} onChange={(e) => setNumero(e.target.value)} className='registro-input numero-input' />
          <button onClick={handleCrearUsuario} className='registro-button'>Crear usuario</button>
        </form>

      </div>
    </>
  );
};
