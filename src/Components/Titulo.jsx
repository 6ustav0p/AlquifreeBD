import bicicleta from '../img/bicicleta.png';
import carro from '../img/carro.png';
import sillas from '../img/sillas.png';
import evento from '../img/evento.png';
import ropa from '../img/ropa.png';
import lavadora from '../img/lavadora.png';

export const Titulo = () => {
    return (
        <>
            <div className='titulopagina'>
                <img src={bicicleta} className="logo" />
                <img src={carro} className="logo" />
                <img src={sillas} className="logo" />
                <h1>Alquifree</h1>
                <img src={evento} className="logo" />
                <img src={ropa} className="logo" />
                <img src={lavadora} className="logo" />
            </div>

        </>
    )
}
