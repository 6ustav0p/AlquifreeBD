import { Titulo } from "./Components/Titulo"
import { Navbar } from "./Components/Navbar"
import { Bienvenida } from "./Components/Bienvenida"
import { Publicaciones } from "./Components/Publicaciones"
import { Footer } from "./Components/Footer"
function App() {

  return (
    <>
      <div className="container">
        <Titulo />
        <div className="header">
          <Navbar />
        </div>
        <Bienvenida/>
        <Publicaciones/>
        <Footer/>

      </div>

    </>
  )
}

export default App
