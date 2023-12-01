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
    database: 'alquifreev2',
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

app.post('/agregarAlCarrito', (req, res) => {
    const { userId, productId, quantity } = req.body;

    // Primero, verifica si el usuario tiene un carrito existente
    const checkCartQuery = 'SELECT idCarrito FROM carrito WHERE Usuario_idUsuario = ?';
    db.query(checkCartQuery, [userId], (error, results) => {
        if (error) {
            console.error('Error al verificar el carrito:', error);
            res.status(500).json({ message: 'Error al verificar el carrito' });
        } else {
            if (results.length === 0) {
                // Si el usuario no tiene un carrito, crea uno nuevo
                const createCartQuery = 'INSERT INTO carrito (Usuario_idUsuario, Estado) VALUES (?, ?)';
                db.query(createCartQuery, [userId, 'En proceso'], (cartError, cartResult) => {
                    if (cartError) {
                        console.error('Error al crear un nuevo carrito:', cartError);
                        res.status(500).json({ message: 'Error al crear un nuevo carrito' });
                    } else {
                        // Después de crear el carrito, agrega el producto al carrito
                        const cartId = cartResult.insertId;
                        insertProductIntoCart(cartId, productId, quantity, res);
                    }
                });
            } else {
                // Si el usuario ya tiene un carrito, agrega el producto al carrito existente
                const cartId = results[0].idCarrito;
                insertProductIntoCart(cartId, productId, quantity, res);
            }
        }
    });
});

function insertProductIntoCart(cartId, productId, quantity, res) {
    const insertProductQuery = 'INSERT INTO carrito_producto (Carrito_idCarrito, Producto_idProducto, Cantidad) VALUES (?, ?, ?)';
    db.query(insertProductQuery, [cartId, productId, quantity], (insertError, insertResult) => {
        if (insertError) {
            console.error('Error al agregar producto al carrito:', insertError);
            res.status(500).json({ message: 'Error al agregar producto al carrito' });
        } else {
            res.status(200).json({ message: 'Producto agregado al carrito correctamente' });
        }
    });
}


app.get('/productosEnCarrito/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT DISTINCT p.idProducto, p.Descripcion, p.Precio, p.Stock
        FROM carrito_producto cp
        INNER JOIN producto p ON cp.Producto_idProducto = p.idProducto
        INNER JOIN carrito c ON cp.Carrito_idCarrito = c.idCarrito
        WHERE c.Usuario_idUsuario = ?
    `;

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error al obtener productos del carrito:', error);
            res.status(500).json({ message: 'Error al obtener productos del carrito' });
        } else {
            res.status(200).json({ productosEnCarrito: results });
        }
    });
});


app.delete('/eliminarProducto/:userId/:productId', (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    const deleteProductQuery = `DELETE FROM carrito_producto WHERE Carrito_idCarrito = ? AND Producto_idProducto = ?`;
    db.query(deleteProductQuery, [userId, productId], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
        } else {
            res.status(200).json({ message: 'Producto eliminado exitosamente del carrito' });
        }
    });
});

app.post('/guardarCompra', async (req, res) => {
    try {
        const userId = req.body.userId; // Suponiendo que userId es enviado desde el cliente

        // Encontrar el carrito del usuario
        const findCartQuery = 'SELECT idCarrito FROM carrito WHERE Usuario_idUsuario = ?';
        db.query(findCartQuery, [userId], async (cartError, cartResults) => {
            if (cartError) {
                console.error('Error al encontrar el carrito del usuario:', cartError);
                res.status(500).json({ error: 'Error al procesar la solicitud' });
                return;
            }

            if (cartResults.length === 0) {
                res.status(404).json({ error: 'Carrito no encontrado para este usuario' });
                return;
            }

            const carritoId = cartResults[0].idCarrito;

            // Crear un nuevo pedido
            const insertPedidoQuery = 'INSERT INTO pedido (Carrito_idCarrito, Fecha, Monto, Estado) VALUES (?, ?, ?, ?)';
            const currentDate = new Date();
            db.query(insertPedidoQuery, [carritoId, currentDate, 0, 'En proceso'], async (pedidoError, pedidoResult) => {
                if (pedidoError) {
                    console.error('Error al crear un nuevo pedido:', pedidoError);
                    res.status(500).json({ error: 'Error al procesar la solicitud' });
                    return;
                }

                const pedidoId = pedidoResult.insertId; // Obtener el idPedido recién insertado

                // Obtener productos del carrito
                const productosCarritoQuery = 'SELECT * FROM carrito_producto WHERE Carrito_idCarrito = ?';
                db.query(productosCarritoQuery, [carritoId], async (productosError, productosResult) => {
                    if (productosError) {
                        console.error('Error al obtener productos del carrito:', productosError);
                        res.status(500).json({ error: 'Error al procesar la solicitud' });
                        return;
                    }

                    // Calcular el total de la compra
                    let total = req.body.total;

                    // Insertar en la tabla historialcompras utilizando el pedidoId
                    const insertHistorialQuery = 'INSERT INTO historialcompras (Pedido_idPedido, Usuario_idUsuario, Fecha, Monto, Estado) VALUES (?, ?, ?, ?, ?)';
                    db.query(insertHistorialQuery, [pedidoId, userId, currentDate, total, 'Completado'], async (historialError, historialResult) => {
                        if (historialError) {
                            console.error('Error al guardar en historial de compras:', historialError);
                            res.status(500).json({ error: 'Error al procesar la solicitud' });
                            return;
                        }
                        const historialId = historialResult.insertId; // Obtener el ID del historial de compras recién insertado

                        // Respuesta al cliente
                        res.status(200).json({ message: 'Compra guardada en historial de compras correctamente.' });

                        for (const producto of productosResult) {
                            // Insertar en historialcompras_producto
                            const insertHistorialComprasProductoQuery = 'INSERT INTO historialcompras_producto (HistorialCompras_id, Producto_id) VALUES (?, ?)';
                            db.query(
                                insertHistorialComprasProductoQuery,
                                [historialId, producto.Producto_idProducto],
                                (historialError) => {
                                    if (historialError) {
                                        console.error('Error al insertar producto en historialcompras_producto:', historialError);
                                    }
                                }
                            );
                        }
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error al guardar la compra en historial de compras:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
});

app.get('/historialCompras/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT hc.idHistorialCompras, hc.Fecha, hc.Monto, hc.Estado, GROUP_CONCAT(pr.Descripcion) AS Productos
        FROM historialcompras hc
        INNER JOIN historialcompras_producto hcp ON hc.idHistorialCompras = hcp.HistorialCompras_id
        INNER JOIN producto pr ON hcp.Producto_id = pr.idProducto
        WHERE hc.Usuario_idUsuario = ?
        GROUP BY hc.idHistorialCompras
    `;

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error al obtener historial de compras:', error);
            res.status(500).json({ message: 'Error al obtener historial de compras' });
        } else {
            res.status(200).json({ historialCompras: results });
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

