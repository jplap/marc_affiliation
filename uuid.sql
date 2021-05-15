CREATE DATABASE `uuidformDB`;
USE `uuidformDB`;

DROP TABLE IF EXISTS `uuidformTable`;

SET character_set_client = utf8mb4 ;

CREATE TABLE `uuidformTable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `formid` varchar(16) NOT NULL,
  `name` varchar(255) NOT NULL,
  `state` int(2) DEFAULT 0,
  `creation_date` TIMESTAMP  NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


LOCK TABLES `uuidformTable` WRITE;

INSERT INTO `uuidformTable` VALUES (111,'11','form1',0,NOW()), (112,'12','form2',0,NOW()), (113,'13','form3',0,NOW());

UNLOCK TABLES;
