import React from 'react'
import Email from '../img/email.png'
import Telefono from '../img/telefono.png'
import Facebook from '../img/facebook.png'
import X from '../img/x.png'
import Instagram from '../img/instagram.png'
import Youtube from '../img/youtube.png'
export const Footer = () => {
  return (
    <>
       <div className="footer">
           
           <div className="contacto">
               <h1>Contáctanos</h1>
                   <div id="contactodato">
                       <img src={Email} alt=""></img>
                       <p>soporte@alquifree.com</p>
                   </div>
                   <div id="contactodato">
                       <img src={Telefono} alt=""></img>
                       <p> +57 3337778866</p>
                   </div>
               </div>

         
           <div className="redes">
               <h1>Siguenos en nuestras redes</h1>
               <div className="red">
                   <img src={Facebook} alt=""></img>
                   <img src={X} alt=""></img>
                   <img src={Instagram} alt=""></img>
                   <img src={Youtube} alt=""></img>
               </div>
              
           </div>

       </div>
    </>
  )
}
