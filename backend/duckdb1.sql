/*
Navicat MySQL Data Transfer

Source Server         : duckbook
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : duckdb

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2024-02-14 08:51:53
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tbl_files
-- ----------------------------
DROP TABLE IF EXISTS `tbl_files`;
CREATE TABLE `tbl_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_files
-- ----------------------------

-- ----------------------------
-- Table structure for tbl_tables
-- ----------------------------
DROP TABLE IF EXISTS `tbl_tables`;
CREATE TABLE `tbl_tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) DEFAULT NULL,
  `table_name` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `data` text,
  `created_at` varchar(255) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_tables
-- ----------------------------
INSERT INTO `tbl_tables` VALUES ('116', '25', 'NoTitle', '0', '[{\"type\":0,\"value\":\"\",\"path\":{\"tablename\":\"\",\"filepath\":\"\"}}]', '2024-02-11T21:14:01.006Z', 'IDDDNobebINeerToIbeote');
INSERT INTO `tbl_tables` VALUES ('117', '25', 'NoTitle', '0', '[{\"type\":0,\"value\":\"\",\"path\":{\"tablename\":\"\",\"filepath\":\"\"}}]', '2024-02-11T21:14:01.063Z', 'neeTtbeabertrlTeooDgea');
INSERT INTO `tbl_tables` VALUES ('120', '26', 'NoTitle', '0', '[{\"type\":0,\"value\":\"\",\"path\":{\"tablename\":\"\",\"filepath\":\"\"}},{\"type\":11,\"value\":\"\",\"path\":{\"tablename\":\"mt cars (1).csv\",\"filepath\":\"mt cars (1).csv\",\"filesize\":1752}},null,{\"type\":3,\"value\":\"{\\\"schema\\\":[{\\\"type\\\":0,\\\"value\\\":\\\"\\\",\\\"path\\\":{\\\"tablename\\\":\\\"\\\",\\\"filepath\\\":\\\"\\\",\\\"filesize\\\":\\\"\\\"}}],\\\"title\\\":\\\"\\\",\\\"subTitle\\\":\\\"\\\",\\\"xAxisTitle\\\":\\\"\\\",\\\"yAxisTitle\\\":\\\"Row Count\\\",\\\"xAxisArray\\\":[],\\\"SourceArray\\\":[],\\\"source\\\":0,\\\"barValue\\\":0,\\\"xAxisValue\\\":1,\\\"sort_Type\\\":0,\\\"limit_Type\\\":0}\",\"path\":{\"tablename\":\"\",\"filepath\":\"\",\"filesize\":\"\"}},{\"type\":3,\"value\":\"{\\\"schema\\\":[{\\\"type\\\":0,\\\"value\\\":\\\"\\\",\\\"path\\\":{\\\"tablename\\\":\\\"\\\",\\\"filepath\\\":\\\"\\\",\\\"filesize\\\":\\\"\\\"}}],\\\"title\\\":\\\"\\\",\\\"subTitle\\\":\\\"\\\",\\\"xAxisTitle\\\":\\\"\\\",\\\"yAxisTitle\\\":\\\"Row Count\\\",\\\"xAxisArray\\\":[],\\\"yAxisArray\\\":[\\\"Row Count\\\"],\\\"SourceArray\\\":[],\\\"source\\\":0,\\\"barValue\\\":0,\\\"xAxisValue\\\":1,\\\"yAxisValue\\\":0,\\\"sort_Type\\\":0,\\\"limit_Type\\\":0}\",\"path\":{\"tablename\":\"\",\"filepath\":\"\",\"filesize\":\"\"}},{\"type\":3,\"value\":\"{\\\"schema\\\":[{\\\"type\\\":11,\\\"value\\\":\\\"\\\",\\\"path\\\":{\\\"tablename\\\":\\\"mt cars (1).csv\\\",\\\"filepath\\\":\\\"mt cars (1).csv\\\",\\\"filesize\\\":1752}},{\\\"type\\\":3,\\\"value\\\":\\\"{\\\\\\\"schema\\\\\\\":[{\\\\\\\"type\\\\\\\":0,\\\\\\\"value\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"path\\\\\\\":{\\\\\\\"tablename\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"filepath\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"filesize\\\\\\\":\\\\\\\"\\\\\\\"}}],\\\\\\\"title\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"subTitle\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"xAxisTitle\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"yAxisTitle\\\\\\\":\\\\\\\"Row Count\\\\\\\",\\\\\\\"xAxisArray\\\\\\\":[],\\\\\\\"yAxisArray\\\\\\\":[\\\\\\\"Row Count\\\\\\\"],\\\\\\\"SourceArray\\\\\\\":[],\\\\\\\"source\\\\\\\":0,\\\\\\\"barValue\\\\\\\":0,\\\\\\\"xAxisValue\\\\\\\":1,\\\\\\\"yAxisValue\\\\\\\":0,\\\\\\\"sort_Type\\\\\\\":0,\\\\\\\"limit_Type\\\\\\\":0}\\\",\\\"path\\\":{\\\"tablename\\\":\\\"\\\",\\\"filepath\\\":\\\"\\\",\\\"filesize\\\":\\\"\\\"}},{\\\"type\\\":131,\\\"value\\\":\\\"\\\",\\\"path\\\":{\\\"tablename\\\":\\\"\\\",\\\"filepath\\\":\\\"\\\",\\\"filesize\\\":\\\"\\\"}}],\\\"title\\\":\\\"\\\",\\\"subTitle\\\":\\\"\\\",\\\"xAxisTitle\\\":\\\"model\\\",\\\"yAxisTitle\\\":\\\"hp\\\",\\\"xAxisArray\\\":[\\\"model\\\",\\\"mpg\\\",\\\"cyl\\\",\\\"disp\\\",\\\"hp\\\",\\\"drat\\\",\\\"wt\\\",\\\"qsec\\\",\\\"vs\\\",\\\"am\\\",\\\"gear\\\",\\\"carb\\\"],\\\"yAxisArray\\\":[\\\"Row Count\\\",\\\"mpg\\\",\\\"cyl\\\",\\\"disp\\\",\\\"hp\\\",\\\"drat\\\",\\\"wt\\\",\\\"qsec\\\",\\\"vs\\\",\\\"am\\\",\\\"gear\\\",\\\"carb\\\"],\\\"SourceArray\\\":[\\\"mt cars (1).csv\\\"],\\\"source\\\":0,\\\"barValue\\\":2,\\\"xAxisValue\\\":0,\\\"yAxisValue\\\":4,\\\"sort_Type\\\":0,\\\"limit_Type\\\":0}\",\"path\":{\"tablename\":\"\",\"filepath\":\"\",\"filesize\":\"\"}},{\"type\":15,\"value\":\"\",\"path\":{\"tablename\":\"mt cars (1).csv\",\"filepath\":\"mt cars (1).csv\",\"filesize\":1752}}]', '2024-02-13T21:37:07.739Z', 'ibiITTaetlltTIenlnrlnr');
INSERT INTO `tbl_tables` VALUES ('121', '26', 'NoTitle', '0', '[{\"type\":0,\"value\":\"\",\"path\":{\"tablename\":\"\",\"filepath\":\"\"}}]', '2024-02-13T21:37:07.741Z', 'Teeile2DT2leee6aeTtaDt');
INSERT INTO `tbl_tables` VALUES ('122', '30', 'NoTitle', '0', '[{\"type\":0,\"value\":\"\",\"path\":{\"tablename\":\"\",\"filepath\":\"\"}}]', '2024-02-14T06:03:21.505Z', '0Ditte3llbeirletntTTnN');
INSERT INTO `tbl_tables` VALUES ('123', '30', 'NoTitle', '0', '[{\"type\":0,\"value\":\"\",\"path\":{\"tablename\":\"\",\"filepath\":\"\"}}]', '2024-02-14T06:03:21.535Z', '0elteTeNenlTiNei3gN3tn');
INSERT INTO `tbl_tables` VALUES ('124', '34', 'NoTitle', '0', '[{\"type\":0,\"value\":\"\",\"path\":{\"tablename\":\"\",\"filepath\":\"\"}}]', '2024-02-14T06:27:23.461Z', 'ragletDaetaegntlbieeee');

-- ----------------------------
-- Table structure for tbl_users
-- ----------------------------
DROP TABLE IF EXISTS `tbl_users`;
CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `image` text,
  `created_at` varchar(255) DEFAULT NULL,
  `login_type` int(1) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `otp` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_users
-- ----------------------------
INSERT INTO `tbl_users` VALUES ('25', '0', 'topdeveloper9032@gmail.com', 'd41d8cd98f00b204e9800998ecf8427e', '1', '8.png', '2024-02-11T21:13:06.591Z', '1', '54.227.198.221 (Ashburn,US)', 'Chrome 121.0.0.0', '');
INSERT INTO `tbl_users` VALUES ('34', '0', 'happydream9032@gmail.com', 'af8a6dee935e28a67532f57e6571a978', '1', '', '2024-02-14T06:26:46.987Z', '0', '54.227.198.221 (Ashburn,US)', 'Chrome 121.0.0.0', '738649');
INSERT INTO `tbl_users` VALUES ('35', '34', 'abc@gmail.com', 'af8a6dee935e28a67532f57e6571a978', '1', '8.png', '2024-02-14T06:26:46.987Z', '0', '54.227.198.221 (Ashburn,US)', 'Chrome 121.0.0.0', null);
