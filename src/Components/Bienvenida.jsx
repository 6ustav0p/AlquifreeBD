import logo from '../img/logo.jpg'

export const Bienvenida = () => {
  return (
    <>
    <div className="bienvenida">
            <div className="bienvenidatexto">
                <h2>Bienvenido a Alquifree!!</h2>
                <p>El lugar donde puedes alquilar lo que necesitas!</p>
            </div>
            <img className="logoimg" src={logo} alt=""></img>
        </div>

    </>
  )
}
