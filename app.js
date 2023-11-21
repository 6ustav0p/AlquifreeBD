import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';



const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'alquifree',
  port: 3306
});

// Conectar a la base de datos
db.connect(err => {
  if (err) { throw err; }
  console.log('Conectado a la base de datos');
});

app.get('/usuario/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT u.*, 
                        CONCAT(u.PrimerNombre, ' ', u.SegundoNombre, ' ', u.PrimerApellido, ' ', u.SegundoApellido) AS NombreCompleto,
                        d.Calle, 
                        d.Numero,
                        ci.Nombre AS Ciudad,
                        dp.Nombredpto AS Departamento
                FROM usuario u
                JOIN direccion d ON u.Direccion_idDireccion = d.idDireccion
                JOIN ciudad ci ON d.Ciudad_idCiudad = ci.idCiudad
                JOIN departamento dp ON ci.Departamento_idDepartamento = dp.idDepartamento
                WHERE u.idUsuario = ?`;

    db.query(sql, [id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error en la consulta de la base de datos' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            res.json(results[0]);
        }
    });
});



app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, proporciona un correo y contraseña' });
    }
  
    // Consulta a la base de datos para verificar las credenciales del usuario
    db.query('SELECT * FROM usuario WHERE Correo = ? AND Contraseña = ?', [email, password], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error al buscar en la base de datos' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
  
      const userId = results[0].idUsuario; // Suponiendo que el ID del usuario está en la posición cero del resultado

      // Usuario autenticado, enviar una respuesta exitosa con el ID del usuario
      return res.status(200).json({ userId });
    });
  });
  
  app.get('/productos', (req, res) => {
    const sql = `SELECT * FROM producto`;

    db.query(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error en la consulta de la base de datos' });
            return;
        }

        res.json(results);
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

