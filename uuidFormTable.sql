CREATE DATABASE `uuidformDB`;
USE `uuidformDB`;

DROP TABLE IF EXISTS `uuidformTable`;

SET character_set_client = utf8mb4 ;

CREATE TABLE `uuidformTable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `formid` varchar(255) NOT NULL,
  `programTitle` varchar(255) NOT NULL,
  `programId` varchar(255) NOT NULL,
  `state` int(2) DEFAULT 0,
  `historyChild` int(2) DEFAULT 0,
  `affilae_data` json,
  `insersionDB_date` TIMESTAMP  NOT NULL,
  `creation_date` int(11) NOT NULL,

  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


LOCK TABLES `uuidformTable` WRITE;

INSERT INTO `uuidformTable` VALUES (1,'123','programme bidon','6086a6b8e302e67e42610b68', 0,1,'[{"title":"Focus, L\u0027\u00e9cole de pr\u00e9paration mentale","url":"https:\/\/www.focus-formations.com\/","slug":"focus-lecole-de-preparation-mentale","id":"6086a6b8e302e67e42610b68"},{"title":"Test","url":"https:\/\/www.focus-formations.com\/","slug":"test-200","id":"60981dc7d7eeec36352d830b"}]',NOW(),1225540800);

UNLOCK TABLES;


