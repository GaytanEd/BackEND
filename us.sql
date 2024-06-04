-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.35 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Volcando estructura para tabla teleagenda.amigos
CREATE TABLE IF NOT EXISTS `amigos` (
  `ID_usuario` int unsigned NOT NULL,
  `Nombre_Amigos` varchar(20) NOT NULL DEFAULT '',
  `Apellido_Amigos` varchar(20) NOT NULL DEFAULT '',
  `Boleta_Amigos` varchar(20) NOT NULL DEFAULT '',
  `ID_Amigos` varchar(20) NOT NULL DEFAULT '',
  KEY `ID_usuario` (`ID_usuario`),
  CONSTRAINT `FK_amigos_usuarios` FOREIGN KEY (`ID_usuario`) REFERENCES `usuarios` (`ID_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla teleagenda.amigos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla teleagenda.evento
CREATE TABLE IF NOT EXISTS `evento` (
  `ID_usuario` int unsigned NOT NULL,
  `Nombre_evento` varchar(50) NOT NULL DEFAULT '',
  `Recordatorio` binary(2) NOT NULL DEFAULT '\0\0',
  `Fecha_creacion` date NOT NULL,
  `Fecha_modificacion` date NOT NULL,
  `Persmiso` binary(2) NOT NULL,
  KEY `ID_usuario` (`ID_usuario`),
  KEY `Persmiso` (`Persmiso`),
  CONSTRAINT `FK_evento_lider` FOREIGN KEY (`Persmiso`) REFERENCES `lider` (`Permiso`),
  CONSTRAINT `FK_evento_usuarios` FOREIGN KEY (`ID_usuario`) REFERENCES `usuarios` (`ID_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla teleagenda.evento: ~0 rows (aproximadamente)

-- Volcando estructura para tabla teleagenda.lider
CREATE TABLE IF NOT EXISTS `lider` (
  `ID_usuario` int(10) unsigned zerofill NOT NULL,
  `Permiso` binary(2) NOT NULL,
  `Fecha_creacion` date NOT NULL,
  `Fecha_modificacion` date NOT NULL,
  PRIMARY KEY (`Permiso`),
  KEY `ID_usuario` (`ID_usuario`),
  CONSTRAINT `FK_lider_usuarios` FOREIGN KEY (`ID_usuario`) REFERENCES `usuarios` (`ID_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla teleagenda.lider: ~0 rows (aproximadamente)

-- Volcando estructura para tabla teleagenda.notas
CREATE TABLE IF NOT EXISTS `notas` (
  `ID_usuario` int unsigned NOT NULL,
  `Nombre_Nota` varchar(50) NOT NULL,
  `Texto` varchar(250) NOT NULL,
  KEY `ID_usuario` (`ID_usuario`),
  CONSTRAINT `FK__usuarios` FOREIGN KEY (`ID_usuario`) REFERENCES `usuarios` (`ID_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla teleagenda.notas: ~0 rows (aproximadamente)

-- Volcando estructura para tabla teleagenda.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `ID_usuario` int(10) unsigned zerofill NOT NULL,
  `Nombre` varchar(20) NOT NULL,
  `Apellido` varchar(20) NOT NULL,
  `Edad` tinyint unsigned NOT NULL DEFAULT (0),
  `Correo` varchar(50) NOT NULL DEFAULT '0',
  `Boleta` int unsigned NOT NULL DEFAULT (0),
  `Especialidad` varchar(20) NOT NULL DEFAULT '0',
  `Contraseña` varchar(20) NOT NULL DEFAULT '0',
  `Fecha_Creacion` date NOT NULL,
  `Fecha_Modificación` date NOT NULL,
  PRIMARY KEY (`ID_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla teleagenda.usuarios: ~0 rows (aproximadamente)
INSERT INTO `usuarios` (`ID_usuario`, `Nombre`, `Apellido`, `Edad`, `Correo`, `Boleta`, `Especialidad`, `Contraseña`, `Fecha_Creacion`, `Fecha_Modificación`) VALUES
	(0000000001, 'Elias', 'Eustaquio', 22, 'eieustaquio10@gmail.com', 2021640203, 'Telematica', '123456', '2024-06-03', '2024-06-03'),
	(0000000002, 'Edgard', 'Gaytan', 21, 'edgardgaytan@gmail.com', 2021640000, 'Telematica', '12345', '2024-06-03', '2024-06-03');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
