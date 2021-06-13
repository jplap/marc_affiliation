CREATE DATABASE `uuidformDB`;
USE `uuidformDB`;

DROP TABLE IF EXISTS `uuidformHistoryTable`;

SET character_set_client = utf8mb4 ;

CREATE TABLE `uuidformHistoryTable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `formid_original` varchar(255) NOT NULL,
  `formid` varchar(255) NOT NULL,
  `affilae_conversion` json,
  `date_action` TIMESTAMP  NOT NULL,
  KEY (`formid_original`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


LOCK TABLES `uuidformHistoryTable` WRITE;

INSERT INTO `uuidformHistoryTable` VALUES  (1,'12','12_3','[{"title":"test"}]',NOW()), (2,'12','12_4','[{"title":"test"}]',NOW()) ;

UNLOCK TABLES;


