/*
Navicat MySQL Data Transfer

Source Server         : duckbook
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : duckdb

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2024-01-26 12:11:40
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tbl_tables
-- ----------------------------
DROP TABLE IF EXISTS `tbl_tables`;
CREATE TABLE `tbl_tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `table_name` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `data` text,
  `created_at` varchar(255) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_tables
-- ----------------------------
INSERT INTO `tbl_tables` VALUES ('62', '2147483647', 'NoTitle', '0', '[{\"type\":0,\"value\":\"\",\"path\":{\"table_name\":\"\",\"filepath\":\"\"}},{\"type\":11,\"value\":\"\",\"path\":{\"table_name\":\"aiprompt.csv\",\"filepath\":\"aiprompt.csv\"}}]', '2024-01-26T10:47:17.769Z', '5e54D6to4Tban4ee5beIDe');
INSERT INTO `tbl_tables` VALUES ('63', '2147483647', 'NoTitle', '0', '[{\"type\":0,\"value\":\"\",\"path\":{\"table_name\":\"\",\"filepath\":\"\"}}]', '2024-01-26T10:47:17.777Z', '5abo6g6rI46254te2elbNT');

-- ----------------------------
-- Table structure for tbl_users
-- ----------------------------
DROP TABLE IF EXISTS `tbl_users`;
CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `login_type` int(1) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_users
-- ----------------------------
