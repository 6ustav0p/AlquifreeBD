import { useLocation } from 'react-router-dom';
import React from 'react'
export const Perfil = ({ usuario }) => {

  return (
    <>
      <h1>{usuario.Telefono}</h1>
    </>
  )
}
