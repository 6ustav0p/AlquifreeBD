import bicicleta from '../productosimg/bicicleta1.png'
import LugarEvento from '../productosimg/lugarevento.jpg'
import Carro from '../productosimg/carro1.jpeg'

export const Publicaciones = () => {
  return (
    <>
    
    <div className="publicaciones">
            <h1>Elige aqui lo que deseas alquilar ⬇</h1>
            <div className="publicacioneslista">
                <div className="publicacion">
                    <img src={bicicleta} alt=""></img>
                    <div className="detalleproducto">
                        <p className="productonombre">Bicicleta raulxav 2022</p>
                        <p>$5000/dia</p>
                        <p>(2 unidades)</p>
                    </div>

                </div>
                <div className="publicacion">
                    <img src={LugarEvento} alt=""></img>
                    <div className="detalleproducto">
                        <p className="productonombre">Lugar para quinceañero</p>
                        <p>$35000/dia</p>
                        <p>(1 unidad)</p>
                    </div>
                </div>
                <div className="publicacion">
                    <img src={Carro} alt=""></img>
                    <div className="detalleproducto">
                        <p className="productonombre">Carro kia</p>
                        <p>$200k/semana</p>
                        <p>(2 unidades)</p>
                    </div>
                </div>
                <div className="publicacion">
                    <img src="productosimg/bicicleta2.png" alt=""></img>
                    <div className="detalleproducto">
                        <p className="productonombre">Bicicleta smart 950 </p>
                        <p>$100k/mes</p>
                        <p>(3 unidades)</p>
                    </div>
                </div>
                <div className="publicacion">
                    <img src="productosimg/motocross.png" alt=""></img>
                    <div className="detalleproducto">
                        <p className="productonombre">Moto cross</p>
                        <p>$50000/dia</p>
                        <p>(10 unidades)</p>
                    </div>
                </div>
                <div className="publicacion">
                    <img src="productosimg/ropanovia.png" alt=""></img>
                    <div className="detalleproducto">
                        <p className="productonombre">Vestido para mujer</p>
                        <p>$250k/semana</p>
                        <p>(8 unidades)</p>
                    </div>
                </div>
                <div className="publicacion">
                    <img src="productosimg/trajenovio.jpg" alt=""></img>
                    <div className="detalleproducto">
                        <p className="productonombre">Traje de hombre</p>
                        <p>$150k/semana</p>
                        <p>(14 unidades)</p>
                    </div>
                </div>
                <div className="publicacion">
                    <img src="productosimg/carro2.png" alt=""></img>
                    <div className="detalleproducto">
                        <p className="productonombre">Carro chevrolet</p>
                        <p>$1.2M/mes</p>
                        <p>(2 unidades)</p>
                    </div>
                </div>
                <div className="publicacion">
                    <img src="productosimg/silla.jpg" alt=""></img>
                    <div className="detalleproducto">
                        <p className="productonombre">Sillas para eventos</p>
                        <p>$1000/dia</p>
                        <p>(400 unidades)</p>
                    </div>
                </div>
            </div>

        </div>

    </>
  )
}
