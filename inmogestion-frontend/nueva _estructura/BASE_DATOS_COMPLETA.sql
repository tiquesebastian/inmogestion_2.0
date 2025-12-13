-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: inmogestion
-- ------------------------------------------------------
-- Server version	8.4.6

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria` (
  `id_auditoria` int NOT NULL AUTO_INCREMENT,
  `tabla` varchar(50) DEFAULT NULL,
  `tabla_afectada` varchar(50) NOT NULL,
  `accion` varchar(20) NOT NULL,
  `descripcion` text,
  `detalle_json` json DEFAULT NULL,
  `usuario_accion` varchar(100) DEFAULT NULL,
  `fecha_accion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_auditoria`),
  KEY `idx_tabla_accion` (`tabla_afectada`,`accion`),
  KEY `idx_fecha_accion` (`fecha_accion` DESC),
  KEY `idx_usuario_accion` (`usuario_accion`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
INSERT INTO `auditoria` VALUES (1,NULL,'usuario','LOGIN','Inicio de sesión exitoso','{\"ip\": \"::1\", \"exitoso\": true, \"timestamp\": \"2025-11-24T23:05:04.494Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','mipcmamon1@gmail.com','2025-11-24 18:05:04','2025-11-24 18:05:04'),(2,NULL,'usuario','LOGIN','Inicio de sesión exitoso','{\"ip\": \"::1\", \"exitoso\": true, \"timestamp\": \"2025-11-24T23:07:06.509Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','mipcmamon1@gmail.com','2025-11-24 18:07:06','2025-11-24 18:07:06'),(3,NULL,'usuario','REGISTER','Registro de nuevo usuario','{\"ip\": \"::1\", \"timestamp\": \"2025-11-24T23:36:19.382Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','supcmamon1@gmail.com','2025-11-24 18:36:19','2025-11-24 18:36:19'),(4,NULL,'usuario','REGISTER','Registro de nuevo usuario','{\"ip\": \"::1\", \"timestamp\": \"2025-11-24T23:46:10.998Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','supcmamon1@gmail.com','2025-11-24 18:46:10','2025-11-24 18:46:10'),(5,NULL,'usuario','PASSWORD_RESET','Contraseña restablecida exitosamente','{\"ip\": \"::1\", \"timestamp\": \"2025-11-24T23:49:03.286Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','zuliana','2025-11-24 18:49:03','2025-11-24 18:49:03'),(6,NULL,'usuario','LOGIN_FAILED','Intento de inicio de sesión fallido','{\"ip\": \"::1\", \"exitoso\": false, \"timestamp\": \"2025-11-25T00:06:58.883Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','mipcmamon1@gmail.com','2025-11-24 19:06:58','2025-11-24 19:06:58'),(7,NULL,'usuario','LOGIN_FAILED','Intento de inicio de sesión fallido','{\"ip\": \"::1\", \"exitoso\": false, \"timestamp\": \"2025-11-25T00:07:28.622Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','mipcmamonpc1@gmail.com','2025-11-24 19:07:28','2025-11-24 19:07:28'),(8,NULL,'usuario','LOGIN','Inicio de sesión exitoso','{\"ip\": \"::1\", \"exitoso\": true, \"timestamp\": \"2025-11-25T00:07:38.230Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','mipcmamon1@gmail.com','2025-11-24 19:07:38','2025-11-24 19:07:38'),(9,NULL,'usuario','REGISTER','Registro de nuevo usuario','{\"ip\": \"::1\", \"timestamp\": \"2025-11-25T00:09:09.225Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','supcmamon1@gmail.com','2025-11-24 19:09:09','2025-11-24 19:09:09'),(10,NULL,'usuario','REGISTER','Registro de nuevo usuario','{\"ip\": \"::1\", \"timestamp\": \"2025-11-25T00:16:49.512Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','supcmamon1@gmail.com','2025-11-24 19:16:49','2025-11-24 19:16:49'),(11,NULL,'usuario','REGISTER','Registro de nuevo usuario','{\"ip\": \"::1\", \"timestamp\": \"2025-11-25T00:25:25.268Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','supcmamon1@gmail.com','2025-11-24 19:25:25','2025-11-24 19:25:25'),(12,NULL,'usuario','REGISTER','Registro de nuevo usuario','{\"ip\": \"::1\", \"timestamp\": \"2025-11-25T00:30:52.087Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','supcmamon1@gmail.com','2025-11-24 19:30:52','2025-11-24 19:30:52'),(13,NULL,'usuario','REGISTER','Registro de nuevo usuario','{\"ip\": \"::1\", \"timestamp\": \"2025-11-25T00:32:45.152Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','supcmamon1@gmail.com','2025-11-24 19:32:45','2025-11-24 19:32:45'),(14,NULL,'usuario','LOGIN','Inicio de sesión exitoso','{\"ip\": \"::1\", \"exitoso\": true, \"timestamp\": \"2025-11-25T00:52:00.324Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','supcmamon1@gmail.com','2025-11-24 19:52:00','2025-11-24 19:52:00'),(15,NULL,'usuario','LOGIN_FAILED','Intento de inicio de sesión fallido','{\"ip\": \"::1\", \"exitoso\": false, \"timestamp\": \"2025-11-25T02:02:59.688Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','tiquesebastina53@gmail.com','2025-11-24 21:02:59','2025-11-24 21:02:59'),(16,NULL,'usuario','LOGIN','Inicio de sesión exitoso','{\"ip\": \"::1\", \"exitoso\": true, \"timestamp\": \"2025-11-25T02:03:36.203Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','tiquesebastian53@gmail.com','2025-11-24 21:03:36','2025-11-24 21:03:36'),(17,NULL,'usuario','LOGIN_FAILED','Intento de inicio de sesión fallido','{\"ip\": \"::1\", \"exitoso\": false, \"timestamp\": \"2025-12-08T15:58:37.252Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','mipcmamon1@gmail.com','2025-12-08 10:58:37','2025-12-08 10:58:37'),(18,NULL,'usuario','LOGIN','Inicio de sesión exitoso','{\"ip\": \"::1\", \"exitoso\": true, \"timestamp\": \"2025-12-08T15:58:47.204Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','mipcmamon1@gmail.com','2025-12-08 10:58:47','2025-12-08 10:58:47'),(19,NULL,'usuario','LOGIN','Inicio de sesión exitoso','{\"ip\": \"::1\", \"exitoso\": true, \"timestamp\": \"2025-12-08T16:00:42.596Z\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36\"}','mipcmamon1@gmail.com','2025-12-08 11:00:42','2025-12-08 11:00:42');
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `barrio`
--

DROP TABLE IF EXISTS `barrio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barrio` (
  `id_barrio` int NOT NULL AUTO_INCREMENT,
  `nombre_barrio` varchar(100) NOT NULL,
  `codigo_postal` varchar(10) NOT NULL,
  `id_localidad` int NOT NULL,
  PRIMARY KEY (`id_barrio`),
  KEY `id_localidad` (`id_localidad`),
  CONSTRAINT `barrio_ibfk_1` FOREIGN KEY (`id_localidad`) REFERENCES `localidad` (`id_localidad`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barrio`
