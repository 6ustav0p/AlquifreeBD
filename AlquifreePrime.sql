-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-11-2023 a las 02:57:07
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `alquifre`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddToCart` (IN `userId` INT, IN `productId` INT, IN `quantity` INT)   BEGIN
  DECLARE availableQuantity INT;

  -- Verificar disponibilidad del producto
  SELECT Stock INTO availableQuantity
  FROM producto
  WHERE idProducto = productId;

  IF availableQuantity >= quantity THEN
    -- Agregar producto al carrito
    INSERT INTO carrito_producto (Carrito_idCarrito, Producto_idProducto, Cantidad)
    VALUES (userId, productId, quantity);
  ELSE
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Producto no disponible en la cantidad especificada';
  END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPurchaseHistory` (IN `userId` INT)   BEGIN
  SELECT p.idPedido, p.Fecha, p.Monto, p.Estado
  FROM pedido p
  JOIN carrito c ON p.Carrito_idCarrito = c.idCarrito
  WHERE c.Usuario_idUsuario = userId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `PlaceOrder` (IN `userId` INT)   BEGIN
  -- Crear un nuevo pedido
  INSERT INTO pedido (Carrito_idCarrito, Fecha, Monto, Estado)
  VALUES ((SELECT idCarrito FROM carrito WHERE Usuario_idUsuario = userId LIMIT 1), CURDATE(), CalculatePedidoTotalPrice(userId), 'En proceso');

  -- Asignar el nuevo pedido a los productos en el carrito
  UPDATE carrito_producto
  SET Carrito_idCarrito = (SELECT LAST_INSERT_ID())
  WHERE Carrito_idCarrito = (SELECT idCarrito FROM carrito WHERE Usuario_idUsuario = userId LIMIT 1);
END$$

--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `CalculatePedidoTotalPrice` (`userId` INT) RETURNS DECIMAL(10,2)  BEGIN
  DECLARE totalPrice DECIMAL(10,2);
  SELECT SUM(pr.Precio * cp.Cantidad)
  INTO totalPrice
  FROM producto pr
  JOIN carrito_producto cp ON pr.idProducto = cp.Producto_idProducto
  JOIN carrito c ON cp.Carrito_idCarrito = c.idCarrito
  WHERE c.Usuario_idUsuario = userId;
  RETURN totalPrice;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `CheckProductAvailability` (`product_id` INT, `quantity` INT) RETURNS TINYINT(1)  BEGIN
  DECLARE available_quantity INT;
  SELECT Stock INTO available_quantity
  FROM producto
  WHERE idProducto = product_id;

  RETURN available_quantity >= quantity;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetUserTotalSpending` (`user_id` INT) RETURNS DECIMAL(10,2)  BEGIN
  DECLARE total DECIMAL(10,2);
  SELECT SUM(p.Monto)
  INTO total
  FROM pedido p
  JOIN carrito c ON p.Carrito_idCarrito = c.idCarrito
  WHERE c.Usuario_idUsuario = user_id;
  RETURN IFNULL(total, 0);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `idCarrito` int(10) UNSIGNED NOT NULL,
  `Usuario_idUsuario` int(10) UNSIGNED NOT NULL,
  `Estado` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`idCarrito`, `Usuario_idUsuario`, `Estado`) VALUES
(1, 1, 'En espera'),
(2, 2, 'En espera'),
(3, 1, 'Completado'),
(4, 3, 'En proceso'),
(5, 2, 'Completado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_producto`
--

