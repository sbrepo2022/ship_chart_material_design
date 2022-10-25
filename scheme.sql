-- MariaDB dump 10.19  Distrib 10.5.15-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: ship_chart
-- ------------------------------------------------------
-- Server version	10.5.15-MariaDB-0ubuntu0.21.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity` (
  `activity_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `activity_date` date NOT NULL,
  `work_type` varchar(64) NOT NULL,
  `work_hours` int(11) NOT NULL,
  `paid_for` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`activity_id`),
  KEY `activity_employees_employee_id_fk` (`employee_id`),
  CONSTRAINT `activity_employees_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` VALUES (31,3,'2022-01-05','cleaning',4,1),(32,1,'2022-01-05','cleaning',3,0),(33,3,'2022-01-07','offload',5,1),(34,4,'2022-01-07','offload',1,0),(37,3,'2022-02-10','cleaning',10,0);
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `counter`
--

DROP TABLE IF EXISTS `counter`;
/*!50001 DROP VIEW IF EXISTS `counter`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `counter` (
  `employee_id` tinyint NOT NULL,
  `work_hours_sum` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `emp_off`
--

DROP TABLE IF EXISTS `emp_off`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emp_off` (
  `emp_off_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `offload_date` date NOT NULL,
  `work_hours` int(11) NOT NULL,
  `offload_id` int(11) NOT NULL,
  `history` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`emp_off_id`),
  KEY `emp_off_employees_employee_id_fk` (`employee_id`),
  KEY `emp_off_offloads_offload_id_fk` (`offload_id`),
  CONSTRAINT `emp_off_employees_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `emp_off_offloads_offload_id_fk` FOREIGN KEY (`offload_id`) REFERENCES `offloads` (`offload_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emp_off`
--

LOCK TABLES `emp_off` WRITE;
/*!40000 ALTER TABLE `emp_off` DISABLE KEYS */;
INSERT INTO `emp_off` VALUES (21,3,'2022-01-07',5,16,1),(22,4,'2022-01-07',1,16,1),(23,1,'2022-01-11',12,17,0),(24,4,'2022-01-13',3,17,0),(25,3,'2022-01-07',5,18,0),(26,1,'2022-01-07',5,18,0),(33,1,'2022-02-03',12,22,0),(34,4,'2022-02-04',1,22,0);
/*!40000 ALTER TABLE `emp_off` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(64) NOT NULL,
  `lastname` varchar(64) NOT NULL,
  `midname` varchar(64) NOT NULL,
  `birthday` date NOT NULL,
  `admission` date NOT NULL,
  `dismission` date DEFAULT NULL,
  `department_id` int(11) NOT NULL,
  `img_url` varchar(256) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Иван','Иванович','Иванов','1984-03-25','2012-03-25',NULL,1,'huzxyaalkadl_307278-svetik.jpg',0),(2,'Вася','Пупкин','Васильевич','1990-12-01','2010-03-25','2022-01-22',1,'huzxyaalkadl_307278-svetik.jpg',0),(3,'Сергей','Борисов','Дмитриевич','2001-05-31','2001-06-01',NULL,2,'aldxvkdgmqva_munkavallalo-megfigyelese.jpg',0),(4,'Самый','Сотрудник','Ленивый','1988-04-09','2012-04-09',NULL,3,'',0),(5,'Тест','Тест','Тест','2021-12-23','2021-12-31','2022-01-01',12,'tqleuqfhdjca_munkavallalo-megfigyelese.jpg',0);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offloads`
--

DROP TABLE IF EXISTS `offloads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `offloads` (
  `offload_id` int(11) NOT NULL AUTO_INCREMENT,
  `entry_dt` datetime NOT NULL,
  `exit_dt` datetime DEFAULT NULL,
  `ship_id` int(11) NOT NULL,
  PRIMARY KEY (`offload_id`),
  KEY `offloads_ships_ship_id_fk` (`ship_id`),
  CONSTRAINT `offloads_ships_ship_id_fk` FOREIGN KEY (`ship_id`) REFERENCES `ships` (`ship_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offloads`
--

LOCK TABLES `offloads` WRITE;
/*!40000 ALTER TABLE `offloads` DISABLE KEYS */;
INSERT INTO `offloads` VALUES (16,'2022-01-05 00:13:00','2022-01-08 00:22:00',2),(17,'2022-01-05 00:22:00','2022-01-14 00:23:00',1),(18,'2022-01-05 00:23:00',NULL,3),(22,'2022-02-10 15:57:00',NULL,4);
/*!40000 ALTER TABLE `offloads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ports`
--

DROP TABLE IF EXISTS `ports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `port_name` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ports`
--

LOCK TABLES `ports` WRITE;
/*!40000 ALTER TABLE `ports` DISABLE KEYS */;
INSERT INTO `ports` VALUES (1,'Порт СПб'),(2,'Brazil international port'),(3,'Магадан');
/*!40000 ALTER TABLE `ports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ships`
--

DROP TABLE IF EXISTS `ships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ships` (
  `ship_id` int(11) NOT NULL AUTO_INCREMENT,
  `ship_name` varchar(64) NOT NULL,
  `port_id` int(11) NOT NULL,
  `img_url` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`ship_id`),
  KEY `ships_ports_id_fk` (`port_id`),
  CONSTRAINT `ships_ports_id_fk` FOREIGN KEY (`port_id`) REFERENCES `ports` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ships`
--

LOCK TABLES `ships` WRITE;
/*!40000 ALTER TABLE `ships` DISABLE KEYS */;
INSERT INTO `ships` VALUES (1,'Аврора',2,'cbwyoixjchzf_more-nebo-korabl-2.jpg'),(2,'Авраам Линкольн',2,'rrcjilxnwbqr_more-nebo-korabl-2.jpg'),(3,'Дункан',3,'huzxyaalkadl_307278-svetik.jpg'),(4,'Наутилус',3,'sqizvgymaecq_Ships_Sailing_Rivers.jpg');
/*!40000 ALTER TABLE `ships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(64) NOT NULL,
  `password` varchar(128) NOT NULL,
  `u_group` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','pbkdf2:sha256:260000$HXXzJdC6wWnqRne7$d067a931a87a9c92218b4dc2e5f8ea36e9919b684d2568028860e8402c8de933',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `counter`
--

/*!50001 DROP TABLE IF EXISTS `counter`*/;
/*!50001 DROP VIEW IF EXISTS `counter`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `counter` AS (select `activity`.`employee_id` AS `employee_id`,sum(`activity`.`work_hours`) AS `work_hours_sum` from `activity` group by `activity`.`employee_id`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-25 18:43:49