--

LOCK TABLES `barrio` WRITE;
/*!40000 ALTER TABLE `barrio` DISABLE KEYS */;
INSERT INTO `barrio` VALUES (1,'Santa Bárbara','110121',1),(2,'Cedritos','110121',1),(3,'Bella Suiza','110121',1),(4,'Rosales','110211',2),(5,'El Nogal','110211',2),(6,'El Chicó','110211',2),(7,'La Candelaria','110311',3),(8,'Las Nieves','110311',3),(9,'La Macarena','110311',3),(10,'San Blas','110411',4),(11,'La Victoria','110411',4),(12,'Los Libertadores','110411',4),(13,'El Bosque','110511',5),(14,'Gran Yomasa','110511',5),(15,'Comuneros','110511',5),(16,'San Benito','110611',6),(17,'Venecia','110611',6),(18,'Abraham Lincoln','110611',6),(19,'Bosa Centro','110711',7),(20,'Bosa Occidental','110711',7),(21,'Bosa Nova','110711',7),(22,'Patio Bonito','110811',8),(23,'Corabastos','110811',8),(24,'Tintalá','110811',8),(25,'Fontibón Centro','110911',9),(26,'Modelia','110911',9),(27,'El Recreo','110911',9),(28,'Minuto de Dios','111011',10),(29,'Villa Luz','111011',10),(30,'Engativá Centro','111011',10),(31,'Suba Centro','111111',11),(32,'Niza','111111',11),(33,'Prado Veraniego','111111',11),(34,'La Castellana','111211',12),(35,'Los Andes','111211',12),(36,'Polo Club','111211',12),(37,'Teusaquillo','111311',13),(38,'La Esmeralda','111311',13),(39,'Galerías','111311',13),(40,'Santa Isabel','111411',14),(41,'Voto Nacional','111411',14),(42,'Paloquemao','111411',14),(43,'Restrepo','111511',15),(44,'San Jorge','111511',15),(45,'Ciudad Berna','111511',15),(46,'Puente Aranda','111611',16),(47,'Zona Industrial','111611',16),(48,'Montevideo','111611',16),(49,'Belén','111711',17),(50,'Egipto','111711',17),(51,'Las Aguas','111711',17),(52,'Quiroga','111811',18),(53,'Molinos','111811',18),(54,'Diana Turbay','111811',18),(55,'Arborizadora','110711',19),(56,'La Pradera del Norte','110711',19),(57,'El Redil','110711',19),(58,'Sector Betania','190001',20),(59,'Sector Salamanca','190002',20),(60,'Sector Veredal','190003',20),(61,'Santa Bárbara','110121',1),(62,'Cedritos','110121',1),(63,'Bella Suiza','110121',1),(64,'Rosales','110211',2),(65,'El Nogal','110211',2),(66,'El Chicó','110211',2),(67,'La Candelaria','110311',3),(68,'Las Nieves','110311',3),(69,'La Macarena','110311',3),(70,'San Blas','110411',4),(71,'La Victoria','110411',4),(72,'Los Libertadores','110411',4),(73,'El Bosque','110511',5),(74,'Gran Yomasa','110511',5),(75,'Comuneros','110511',5),(76,'San Benito','110611',6),(77,'Venecia','110611',6),(78,'Abraham Lincoln','110611',6),(79,'Bosa Centro','110711',7),(80,'Bosa Occidental','110711',7),(81,'Bosa Nova','110711',7),(82,'Patio Bonito','110811',8),(83,'Corabastos','110811',8),(84,'Tintalá','110811',8),(85,'Fontibón Centro','110911',9),(86,'Modelia','110911',9),(87,'El Recreo','110911',9),(88,'Minuto de Dios','111011',10),(89,'Villa Luz','111011',10),(90,'Engativá Centro','111011',10),(91,'Suba Centro','111111',11),(92,'Niza','111111',11),(93,'Prado Veraniego','111111',11),(94,'La Castellana','111211',12),(95,'Los Andes','111211',12),(96,'Polo Club','111211',12),(97,'Teusaquillo','111311',13),(98,'La Esmeralda','111311',13),(99,'Galerías','111311',13),(100,'Santa Isabel','111411',14),(101,'Voto Nacional','111411',14),(102,'Paloquemao','111411',14),(103,'Restrepo','111511',15),(104,'San Jorge','111511',15),(105,'Ciudad Berna','111511',15),(106,'Puente Aranda','111611',16),(107,'Zona Industrial','111611',16),(108,'Montevideo','111611',16),(109,'Belén','111711',17),(110,'Egipto','111711',17),(111,'Las Aguas','111711',17),(112,'Quiroga','111811',18),(113,'Molinos','111811',18),(114,'Diana Turbay','111811',18),(115,'Arborizadora','110711',19),(116,'La Pradera del Norte','110711',19),(117,'El Redil','110711',19),(118,'Sector Betania','190001',20),(119,'Sector Salamanca','190002',20),(120,'Sector Veredal','190003',20);
/*!40000 ALTER TABLE `barrio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `busqueda`
--

DROP TABLE IF EXISTS `busqueda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `busqueda` (
  `id_busqueda` int NOT NULL AUTO_INCREMENT,
  `query_text` varchar(500) DEFAULT NULL,
  `filtros` json DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_busqueda`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `busqueda`
--

LOCK TABLES `busqueda` WRITE;
/*!40000 ALTER TABLE `busqueda` DISABLE KEYS */;
/*!40000 ALTER TABLE `busqueda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre_cliente` varchar(50) NOT NULL,
  `apellido_cliente` varchar(50) NOT NULL,
  `documento_cliente` varchar(20) NOT NULL,
  `correo_cliente` varchar(100) NOT NULL,
  `telefono_cliente` varchar(20) DEFAULT NULL,
  `estado_cliente` enum('Activo','Inactivo') DEFAULT 'Activo',
  `email_verificado` tinyint(1) DEFAULT '0',
  `email_token` varchar(64) DEFAULT NULL,
  `email_token_expires` datetime DEFAULT NULL,
  `nombre_usuario` varchar(50) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `documento_cliente` (`documento_cliente`),
  UNIQUE KEY `correo_cliente` (`correo_cliente`),
  KEY `idx_cliente_nombre_usuario` (`nombre_usuario`),
  KEY `idx_email_token_cliente` (`email_token`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'Juan','Pérez','100100001','juan.perez1@example.com','3001110001','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(2,'Ana','Gómez','100100002','ana.gomez2@example.com','3001110002','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(3,'Carlos','Ramírez','100100003','carlos.ramirez3@example.com','3001110003','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(4,'Laura','Martínez','100100004','laura.martinez4@example.com','3001110004','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(5,'Luis','Fernández','100100005','luis.fernandez5@example.com','3001110005','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(6,'Sofía','Torres','100100006','sofia.torres6@example.com','3001110006','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(7,'Andrés','Suárez','100100007','andres.suarez7@example.com','3001110007','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(8,'Mariana','Vargas','100100008','mariana.vargas8@example.com','3001110008','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(9,'Felipe','Castro','100100009','felipe.castro9@example.com','3001110009','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(10,'Natalia','Cortés','100100010','natalia.cortes10@example.com','3001110010','Inactivo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(11,'Jorge','Moreno','100100011','jorge.moreno11@example.com','3001110011','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(12,'Camila','Rojas','100100012','camila.rojas12@example.com','3001110012','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(13,'David','López','100100013','david.lopez13@example.com','3001110013','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(14,'Paula','Mendoza','100100014','paula.mendoza14@example.com','3001110014','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(15,'Santiago','García','100100015','santiago.garcia15@example.com','3001110015','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(16,'Valentina','Ortega','100100016','valentina.ortega16@example.com','3001110016','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(17,'Diego','Jiménez','100100017','diego.jimenez17@example.com','3001110017','Inactivo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(18,'Daniela','Navarro','100100018','daniela.navarro18@example.com','3001110018','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(19,'Ricardo','Mejía','100100019','ricardo.mejia19@example.com','3001110019','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(20,'Andrea','Santos','100100020','andrea.santos20@example.com','3001110020','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(21,'Manuel','Reyes','100100021','manuel.reyes21@example.com','3001110021','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(22,'Juliana','Carrillo','100100022','juliana.carrillo22@example.com','3001110022','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(23,'Tomás','Silva','100100023','tomas.silva23@example.com','3001110023','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(24,'Isabela','Álvarez','100100024','isabela.alvarez24@example.com','3001110024','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(25,'Sebastián','Paredes','100100025','sebastian.paredes25@example.com','3001110025','Inactivo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(26,'Carolina','Rincón','100100026','carolina.rincon26@example.com','3001110026','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(27,'Alejandro','Delgado','100100027','alejandro.delgado27@example.com','3001110027','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(28,'Gabriela','León','100100028','gabriela.leon28@example.com','3001110028','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(29,'Mateo','Nieto','100100029','mateo.nieto29@example.com','3001110029','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(30,'Lucía','Salazar','100100030','lucia.salazar30@example.com','3001110030','Activo',0,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-07 22:14:18'),(31,'Juan','Pérez','12345678','juanperez@example.com','123456789','Activo',0,NULL,NULL,'juanp','$2b$10$iJWTKPofmFs9vkD1ETdeK.af4QMrZbE9IGHYrrtViugXKk46PB2eG',NULL,NULL,'2025-11-08 17:17:29'),(32,'juan sebastian ','tique Rodriguez','1023364903','tiquesebastian53@gmail.com','3175200910','Activo',1,NULL,NULL,'tiquesebasian53@gmail.com','$2b$10$ZQWYiqlsDvk6memINhETVuH1gJ1CdPt7bGiPMdl/3ZIZb4PNJtVuW',NULL,NULL,'2025-11-08 18:49:39'),(33,'zuliana','rodriguez','3184104240','zulyrodriguez253@gmail.com','3184104240','Activo',0,NULL,NULL,'zuly','$2b$10$viKELndaOFUal.rXlZOsR.9Oac3A37sLkjpukUgMpP/dhpSChk/tq',NULL,NULL,'2025-11-20 02:04:53'),(34,'yiustyf','srexgfrdxr','1011095347','helenandreatiquerodriguez@gmail.com','3188850950','Activo',0,'9798df15c77e62c214c4f1552e786b616fb63654d10e3ff2054d2d6133507e34','2025-11-20 21:20:37','la socia','$2b$10$GpqaHFpxlWWX/NQ42oNIzOMUWTBUJgmtjp/RcMCDfJX8kEDF00w5C',NULL,NULL,'2025-11-20 02:20:36'),(35,'sebacho','tique Rodriguez','1154561313','mipcmamon1@gmail.com','3000152815','Activo',1,NULL,NULL,'sebachso','$2b$10$VREDpJupBrj4maIvdcz3UOaBnzF7bCiof8vP2vq3aTIiSco.Sgb/.',NULL,NULL,'2025-11-24 19:11:05');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrato`
--

DROP TABLE IF EXISTS `contrato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrato` (
  `id_contrato` int NOT NULL AUTO_INCREMENT,
  `fecha_contrato` date NOT NULL,
  `valor_venta` decimal(15,2) NOT NULL,
  `fecha_venta` date NOT NULL,
  `archivo_pdf` varchar(255) DEFAULT NULL,
  `id_propiedad` int NOT NULL,
  `id_cliente` int NOT NULL,
  `id_usuario` int NOT NULL,
  `estado_contrato` enum('Activo','Anulado','Finalizado') DEFAULT 'Activo',
  PRIMARY KEY (`id_contrato`),
  KEY `id_propiedad` (`id_propiedad`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `contrato_ibfk_1` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedad` (`id_propiedad`),
  CONSTRAINT `contrato_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `contrato_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrato`
--

LOCK TABLES `contrato` WRITE;
/*!40000 ALTER TABLE `contrato` DISABLE KEYS */;
/*!40000 ALTER TABLE `contrato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrato_documento`
--

DROP TABLE IF EXISTS `contrato_documento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrato_documento` (
  `id_contrato_documento` int NOT NULL AUTO_INCREMENT,
  `id_contrato` int DEFAULT NULL,
  `id_propiedad` int NOT NULL,
  `id_cliente` int NOT NULL,
  `tipo_inmueble` enum('Casa','Apartamento','Lote') COLLATE utf8mb4_unicode_ci NOT NULL,
  `vendedor_nombre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vendedor_apellido` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vendedor_tipo_documento` enum('CC','CE','NIT','Pasaporte') COLLATE utf8mb4_unicode_ci NOT NULL,
  `vendedor_numero_documento` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vendedor_direccion` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vendedor_telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comprador_nombre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comprador_apellido` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comprador_tipo_documento` enum('CC','CE','NIT','Pasaporte') COLLATE utf8mb4_unicode_ci NOT NULL,
  `comprador_numero_documento` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comprador_direccion` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comprador_telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inmueble_matricula` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inmueble_area_m2` decimal(10,2) DEFAULT NULL,
  `inmueble_direccion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `inmueble_linderos` text COLLATE utf8mb4_unicode_ci,
  `inmueble_descripcion` text COLLATE utf8mb4_unicode_ci,
  `precio_venta` decimal(15,2) NOT NULL,
  `forma_pago` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `clausulas_adicionales` text COLLATE utf8mb4_unicode_ci,
  `lugar_firma` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Bogotá D.C.',
  `fecha_firma` date NOT NULL,
  `archivo_pdf` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado_documento` enum('Generado','Firmado','Anulado') COLLATE utf8mb4_unicode_ci DEFAULT 'Generado',
  `fecha_generacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `generado_por` int NOT NULL,
  PRIMARY KEY (`id_contrato_documento`),
  KEY `id_contrato` (`id_contrato`),
  KEY `generado_por` (`generado_por`),
  KEY `idx_cliente` (`id_cliente`),
  KEY `idx_propiedad` (`id_propiedad`),
  KEY `idx_fecha` (`fecha_generacion`),
  CONSTRAINT `contrato_documento_ibfk_1` FOREIGN KEY (`id_contrato`) REFERENCES `contrato` (`id_contrato`) ON DELETE SET NULL,
  CONSTRAINT `contrato_documento_ibfk_2` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedad` (`id_propiedad`) ON DELETE CASCADE,
  CONSTRAINT `contrato_documento_ibfk_3` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE CASCADE,
  CONSTRAINT `contrato_documento_ibfk_4` FOREIGN KEY (`generado_por`) REFERENCES `usuario` (`id_usuario`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrato_documento`
--

LOCK TABLES `contrato_documento` WRITE;
/*!40000 ALTER TABLE `contrato_documento` DISABLE KEYS */;
INSERT INTO `contrato_documento` VALUES (1,NULL,6,32,'Casa','sebastian','tique','CC','1023364903','13123','3175200910','juan','sebastian ','CC','1023364903','13 12 3','3175200910','65435135189',130.00,'av calle 1 #7-49','','casa amplia cuenta con parqueadero para carro y moto buen sector y seguro',50000000000.00,'de contado','','Bogotá D.C.','2025-11-09','uploads/contratos/contrato_1_1762659872933.pdf','Generado','2025-11-08 22:44:32',5),(2,NULL,6,32,'Casa','juan ','tique','CC','1023364903','12 23 23 ','3175200910','juan','sebastian ','CC','1023364903','12 36 54','3175200910','441846814381',130.00,'av calle 1 #7-49','','casa amplia cuenta con parqueadero para carro y moto buen sector y seguro',50000000000.00,'de contado','','Bogotá D.C.','2025-11-09','uploads/contratos/contrato_2_1762662513556.pdf','Generado','2025-11-08 23:28:33',1),(3,NULL,8,7,'Apartamento','juan ','tique','CC','1023364903','12 23 23 ','3175200910','Andrés','rodrigues','CC','1023364945','56 45 7','3001110007','441846814382',95.00,'12 12 43','norte','apartamento cuenta con parqueo para moto y carro, require fiador ',70000000.00,'transferencia bancaria','','Bogotá D.C.','2025-11-12','uploads/contratos/contrato_3_1762988918697.pdf','Generado','2025-11-12 18:08:38',1),(4,NULL,9,30,'Lote','AD3WDAWDAW','WDWADDQ22D2A','CC','12313581','AV1 23 34','','Lucía','<FWQRFEAWF','CC','5648668464','12 45 63','3001110030','6568168468186486',185.00,'12 58 63','SUR','SDSDSDSDSDSDSDSDSDSDSDSDSD',100000000.00,'EFECTIVO DE CONTADO CON ESPECIE','HYWDJHASBVCUTVAWJHXDVTUVXQYWTFYAFYTEGHFFGAIYTG','Bogotá D.C.','2025-11-25','uploads/contratos/contrato_4_1764030902105.pdf','Generado','2025-11-24 19:35:02',8),(5,NULL,10,30,'Apartamento','asdasfrasfaf','aawdwadqdadawdwa','CC','146871531','12 32 65 ','3212516848','Lucía','rosa','CC','684648486184/64','3 2 32 2 ','3001110030','48164768464648',300.00,'65 32 78','sur','cuenta con parqueadero',2000000000.00,'pago incompleto mera lk','gsdggcuakebcjyabjv','Bogotá D.C.','2025-11-25','uploads/contratos/contrato_5_1764032338080.pdf','Generado','2025-11-24 19:58:58',15),(6,NULL,10,20,'Apartamento','juan ','tique','CC','1023364903','12 23 23 ','3175200910','Andrea','rodrigues','CC','1023364945','12 36 54','3001110020','441846814382',300.00,'65 32 78','dfsfsdfsdfs','cuenta con parqueadero',2000000000.00,'efsfsefesfesesf','esfesfesfesfesf','Bogotá D.C.','2025-12-08','uploads/contratos/contrato_6_1765210006231.pdf','Generado','2025-12-08 11:06:46',8);
/*!40000 ALTER TABLE `contrato_documento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documento_cliente`
--

DROP TABLE IF EXISTS `documento_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documento_cliente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `tipo_documento` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'cedula, comprobante_ingresos, comprobante_domicilio, escrituras, etc.',
  `nombre_archivo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruta_archivo` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `subido_por` int NOT NULL COMMENT 'Usuario que subió el documento',
  `fecha_subida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `subido_por` (`subido_por`),
  KEY `idx_cliente` (`cliente_id`),
  KEY `idx_tipo` (`tipo_documento`),
  KEY `idx_fecha` (`fecha_subida`),
  CONSTRAINT `documento_cliente_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id_cliente`) ON DELETE CASCADE,
  CONSTRAINT `documento_cliente_ibfk_2` FOREIGN KEY (`subido_por`) REFERENCES `usuario` (`id_usuario`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documento_cliente`
--

LOCK TABLES `documento_cliente` WRITE;
/*!40000 ALTER TABLE `documento_cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `documento_cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_estado_propiedad`
--

DROP TABLE IF EXISTS `historial_estado_propiedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_estado_propiedad` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `estado_anterior` enum('Disponible','Reservada','Vendida') DEFAULT NULL,
  `estado_nuevo` enum('Disponible','Reservada','Vendida') DEFAULT NULL,
  `fecha_cambio` datetime DEFAULT CURRENT_TIMESTAMP,
  `justificacion` text,
  `id_propiedad` int NOT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_propiedad` (`id_propiedad`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `historial_estado_propiedad_ibfk_1` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedad` (`id_propiedad`),
  CONSTRAINT `historial_estado_propiedad_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_estado_propiedad`
--

LOCK TABLES `historial_estado_propiedad` WRITE;
/*!40000 ALTER TABLE `historial_estado_propiedad` DISABLE KEYS */;
INSERT INTO `historial_estado_propiedad` VALUES (1,'Disponible','Vendida','2025-11-08 17:48:20',NULL,6,1),(2,'Disponible','Vendida','2025-11-08 17:51:24',NULL,5,1),(3,'Disponible','Vendida','2025-11-08 17:51:25',NULL,3,1),(4,'Reservada','Vendida','2025-11-08 17:51:27',NULL,2,1),(5,'Disponible','Vendida','2025-11-08 17:51:28',NULL,1,1),(6,'Vendida','Disponible','2025-11-08 17:51:47',NULL,6,1),(7,'Vendida','Disponible','2025-11-08 19:07:40',NULL,5,1),(8,'Vendida','Disponible','2025-11-08 19:07:41',NULL,4,1),(9,'Vendida','Disponible','2025-11-08 19:07:43',NULL,1,1),(10,'Vendida','Disponible','2025-11-08 19:07:44',NULL,2,1),(11,'Vendida','Disponible','2025-11-08 19:07:44',NULL,3,1),(12,'Disponible','Vendida','2025-11-08 19:32:00',NULL,1,5),(13,'Disponible','Vendida','2025-11-08 21:45:45',NULL,2,1),(14,'Disponible','Vendida','2025-11-08 23:33:01',NULL,6,1),(15,'Disponible','Vendida','2025-11-24 17:48:12',NULL,5,8),(16,'Disponible','Vendida','2025-11-24 17:48:13',NULL,4,8),(17,'Disponible','Vendida','2025-11-24 17:48:14',NULL,3,8),(18,'Vendida','Disponible','2025-11-24 18:05:15',NULL,1,8),(19,'Vendida','Disponible','2025-11-24 18:05:18',NULL,2,8),(20,'Disponible','Vendida','2025-11-24 18:05:19',NULL,2,8),(21,'Vendida','Disponible','2025-11-24 18:05:36',NULL,6,8);
/*!40000 ALTER TABLE `historial_estado_propiedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagen_propiedad`
--

DROP TABLE IF EXISTS `imagen_propiedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagen_propiedad` (
  `id_imagen` int NOT NULL AUTO_INCREMENT,
  `id_propiedad` int NOT NULL,
  `url` varchar(512) NOT NULL,
  `prioridad` int DEFAULT '0',
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_subida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_imagen`),
  KEY `id_propiedad` (`id_propiedad`),
  CONSTRAINT `imagen_propiedad_ibfk_1` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedad` (`id_propiedad`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagen_propiedad`
--

LOCK TABLES `imagen_propiedad` WRITE;
/*!40000 ALTER TABLE `imagen_propiedad` DISABLE KEYS */;
INSERT INTO `imagen_propiedad` VALUES (1,6,'/uploads/propiedad-1762631026542-851923894.jpeg',0,'Imagen 1','2025-11-08 19:43:46'),(2,7,'/uploads/propiedad-1762809406095-399751270.jpg',0,'Imagen 1','2025-11-10 21:16:46'),(3,7,'/uploads/propiedad-1762809406118-3411953.jpg',1,'Imagen 2','2025-11-10 21:16:46'),(4,7,'/uploads/propiedad-1762809406132-178563272.jpg',2,'Imagen 3','2025-11-10 21:16:46'),(5,7,'/uploads/propiedad-1762809406144-336546002.jpg',3,'Imagen 4','2025-11-10 21:16:46'),(6,8,'/uploads/propiedad-1762988782757-390569269.jpg',0,'Imagen 1','2025-11-12 23:06:22'),(7,8,'/uploads/propiedad-1762988782774-532023493.jpg',1,'Imagen 2','2025-11-12 23:06:22'),(8,8,'/uploads/propiedad-1762988782791-715366884.jpg',2,'Imagen 3','2025-11-12 23:06:22'),(9,8,'/uploads/propiedad-1762988782804-479700836.jpg',3,'Imagen 4','2025-11-12 23:06:22'),(10,8,'/uploads/propiedad-1762988782818-3950095.jpg',4,'Imagen 5','2025-11-12 23:06:22'),(11,8,'/uploads/propiedad-1762988782831-648185714.jpg',5,'Imagen 6','2025-11-12 23:06:22'),(12,9,'/uploads/propiedad-1764026611765-163643485.jpg',0,'Imagen 1','2025-11-24 23:23:31'),(13,10,'/uploads/propiedad-1764032208827-110289099.jpg',0,'Imagen 1','2025-11-25 00:56:48'),(14,10,'/uploads/propiedad-1764032208850-742264798.jpg',1,'Imagen 2','2025-11-25 00:56:48'),(15,10,'/uploads/propiedad-1764032208868-407367681.jpg',2,'Imagen 3','2025-11-25 00:56:48'),(16,10,'/uploads/propiedad-1764032208887-175006029.jpg',3,'Imagen 4','2025-11-25 00:56:48'),(17,10,'/uploads/propiedad-1764032208906-683397521.jpg',4,'Imagen 5','2025-11-25 00:56:48'),(18,10,'/uploads/propiedad-1764032208924-629978673.jpg',5,'Imagen 6','2025-11-25 00:56:48'),(19,10,'/uploads/propiedad-1764032208942-950201629.jpg',6,'Imagen 7','2025-11-25 00:56:48');
/*!40000 ALTER TABLE `imagen_propiedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interaccion_cliente`
--

DROP TABLE IF EXISTS `interaccion_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interaccion_cliente` (
  `id_interaccion` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `id_usuario` int NOT NULL,
  `tipo_interaccion` enum('Llamada','Mensaje','Visita') NOT NULL,
  `notas` text,
  `fecha_interaccion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_interaccion`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `interaccion_cliente_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `interaccion_cliente_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interaccion_cliente`
--

LOCK TABLES `interaccion_cliente` WRITE;
/*!40000 ALTER TABLE `interaccion_cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `interaccion_cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interes_propiedad`
--

DROP TABLE IF EXISTS `interes_propiedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interes_propiedad` (
  `id_interes` int NOT NULL AUTO_INCREMENT,
  `id_propiedad` int NOT NULL,
  `id_cliente` int DEFAULT NULL,
  `nombre_cliente` varchar(150) DEFAULT NULL,
  `correo_cliente` varchar(150) DEFAULT NULL,
  `telefono_cliente` varchar(50) DEFAULT NULL,
  `mensaje` text,
  `preferencias` json DEFAULT NULL,
  `estado` enum('Pendiente','Contactado','Agendado','Cancelado') DEFAULT 'Pendiente',
  `id_agente_asignado` int DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_interes`),
  KEY `id_propiedad` (`id_propiedad`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_agente_asignado` (`id_agente_asignado`),
  CONSTRAINT `interes_propiedad_ibfk_1` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedad` (`id_propiedad`),
  CONSTRAINT `interes_propiedad_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `interes_propiedad_ibfk_3` FOREIGN KEY (`id_agente_asignado`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interes_propiedad`
--

LOCK TABLES `interes_propiedad` WRITE;
/*!40000 ALTER TABLE `interes_propiedad` DISABLE KEYS */;
INSERT INTO `interes_propiedad` VALUES (2,1,1,'Juan Pérez','juan.perez1@example.com','3001110001','Estoy interesado en visitar esta propiedad el próximo lunes.','{\"hora\": \"10:00\", \"fecha\": \"2025-11-10\"}','Pendiente',NULL,'2025-11-06 02:24:59','2025-11-06 02:24:59');
/*!40000 ALTER TABLE `interes_propiedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `localidad`
--

DROP TABLE IF EXISTS `localidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `localidad` (
  `id_localidad` int NOT NULL AUTO_INCREMENT,
  `nombre_localidad` varchar(100) NOT NULL,
  PRIMARY KEY (`id_localidad`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `localidad`
--

LOCK TABLES `localidad` WRITE;
/*!40000 ALTER TABLE `localidad` DISABLE KEYS */;
INSERT INTO `localidad` VALUES (1,'Usaquén'),(2,'Chapinero'),(3,'Santa Fe'),(4,'San Cristóbal'),(5,'Usme'),(6,'Tunjuelito'),(7,'Bosa'),(8,'Kennedy'),(9,'Fontibón'),(10,'Engativá'),(11,'Suba'),(12,'Barrios Unidos'),(13,'Teusaquillo'),(14,'Los Mártires'),(15,'Antonio Nariño'),(16,'Puente Aranda'),(17,'La Candelaria'),(18,'Rafael Uribe Uribe'),(19,'Ciudad Bolívar'),(20,'Sumapaz'),(21,'Usaquén'),(22,'Chapinero'),(23,'Santa Fe'),(24,'San Cristóbal'),(25,'Usme'),(26,'Tunjuelito'),(27,'Bosa'),(28,'Kennedy'),(29,'Fontibón'),(30,'Engativá'),(31,'Suba'),(32,'Barrios Unidos'),(33,'Teusaquillo'),(34,'Los Mártires'),(35,'Antonio Nariño'),(36,'Puente Aranda'),(37,'La Candelaria'),(38,'Rafael Uribe Uribe'),(39,'Ciudad Bolívar'),(40,'Sumapaz');
/*!40000 ALTER TABLE `localidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `id_notificacion` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('EMAIL','WHATSAPP','SMS','PUSH') DEFAULT NULL,
  `canal` varchar(50) DEFAULT NULL,
  `destinatario` varchar(255) DEFAULT NULL,
  `asunto` varchar(255) DEFAULT NULL,
  `contenido` text,
  `estado` enum('Enviado','Error','Pendiente') DEFAULT 'Pendiente',
  `referencia_tipo` varchar(50) DEFAULT NULL,
  `referencia_id` int DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_notificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `propiedad`
--

DROP TABLE IF EXISTS `propiedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `propiedad` (
  `id_propiedad` int NOT NULL AUTO_INCREMENT,
  `tipo_propiedad` enum('Casa','Apartamento','Lote') NOT NULL,
  `direccion_formato` varchar(200) NOT NULL,
  `precio_propiedad` decimal(15,2) NOT NULL,
  `area_m2` decimal(10,2) NOT NULL,
  `num_habitaciones` int DEFAULT NULL,
  `num_banos` int DEFAULT NULL,
  `descripcion` text,
  `estado_propiedad` enum('Disponible','Reservada','Vendida') DEFAULT 'Disponible',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_venta` date DEFAULT NULL,
  `id_barrio` int NOT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id_propiedad`),
  KEY `id_barrio` (`id_barrio`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `propiedad_ibfk_1` FOREIGN KEY (`id_barrio`) REFERENCES `barrio` (`id_barrio`),
  CONSTRAINT `propiedad_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `propiedad`
--

LOCK TABLES `propiedad` WRITE;
/*!40000 ALTER TABLE `propiedad` DISABLE KEYS */;
INSERT INTO `propiedad` VALUES (1,'Casa','Cra 45 #23-10, Medellín',350000000.00,120.50,0,0,'Casa amplia con 3 habitaciones y patio trasero.','Disponible','2025-11-05 20:51:01',NULL,1,8),(2,'Apartamento','Cll 10 #15-45, Bogotá',280000000.00,85.00,0,0,'Apartamento moderno con balcón y vista a la ciudad.','Vendida','2025-11-05 20:51:01',NULL,2,8),(3,'Lote','Vereda La Esperanza, Cali',150000000.00,500.00,0,0,'Terreno ideal para construcción de vivienda rural.','Vendida','2025-11-05 20:51:01',NULL,3,8),(4,'Casa','Cll 72 #20-18, Barranquilla',420000000.00,150.00,0,0,'Casa de dos pisos con garaje doble y jardín.','Vendida','2025-11-05 20:51:01',NULL,1,8),(5,'Apartamento','Cra 30 #45-67, Bucaramanga',310000000.00,95.00,0,0,'Apartamento con 3 alcobas, piscina y gimnasio.','Vendida','2025-11-05 20:51:01',NULL,2,8),(6,'Casa','av calle 1 #7-49',50000000000.00,130.00,7,2,'casa amplia cuenta con parqueadero para carro y moto buen sector y seguro','Disponible','2025-11-08 14:43:46',NULL,115,8),(7,'Apartamento','cra45 #45-56',56000000.00,45.00,2,4,'fdawdwa','Disponible','2025-11-10 16:16:46',NULL,50,1),(8,'Apartamento','12 12 43',70000000.00,95.00,2,1,'apartamento cuenta con parqueo para moto y carro, require fiador ','Disponible','2025-11-12 18:06:22',NULL,111,1),(9,'Lote','12 58 63',100000000.00,185.00,0,0,NULL,'Disponible','2025-11-24 18:23:31',NULL,15,8),(10,'Apartamento','65 32 78',2000000000.00,300.00,5,2,'cuenta con parqueadero','Disponible','2025-11-24 19:56:48',NULL,100,15);
/*!40000 ALTER TABLE `propiedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reporte_ventas`
--

DROP TABLE IF EXISTS `reporte_ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporte_ventas` (
  `id_reporte` int NOT NULL AUTO_INCREMENT,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `total_ventas` decimal(15,2) DEFAULT NULL,
  `id_usuario` int NOT NULL,
  `estado_reporte` enum('Activo','Inactivo') DEFAULT 'Activo',
  PRIMARY KEY (`id_reporte`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `reporte_ventas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reporte_ventas`
--

LOCK TABLES `reporte_ventas` WRITE;
/*!40000 ALTER TABLE `reporte_ventas` DISABLE KEYS */;
/*!40000 ALTER TABLE `reporte_ventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` enum('Administrador','Agente') NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador'),(2,'Agente');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT 'Activo',
  `email_verificado` tinyint(1) DEFAULT '0',
  `email_token` varchar(64) DEFAULT NULL,
  `email_token_expires` datetime DEFAULT NULL,
  `id_rol` int NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  KEY `id_rol` (`id_rol`),
  KEY `idx_email_token_usuario` (`email_token`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'juan','tique','tiquesebasian53@gmail.com','3175200910','juans','$2b$10$Ok2.lOmU.ehDUozwrqmWM.CKzYxM7sdHHBnpzDhDD7QVs86VMYiPe','Activo',0,NULL,NULL,1,'ca7223c9ea046e00f98e0447a687ede2c8355a227e5917ffa66701e0db0320a3','2025-11-08 13:12:58'),(2,'juan','tique','sebasian53@gmail.com','3175200910','sebastian','$2b$10$wBAyGsmwZWXUhsaZZwNv8.ecEwSYe5nqh2UyiAqKxu/kS1A1H9XE2','Activo',0,NULL,NULL,2,NULL,NULL),(3,'jorge','tique','tique397@gmail.com','3188677500','george','$2b$10$xQHjCauZxeBeQs2jtxpbuuWvFj8HQmlV5DMCSft8cgyS.H0/nImeC','Activo',0,NULL,NULL,2,NULL,NULL),(4,'helen','tique','admin@inmogestion.com','3175200910','helen','$2b$10$nqBo4PbqST6U19sUTCO7lOI6Hvgetq0GhVSNBZGwEk4oQPNyp4/Yy','Activo',0,NULL,NULL,2,NULL,NULL),(5,'sebastian','tique','tiquesebastian53@gmail.com','3175200910','juancho','$2b$10$4glRmK982LPtt.VmAl4wUus5AVXQYpvmKTVW3aumxO5GAM68k2UI6','Activo',0,NULL,NULL,1,NULL,NULL),(8,'sebascho','tique','mipcmamon1@gmail.com','3002556412','sebachso','$2b$10$9TZGTremCBvaTdSYege/tOqTczEaPM/eE8rMv77mSx4qtK4J1JDuW','Activo',1,NULL,NULL,1,NULL,NULL),(15,'agente','hitman','supcmamon1@gmail.com','300148415','agente47','$2b$10$ZHt31b2gwDnYHuW.XWMDReFLKY5XnaafWKktKSRNyGcNVlUGHvDk.','Activo',1,NULL,NULL,2,NULL,NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visita`
--

DROP TABLE IF EXISTS `visita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visita` (
  `id_visita` int NOT NULL AUTO_INCREMENT,
  `id_propiedad` int NOT NULL,
  `id_cliente` int NOT NULL,
  `id_agente` int NOT NULL,
  `fecha_visita` datetime NOT NULL,
  `hora_visita` time DEFAULT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'Programada',
  `notas` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `recordatorio_enviado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_visita`),
  KEY `id_propiedad` (`id_propiedad`),
  KEY `id_agente` (`id_agente`),
  KEY `idx_visita_cliente_fecha` (`id_cliente`,`fecha_visita`),
  CONSTRAINT `visita_ibfk_1` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedad` (`id_propiedad`),
  CONSTRAINT `visita_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `visita_ibfk_3` FOREIGN KEY (`id_agente`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visita`
--

LOCK TABLES `visita` WRITE;
/*!40000 ALTER TABLE `visita` DISABLE KEYS */;
INSERT INTO `visita` VALUES (1,1,1,1,'2025-11-12 10:00:00',NULL,'Pendiente','Visita programada por el agente Juan Tique con el cliente Juan Pérez.','2025-11-06 02:27:15','2025-11-06 02:27:15',0),(2,1,1,3,'2025-11-05 19:59:00',NULL,'Pendiente',NULL,'2025-11-09 00:59:05','2025-11-09 00:59:05',0),(3,1,1,3,'2025-11-18 19:59:00',NULL,'Pendiente',NULL,'2025-11-09 00:59:15','2025-11-09 00:59:15',0),(4,1,32,3,'2025-11-19 00:00:00',NULL,'Pendiente','legar puntual por favor','2025-11-09 01:13:56','2025-11-09 01:13:56',0),(5,6,32,3,'2025-11-09 00:00:00',NULL,'Pendiente','llegue puntual careverga','2025-11-09 01:14:55','2025-11-09 01:14:55',0);
/*!40000 ALTER TABLE `visita` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-10  7:00:13
