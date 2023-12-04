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
    database: 'alquifreev3',
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
        const nombre = results[0].PrimerNombre
        // Usuario autenticado, enviar una respuesta exitosa con el ID del usuario
        return res.status(200).json({ userId, nombre });
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

app.put('/actualizarStock/:productId', (req, res) => {
    const productId = req.params.productId;
    const cantidadComprada = req.body.cantidadComprada;
  
    // Actualizar el stock en tu base de datos
    const updateStockQuery = 'UPDATE producto SET Stock = Stock - ? WHERE idProducto = ?';
    db.query(updateStockQuery, [cantidadComprada, productId], (error, results) => {
      if (error) {
        console.error('Error al actualizar el stock del producto:', error);
        res.status(500).json({ error: 'Error al actualizar el stock del producto' });
      } else {
        res.status(200).json({ message: 'Stock del producto actualizado correctamente' });
      }
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
        SELECT DISTINCT p.idProducto, p.Descripcion, p.Precio, p.Stock, cp.Cantidad
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

app.put('/actualizarCantidad', (req, res) => {
    const { userId, productId, nuevaCantidad } = req.body;
  
    const updateQuantityQuery = 'UPDATE carrito_producto SET Cantidad = ? WHERE Carrito_idCarrito = (SELECT idCarrito FROM carrito WHERE Usuario_idUsuario = ?) AND Producto_idProducto = ?';
    
    db.query(updateQuantityQuery, [nuevaCantidad, userId, productId], (error, results) => {
      if (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
      } else {
        res.status(200).json({ message: 'Cantidad del producto en el carrito actualizada correctamente' });
      }
    });
  });
  

app.delete('/eliminarProducto/:userId/:productId', (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    // Primero, busca el id del carrito del usuario
    const getCartIdQuery = `SELECT idCarrito FROM carrito WHERE Usuario_idUsuario = ?`;
    db.query(getCartIdQuery, [userId], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error al buscar el carrito del usuario' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'El usuario no tiene un carrito asociado' });
            } else {
                const cartId = results[0].idCarrito;

                // Una vez obtenido el id del carrito, procede a eliminar el producto
                const deleteProductQuery = `DELETE FROM carrito_producto WHERE Carrito_idCarrito = ? AND Producto_idProducto = ?`;
                db.query(deleteProductQuery, [cartId, productId], (error, deleteResults) => {
                    if (error) {
                        res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
                    } else {
                        if (deleteResults.affectedRows === 0) {
                            res.status(404).json({ message: 'El producto no se encontró en el carrito' });
                        } else {
                            res.status(200).json({ message: 'Producto eliminado exitosamente del carrito' });
                        }
                    }
                });
            }
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
                            const insertHistorialComprasProductoQuery = 'INSERT INTO historialcompras_producto (HistorialCompras_id, Producto_id, Cantidad) VALUES (?, ?, ?)';
                            db.query(
                                insertHistorialComprasProductoQuery,
                                [historialId, producto.Producto_idProducto, producto.Cantidad],
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
        SELECT hc.idHistorialCompras, hc.Fecha, hc.Monto, hc.Estado,  GROUP_CONCAT(pr.Descripcion , hcp.Cantidad) AS Productos
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

app.post('/wishlist/agregar', (req, res) => {
    const { userId, productId } = req.body;

    // Verificar si el usuario tiene una wishlist existente
    const checkWishlistQuery = 'SELECT idWishlist FROM wishlist WHERE Usuario_idUsuario = ?';
    db.query(checkWishlistQuery, [userId], (error, results) => {
        if (error) {
            console.error('Error al verificar la wishlist:', error);
            res.status(500).json({ message: 'Error al verificar la wishlist' });
        } else {
            if (results.length === 0) {
                // Si el usuario no tiene una wishlist, crear una nueva
                const createWishlistQuery = 'INSERT INTO wishlist (Usuario_idUsuario) VALUES (?)';
                db.query(createWishlistQuery, [userId], (wishlistError, wishlistResult) => {
                    if (wishlistError) {
                        console.error('Error al crear una nueva wishlist:', wishlistError);
                        res.status(500).json({ message: 'Error al crear una nueva wishlist' });
                    } else {
                        // Después de crear la wishlist, agregar el producto a wishlist_producto
                        const wishlistId = wishlistResult.insertId;
                        insertProductIntoWishlist(wishlistId, productId, res);
                    }
                });
            } else {
                const wishlistId = results[0].idWishlist;
                insertProductIntoWishlist(wishlistId, productId, res);
            }
        }
    });
});

function insertProductIntoWishlist(wishlistId, productId, res) {
    // Verificar si el producto ya está en la wishlist
    const checkProductQuery = 'SELECT * FROM wishlist_producto WHERE Wishlist_idWishlist = ? AND Producto_idProducto = ?';
    db.query(checkProductQuery, [wishlistId, productId], (checkError, checkResults) => {
        if (checkError) {
            console.error('Error al verificar el producto en la wishlist:', checkError);
            res.status(500).json({ message: 'Error al verificar el producto en la wishlist' });
        } else {
            if (checkResults.length > 0) {
                // Si el producto ya está en la wishlist, devolver un mensaje indicando la duplicación
                res.status(400).json({ message: 'El producto ya está en la wishlist' });
            } else {
                // Si el producto no está en la wishlist, proceder a insertarlo
                const insertProductQuery = 'INSERT INTO wishlist_producto (Wishlist_idWishlist, Producto_idProducto) VALUES (?, ?)';
                db.query(insertProductQuery, [wishlistId, productId], (insertError, insertResult) => {
                    if (insertError) {
                        console.error('Error al agregar producto a la wishlist:', insertError);
                        res.status(500).json({ message: 'Error al agregar producto a la wishlist' });
                    } else {
                        res.status(200).json({ message: 'Producto agregado a la wishlist correctamente' });
                    }
                });
            }
        }
    });
}


app.get('/wishlist/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT p.idProducto, p.Descripcion, p.Precio, p.Stock
        FROM wishlist w
        INNER JOIN wishlist_producto wp ON w.idWishlist = wp.Wishlist_idWishlist
        INNER JOIN producto p ON wp.Producto_idProducto = p.idProducto
        WHERE w.Usuario_idUsuario = ?
    `;

    db.query(query, [userId], (error, wishlistItems) => {
        if (error) {
            console.error('Error al obtener la wishlist:', error);
            res.status(500).json({ message: 'Error al obtener la wishlist' });
        } else {
            res.status(200).json({ wishlist: wishlistItems });
        }
    });
});

app.delete('/wishlist/eliminar', (req, res) => {
    const { userId, productId } = req.body;

    // Validar si el producto está en la wishlist del usuario
    const checkProductQuery = 'SELECT Wishlist_idWishlist FROM wishlist_producto WHERE Wishlist_idWishlist = (SELECT idWishlist FROM wishlist WHERE Usuario_idUsuario = ?) AND Producto_idProducto = ?';
    db.query(checkProductQuery, [userId, productId], (error, results) => {
        if (error) {
            console.error('Error al verificar el producto en la wishlist:', error);
            res.status(500).json({ message: 'Error al verificar el producto en la wishlist' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'El producto no está en la wishlist del usuario' });
            } else {
                const wishlistId = results[0].Wishlist_idWishlist;
                // Eliminar el producto de wishlist_producto
                const deleteProductQuery = 'DELETE FROM wishlist_producto WHERE Wishlist_idWishlist = ? AND Producto_idProducto = ?';
                db.query(deleteProductQuery, [wishlistId, productId], (deleteError, deleteResult) => {
                    if (deleteError) {
                        console.error('Error al eliminar el producto de la wishlist:', deleteError);
                        res.status(500).json({ message: 'Error al eliminar el producto de la wishlist' });
                    } else {
                        res.status(200).json({ message: 'Producto eliminado de la wishlist correctamente' });
                    }
                });
            }
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