CREATE TABLE `carrito_producto` (
  `idCarritoProducto` int(10) UNSIGNED NOT NULL,
  `Carrito_idCarrito` int(10) UNSIGNED NOT NULL,
  `Producto_idProducto` int(10) UNSIGNED NOT NULL,
  `Cantidad` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito_producto`
--

INSERT INTO `carrito_producto` (`idCarritoProducto`, `Carrito_idCarrito`, `Producto_idProducto`, `Cantidad`) VALUES
(1, 1, 1, 2),
(2, 2, 3, 1),
(3, 1, 2, 3),
(4, 3, 4, 2),
(5, 2, 5, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudad`
--

CREATE TABLE `ciudad` (
  `idCiudad` int(10) UNSIGNED NOT NULL,
  `Departamento_idDepartamento` int(10) UNSIGNED NOT NULL,
  `Nombre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ciudad`
--

INSERT INTO `ciudad` (`idCiudad`, `Departamento_idDepartamento`, `Nombre`) VALUES
(1, 1, 'Monteria'),
(2, 2, 'Barranquilla'),
(3, 1, 'Sincelejo'),
(4, 3, 'Bogota'),
(5, 2, 'Manizales');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamento`
--

CREATE TABLE `departamento` (
  `idDepartamento` int(10) UNSIGNED NOT NULL,
  `Nombredpto` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `departamento`
--

INSERT INTO `departamento` (`idDepartamento`, `Nombredpto`) VALUES
(1, 'Cordoba'),
(2, 'Atlantico'),
(3, 'Cordoba'),
(4, 'Cundinamarca'),
(5, 'Caldas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direccion`
--

CREATE TABLE `direccion` (
  `idDireccion` int(10) UNSIGNED NOT NULL,
  `Ciudad_idCiudad` int(10) UNSIGNED NOT NULL,
  `Calle` varchar(255) DEFAULT NULL,
  `Numero` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `direccion`
--

INSERT INTO `direccion` (`idDireccion`, `Ciudad_idCiudad`, `Calle`, `Numero`) VALUES
(1, 1, 'Calle 1', 123),
(2, 2, 'Avenida 2', 456),
(3, 3, 'Calle Principal', 789),
(4, 1, 'Avenida Central', 1011),
(5, 3, 'Calle 4', 1213);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `idPedido` int(10) UNSIGNED NOT NULL,
  `Carrito_idCarrito` int(10) UNSIGNED NOT NULL,
  `Fecha` date DEFAULT NULL,
  `Duracion` timestamp NULL DEFAULT NULL,
  `Monto` float DEFAULT NULL,
  `Estado` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`idPedido`, `Carrito_idCarrito`, `Fecha`, `Duracion`, `Monto`, `Estado`) VALUES
(1, 1, '2023-01-29', '0000-00-00 00:00:00', 248000, 'Completado'),
(2, 2, '2023-01-14', '0000-00-00 00:00:00', 850000, 'En proceso'),
(3, 3, '2023-08-12', '0000-00-00 00:00:00', 300000, 'Pendiente'),
(4, 1, '2023-05-05', '0000-00-00 00:00:00', 90000, 'Completado'),
(5, 4, '2023-06-22', '0000-00-00 00:00:00', 1000000, 'Cancelado');

--
-- Disparadores `pedido`
--
DELIMITER $$
CREATE TRIGGER `SetPedidoStateAndDuration` BEFORE INSERT ON `pedido` FOR EACH ROW BEGIN
  SET NEW.Estado = 'En Proceso';
  SET NEW.Duracion = TIMESTAMPDIFF(HOUR, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `UpdateStockOnOrderCancellation` BEFORE UPDATE ON `pedido` FOR EACH ROW BEGIN
  IF NEW.Estado = 'Cancelado' AND OLD.Estado != 'Cancelado' THEN
    UPDATE producto p
    JOIN pedido_has_producto php ON php.Pedido_idPedido = OLD.idPedido
    SET p.Stock = p.Stock + php.Cantidad
    WHERE p.idProducto = php.Producto_idProducto;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_has_producto`
--

CREATE TABLE `pedido_has_producto` (
  `Pedido_idPedido` int(10) UNSIGNED NOT NULL,
  `Producto_idProducto` int(10) UNSIGNED NOT NULL,
  `Cantidad` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido_has_producto`
--

INSERT INTO `pedido_has_producto` (`Pedido_idPedido`, `Producto_idProducto`, `Cantidad`) VALUES
(1, 1, 2),
(2, 3, 1),
(3, 2, 3),
(4, 4, 2),
(5, 5, 1);

--
-- Disparadores `pedido_has_producto`
--
DELIMITER $$
CREATE TRIGGER `UpdateCartTotal` AFTER INSERT ON `pedido_has_producto` FOR EACH ROW BEGIN
  DECLARE total DECIMAL(10,2);
  SELECT CalculatePedidoTotalPrice(NEW.Pedido_idPedido) INTO total;

  UPDATE pedido
  SET Monto = total
  WHERE idPedido = NEW.Pedido_idPedido AND Estado = 'En proceso';
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `UpdateStockOnAddToCart` AFTER INSERT ON `pedido_has_producto` FOR EACH ROW BEGIN
  UPDATE producto
  SET Stock = Stock - NEW.Cantidad
  WHERE idProducto = NEW.Producto_idProducto;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `idProducto` int(10) UNSIGNED NOT NULL,
  `Usuario_idUsuario` int(10) UNSIGNED NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `Precio` int(10) UNSIGNED DEFAULT NULL,
  `Categoria` varchar(255) DEFAULT NULL,
  `Stock` int(10) UNSIGNED DEFAULT NULL,
  `Foto` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`idProducto`, `Usuario_idUsuario`, `Descripcion`, `Precio`, `Categoria`, `Stock`, `Foto`) VALUES
(1, 1, 'Bicicleta', 5000, 'Transporte', 50, NULL),
(2, 2, 'Carro Kia', 200000, 'Transporte', 30, NULL),
(3, 3, 'Sillas para eventos', 1000, 'Hogar', 75, NULL),
(4, 4, 'Traje de hombre', 150000, 'Ropa', 40, NULL),
(5, 5, 'Motocross(XTZ)', 50000, 'Transporte', 60, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(10) UNSIGNED NOT NULL,
  `Direccion_idDireccion` int(10) UNSIGNED NOT NULL,
  `Correo` varchar(255) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Contraseña` varchar(255) DEFAULT NULL,
  `PrimerNombre` varchar(45) DEFAULT NULL,
  `SegundoNombre` varchar(45) DEFAULT NULL,
  `PrimerApellido` varchar(45) DEFAULT NULL,
  `SegundoApellido` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `Direccion_idDireccion`, `Correo`, `Telefono`, `Contraseña`, `PrimerNombre`, `SegundoNombre`, `PrimerApellido`, `SegundoApellido`) VALUES
(1, 1, 'alex8854@gmail.com', '123456789', 'contrasena1', 'Alex', 'de Dios', 'Pantoja', 'Cossio'),
(2, 2, 'sandrajm5@gmail.com', '987654321', 'sandritaxd35', 'Sandra', 'María', 'González', 'López'),
(3, 3, 'gustavop4512@gmail.com', '555555555', 'gustavo343%', 'Gustavo', 'Adolfo', 'Padilla', 'Ruiz'),
(4, 4, 'eliasfabrar412@gmail.com', '666666666', 'elyastin401', 'Elias', 'David', 'Fabra', 'Redondo'),
(5, 5, 'apaezgarrido465@gmail.com', '777777777', 'apaezgariasd45', 'Alejandro', 'de Jesús', 'Páez', 'Garrido');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`idCarrito`),
  ADD KEY `Carrito_FKIndex1` (`Usuario_idUsuario`);

--
-- Indices de la tabla `carrito_producto`
--
ALTER TABLE `carrito_producto`
  ADD PRIMARY KEY (`idCarritoProducto`),
  ADD KEY `Carrito_Producto_FKIndex1` (`Carrito_idCarrito`),
  ADD KEY `Carrito_Producto_FKIndex2` (`Producto_idProducto`);

--
-- Indices de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD PRIMARY KEY (`idCiudad`),
  ADD KEY `Ciudad_FKIndex1` (`Departamento_idDepartamento`);

--
-- Indices de la tabla `departamento`
--
ALTER TABLE `departamento`
  ADD PRIMARY KEY (`idDepartamento`);

--
-- Indices de la tabla `direccion`
--
ALTER TABLE `direccion`
  ADD PRIMARY KEY (`idDireccion`),
  ADD KEY `Direccion_FKIndex1` (`Ciudad_idCiudad`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`idPedido`),
  ADD KEY `Pedido_FKIndex1` (`Carrito_idCarrito`);

--
-- Indices de la tabla `pedido_has_producto`
--
ALTER TABLE `pedido_has_producto`
  ADD PRIMARY KEY (`Pedido_idPedido`,`Producto_idProducto`),
  ADD KEY `Pedido_has_Producto_FKIndex1` (`Pedido_idPedido`),
  ADD KEY `Pedido_has_Producto_FKIndex2` (`Producto_idProducto`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`idProducto`),
  ADD KEY `Producto_FKIndex1` (`Usuario_idUsuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`),
  ADD KEY `Usuario_FKIndex1` (`Direccion_idDireccion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `idCarrito` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `carrito_producto`
--
ALTER TABLE `carrito_producto`
  MODIFY `idCarritoProducto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  MODIFY `idCiudad` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `departamento`
--
ALTER TABLE `departamento`
  MODIFY `idDepartamento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `direccion`
--
ALTER TABLE `direccion`
  MODIFY `idDireccion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `idPedido` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `idProducto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `carrito_producto`
--
ALTER TABLE `carrito_producto`
  ADD CONSTRAINT `carrito_producto_ibfk_1` FOREIGN KEY (`Carrito_idCarrito`) REFERENCES `carrito` (`idCarrito`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `carrito_producto_ibfk_2` FOREIGN KEY (`Producto_idProducto`) REFERENCES `producto` (`idProducto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD CONSTRAINT `ciudad_ibfk_1` FOREIGN KEY (`Departamento_idDepartamento`) REFERENCES `departamento` (`idDepartamento`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `direccion`
--
ALTER TABLE `direccion`
  ADD CONSTRAINT `direccion_ibfk_1` FOREIGN KEY (`Ciudad_idCiudad`) REFERENCES `ciudad` (`idCiudad`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`Carrito_idCarrito`) REFERENCES `carrito` (`idCarrito`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `pedido_has_producto`
--
ALTER TABLE `pedido_has_producto`
  ADD CONSTRAINT `pedido_has_producto_ibfk_1` FOREIGN KEY (`Pedido_idPedido`) REFERENCES `pedido` (`idPedido`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `pedido_has_producto_ibfk_2` FOREIGN KEY (`Producto_idProducto`) REFERENCES `producto` (`idProducto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`Direccion_idDireccion`) REFERENCES `direccion` (`idDireccion`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
