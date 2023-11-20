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

// Definir rutas de la API
app.get('/productos', (req, res) => {
  // Consulta para obtener todos los productos
});

app.post('/carrito', (req, res) => {
  // Consulta para añadir un producto al carrito
});

// ...más rutas para manejar otras operaciones

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

