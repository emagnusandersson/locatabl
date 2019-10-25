-- MySQL dump 10.16  Distrib 10.1.41-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: mmm
-- ------------------------------------------------------
-- Server version	10.1.41-MariaDB-0+deb9u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `cleaner_complaint`
--

LOCK TABLES `cleaner_complaint` WRITE;
/*!40000 ALTER TABLE `cleaner_complaint` DISABLE KEYS */;
/*!40000 ALTER TABLE `cleaner_complaint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cleaner_customer`
--

LOCK TABLES `cleaner_customer` WRITE;
/*!40000 ALTER TABLE `cleaner_customer` DISABLE KEYS */;
INSERT INTO `cleaner_customer` VALUES (1,0,'2019-10-27 03:47:22','2019-11-01 14:16:45',64,'2019-11-01 14:16:45',0,2147483647,'45588','','','USD','2019-10-27 03:47:22',140.51938389545603,74.56986848958104,'',0,0,1000,0,0,0,0,0,0,0,0,0,0,1,0);
/*!40000 ALTER TABLE `cleaner_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cleaner_customerTeam`
--

LOCK TABLES `cleaner_customerTeam` WRITE;
/*!40000 ALTER TABLE `cleaner_customerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `cleaner_customerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cleaner_customerTeamImage`
--

LOCK TABLES `cleaner_customerTeamImage` WRITE;
/*!40000 ALTER TABLE `cleaner_customerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `cleaner_customerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cleaner_seller`
--

LOCK TABLES `cleaner_seller` WRITE;
/*!40000 ALTER TABLE `cleaner_seller` DISABLE KEYS */;
INSERT INTO `cleaner_seller` VALUES (1,1,'2014-08-25 04:24:48','2019-11-01 14:16:45',269501893,'2019-11-02 15:41:08',42940427,2147483647,'','closeby.market','','SEK','2018-06-27 06:13:26',140.52905007460478,74.59787856861158,'',0,0,20000,0,'bike',40.00,'km',15.00,300.00,'2018-06-27 06:15:00',0,0,0,0,1,0),(7,0,'2017-04-15 11:01:45','2017-04-15 11:01:45',0,'2017-04-15 11:01:45',0,2592000,'3512582389','','','USD','2017-04-15 11:01:45',134.56783000000001,91.49230000000001,'',0,0,20000,0,'sedan',0.00,'km',0.00,0.00,'0000-00-00 00:00:00',0,0,0,0,0,0);
/*!40000 ALTER TABLE `cleaner_seller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cleaner_sellerTeam`
--

LOCK TABLES `cleaner_sellerTeam` WRITE;
/*!40000 ALTER TABLE `cleaner_sellerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `cleaner_sellerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cleaner_sellerTeamImage`
--

LOCK TABLES `cleaner_sellerTeamImage` WRITE;
/*!40000 ALTER TABLE `cleaner_sellerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `cleaner_sellerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cleaner_setting`
--

LOCK TABLES `cleaner_setting` WRITE;
/*!40000 ALTER TABLE `cleaner_setting` DISABLE KEYS */;
INSERT INTO `cleaner_setting` VALUES ('boAllowEmailAccountCreation','0'),('boGotNewVendors','0'),('boShowTeam','0'),('nUser','0'),('tLastWriteOfBoShow','1572709268'),('tLastWriteOfHA','18202');
/*!40000 ALTER TABLE `cleaner_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cleaner_user`
--

LOCK TABLES `cleaner_user` WRITE;
/*!40000 ALTER TABLE `cleaner_user` DISABLE KEYS */;
INSERT INTO `cleaner_user` VALUES (1,'2017-11-01 11:45:53','100002646477985',NULL,NULL,'emagnusandersson@gmail.com','Magnus Andersson','https://scontent.xx.fbcdn.net/v/t1.0-1/c12.12.155.155a/s50x50/283555_110561719042043_5647438_n.jpg?_nc_cat=104&_nc_oc=AQnjGu-jcEYOLAkgUAfiDYhbj2layE3sIB303PE52-Id7rgB6ZVIYUGop8zWJgUtRDM&_nc_ht=scontent.xx&oh=1b56128d4f34cab6f74f5fd6ebfcffbc&oe=5E615642','',2,1,'Magnus',0,'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIhA1pmHtMAHisXnHnoe8hZRiJroi6cG\nf+O3ru4Pt3KmxwOP1nUmNBZmH4rFpKFDmN/Yz5KU0pATqXd3NKycIncCAwEAAQ==\n',128,0,0,0,0,1),(7,'2017-11-01 11:45:53','803775206451912',NULL,NULL,'example1@example.com','Rich Prince','https://scontent.xx.fbcdn.net/v/t1.0-1/c0.15.50.50/p50x50/17353140_787408721421894_5980762204490463950_n.jpg?oh=542606c2a567518b63afbe8d7ea9d055&oe=594DFFE6','',0,0,'Rich Prince',0,'',0,0,0,0,0,0);
/*!40000 ALTER TABLE `cleaner_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cleaner_userImage`
--

LOCK TABLES `cleaner_userImage` WRITE;
/*!40000 ALTER TABLE `cleaner_userImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `cleaner_userImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cleaner_webPushSubscription`
--

LOCK TABLES `cleaner_webPushSubscription` WRITE;
/*!40000 ALTER TABLE `cleaner_webPushSubscription` DISABLE KEYS */;
INSERT INTO `cleaner_webPushSubscription` VALUES (1,'{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/edPsWs8pa4E:APA91bGI12LBM9CVh7tviqAtxufWPnlO58cglqfAxscVZfke__rxnHLaVFDFRSo-rzR0OhLFJyi208iNgCRQ9LuEdE7tGh91qOQ_3WCTY-je68saM1uZtsF2e_zgz59LZXCxaprPHzHN\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BCFQwT3SVjtL5x_biyrBzbsWKPbBCkQEKcf9xxU_nLNLVwoiEFxE6e2x5Tmlzgbk2TKEz11mnVBuiYOb0wKYY6c\",\"auth\":\"r43kR3M9U08F6E2nxjx4GA\"}}');
/*!40000 ALTER TABLE `cleaner_webPushSubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fruitpicker_complaint`
--

LOCK TABLES `fruitpicker_complaint` WRITE;
/*!40000 ALTER TABLE `fruitpicker_complaint` DISABLE KEYS */;
/*!40000 ALTER TABLE `fruitpicker_complaint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fruitpicker_customer`
--

LOCK TABLES `fruitpicker_customer` WRITE;
/*!40000 ALTER TABLE `fruitpicker_customer` DISABLE KEYS */;
INSERT INTO `fruitpicker_customer` VALUES (1,0,'2019-11-01 19:36:53','2019-11-01 19:36:53',1,'2019-11-01 19:36:53',0,2147483647,'','','','USD','2019-11-01 19:36:53',0,0,'',0,0,1000,0,0,'','',0,0,0,0,1,0);
/*!40000 ALTER TABLE `fruitpicker_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fruitpicker_customerTeam`
--

LOCK TABLES `fruitpicker_customerTeam` WRITE;
/*!40000 ALTER TABLE `fruitpicker_customerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `fruitpicker_customerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fruitpicker_customerTeamImage`
--

LOCK TABLES `fruitpicker_customerTeamImage` WRITE;
/*!40000 ALTER TABLE `fruitpicker_customerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `fruitpicker_customerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fruitpicker_seller`
--

LOCK TABLES `fruitpicker_seller` WRITE;
/*!40000 ALTER TABLE `fruitpicker_seller` DISABLE KEYS */;
INSERT INTO `fruitpicker_seller` VALUES (1,1,'2014-06-09 11:16:12','2019-11-01 14:16:45',136372785,'2019-11-01 19:36:36',42539198,2147483647,'','closeby.market','','SEK','2018-08-13 07:37:58',140.52905007460478,74.59787856861158,'',0,0,20000,0,'bike',40.00,'km',10.00,200.00,0,0,0,0,0,0),(61,0,'2014-07-30 21:48:38','2014-07-30 21:48:38',0,'2014-07-30 21:48:38',0,2592000,'29692','','','USD','2014-07-30 21:48:38',0,0,'',0,0,20000,0,'foot',0.00,'km',0.00,15.00,0,0,0,0,0,0),(71,0,'2015-11-13 20:48:16','2015-11-13 20:48:16',0,'2015-11-13 20:48:16',0,2592000,'00385919187806','','','USD','2015-11-13 20:48:16',0,0,'',0,0,20000,0,'foot',0.00,'km',0.00,0.00,0,0,0,0,0,0);
/*!40000 ALTER TABLE `fruitpicker_seller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fruitpicker_sellerTeam`
--

LOCK TABLES `fruitpicker_sellerTeam` WRITE;
/*!40000 ALTER TABLE `fruitpicker_sellerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `fruitpicker_sellerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fruitpicker_sellerTeamImage`
--

LOCK TABLES `fruitpicker_sellerTeamImage` WRITE;
/*!40000 ALTER TABLE `fruitpicker_sellerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `fruitpicker_sellerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fruitpicker_setting`
--

LOCK TABLES `fruitpicker_setting` WRITE;
/*!40000 ALTER TABLE `fruitpicker_setting` DISABLE KEYS */;
INSERT INTO `fruitpicker_setting` VALUES ('boAllowEmailAccountCreation','0'),('boGotNewVendors','0'),('boShowTeam','0'),('nUser','0'),('tLastWriteOfBoShow','1572636996'),('tLastWriteOfHA','18201');
/*!40000 ALTER TABLE `fruitpicker_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fruitpicker_user`
--

LOCK TABLES `fruitpicker_user` WRITE;
/*!40000 ALTER TABLE `fruitpicker_user` DISABLE KEYS */;
INSERT INTO `fruitpicker_user` VALUES (1,'2017-11-01 11:50:17','100002646477985',NULL,NULL,'emagnusandersson@gmail.com','Magnus Andersson','https://scontent.xx.fbcdn.net/v/t1.0-1/c12.12.155.155a/s50x50/283555_110561719042043_5647438_n.jpg?_nc_cat=104&_nc_oc=AQnjGu-jcEYOLAkgUAfiDYhbj2layE3sIB303PE52-Id7rgB6ZVIYUGop8zWJgUtRDM&_nc_ht=scontent.xx&oh=1b56128d4f34cab6f74f5fd6ebfcffbc&oe=5E615642','',1,1,'Magnus',0,'MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAS6ZljvxggwjpM8huSTpocukVy+nmiV4z\nX1E7BEig2tJi2iRLJTvIgCLtoArG2V6B9kuYX3qrvXrkMaUB7KPF3QIDAQAB\n',128,0,0,0,0,0),(61,'2017-11-01 11:50:17','100002181781139',NULL,NULL,'example1@example.com','','http://graph.facebook.com/100002181781139/picture','',0,0,'Sargi Zod',0,'',0,0,0,0,0,0),(71,'2017-11-01 11:50:17','957499570989108',NULL,NULL,'example2@example.com','','http://graph.facebook.com/957499570989108/picture','',0,0,'Jasenka Cindric',0,'',0,0,0,0,0,0);
/*!40000 ALTER TABLE `fruitpicker_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fruitpicker_userImage`
--

LOCK TABLES `fruitpicker_userImage` WRITE;
/*!40000 ALTER TABLE `fruitpicker_userImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `fruitpicker_userImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fruitpicker_webPushSubscription`
--

LOCK TABLES `fruitpicker_webPushSubscription` WRITE;
/*!40000 ALTER TABLE `fruitpicker_webPushSubscription` DISABLE KEYS */;
INSERT INTO `fruitpicker_webPushSubscription` VALUES (1,'{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/ePcLc2kaU78:APA91bEzZFg_FZMmKKyWwbGpVX4FMMUjJyem10l-dFmVfpRGglAZhIy7p5wZJ0J9iHsWryN6zdwhZFJaPyeIJgm4YxFTcf0_VWuOBpdJt9khVXhCXKbd6Bd3WxHcQovo4Z6aYm5MoKn3\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BGf8J7wbXdHxeCVuYPmEqkMrhF9yxqaRxd56eRHmJ8_Tp6KdtQ0-Doa-UuOcPVhxQvBYMQl8XpobJNSTCgA42kk\",\"auth\":\"Cs31ywpLcRNHqPqMScnjUg\"}}');
/*!40000 ALTER TABLE `fruitpicker_webPushSubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lawnmowing_complaint`
--

LOCK TABLES `lawnmowing_complaint` WRITE;
/*!40000 ALTER TABLE `lawnmowing_complaint` DISABLE KEYS */;
/*!40000 ALTER TABLE `lawnmowing_complaint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lawnmowing_customer`
--

LOCK TABLES `lawnmowing_customer` WRITE;
/*!40000 ALTER TABLE `lawnmowing_customer` DISABLE KEYS */;
INSERT INTO `lawnmowing_customer` VALUES (21,0,'2019-11-01 19:21:42','2019-11-01 19:21:42',1,'2019-11-01 19:21:42',0,2147483647,'','','','USD','2019-11-01 19:21:42',0,0,'',0,0,1000,0,0,0,0,0,0,0,1,0);
/*!40000 ALTER TABLE `lawnmowing_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lawnmowing_customerTeam`
--

LOCK TABLES `lawnmowing_customerTeam` WRITE;
/*!40000 ALTER TABLE `lawnmowing_customerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `lawnmowing_customerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lawnmowing_customerTeamImage`
--

LOCK TABLES `lawnmowing_customerTeamImage` WRITE;
/*!40000 ALTER TABLE `lawnmowing_customerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `lawnmowing_customerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lawnmowing_seller`
--

LOCK TABLES `lawnmowing_seller` WRITE;
/*!40000 ALTER TABLE `lawnmowing_seller` DISABLE KEYS */;
INSERT INTO `lawnmowing_seller` VALUES (21,1,'2015-07-20 07:17:56','2019-11-01 14:16:45',545444577,'2019-11-01 19:21:18',42541267,2147483647,'','closeby.market','','SEK','2018-06-27 06:11:30',140.52905007460478,74.59787856861158,'',0,0,20000,0,'ridingMower',40.00,'km',15.00,300.00,90,0,1,1,0,0,0,0,0,0);
/*!40000 ALTER TABLE `lawnmowing_seller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lawnmowing_sellerTeam`
--

LOCK TABLES `lawnmowing_sellerTeam` WRITE;
/*!40000 ALTER TABLE `lawnmowing_sellerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `lawnmowing_sellerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lawnmowing_sellerTeamImage`
--

LOCK TABLES `lawnmowing_sellerTeamImage` WRITE;
/*!40000 ALTER TABLE `lawnmowing_sellerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `lawnmowing_sellerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lawnmowing_setting`
--

LOCK TABLES `lawnmowing_setting` WRITE;
/*!40000 ALTER TABLE `lawnmowing_setting` DISABLE KEYS */;
INSERT INTO `lawnmowing_setting` VALUES ('boAllowEmailAccountCreation','0'),('boGotNewVendors','0'),('boShowTeam','0'),('nUser','0'),('tLastWriteOfBoShow','1572636079'),('tLastWriteOfHA','18201');
/*!40000 ALTER TABLE `lawnmowing_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lawnmowing_user`
--

LOCK TABLES `lawnmowing_user` WRITE;
/*!40000 ALTER TABLE `lawnmowing_user` DISABLE KEYS */;
INSERT INTO `lawnmowing_user` VALUES (21,'2017-11-01 11:47:57','100002646477985',NULL,NULL,'emagnusandersson@gmail.com','Magnus Andersson','https://scontent.xx.fbcdn.net/v/t1.0-1/c12.12.155.155a/s50x50/283555_110561719042043_5647438_n.jpg?_nc_cat=104&_nc_oc=AQnjGu-jcEYOLAkgUAfiDYhbj2layE3sIB303PE52-Id7rgB6ZVIYUGop8zWJgUtRDM&_nc_ht=scontent.xx&oh=1b56128d4f34cab6f74f5fd6ebfcffbc&oe=5E615642','',1,1,'Magnus',0,'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALyQQHWPU5j/ZXjEYcuuRleDZmRYV4SP\nal4uwgrHAm7qZY2rpcDqbvIclsRC/mWwldImS0MnSPqgcKRsu83Ed+kCAwEAAQ==\n',128,0,0,0,0,0);
/*!40000 ALTER TABLE `lawnmowing_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lawnmowing_userImage`
--

LOCK TABLES `lawnmowing_userImage` WRITE;
/*!40000 ALTER TABLE `lawnmowing_userImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `lawnmowing_userImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lawnmowing_webPushSubscription`
--

LOCK TABLES `lawnmowing_webPushSubscription` WRITE;
/*!40000 ALTER TABLE `lawnmowing_webPushSubscription` DISABLE KEYS */;
INSERT INTO `lawnmowing_webPushSubscription` VALUES (21,'{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/dri9mescMWM:APA91bHEN9djT3EG4yVdT8FomqQ-VWIkyFfgGrKZ2XdtwQb9neF1DzuhSUzGWVine0WBFPVS3vZxJn68MvFifEg9UJ97QBS01_I9RTe9gMCJuXp1hkCxsZlAUJW9gFGCiVTW_luOOgwI\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BM8qtrA9qmOFr7gUcWacxUUUDUHM-vI5kjimeSbgkrwXXXvoGcM1nwmfBOxq2URMBz5h76nkG0VmIvZQ66k0Pxo\",\"auth\":\"83nPlFxfmJWgZY6FBAluFg\"}}');
/*!40000 ALTER TABLE `lawnmowing_webPushSubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `programmer_complaint`
--

LOCK TABLES `programmer_complaint` WRITE;
/*!40000 ALTER TABLE `programmer_complaint` DISABLE KEYS */;
/*!40000 ALTER TABLE `programmer_complaint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `programmer_customer`
--

LOCK TABLES `programmer_customer` WRITE;
/*!40000 ALTER TABLE `programmer_customer` DISABLE KEYS */;
INSERT INTO `programmer_customer` VALUES (3,0,'2019-11-01 19:37:43','2019-11-01 19:37:43',64,'2019-11-01 19:37:43',0,2147483647,'','','','USD','2019-11-01 19:37:43',0,0,'',0,0,1000,0,'','',0,0,0,0,1,0);
/*!40000 ALTER TABLE `programmer_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `programmer_customerTeam`
--

LOCK TABLES `programmer_customerTeam` WRITE;
/*!40000 ALTER TABLE `programmer_customerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `programmer_customerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `programmer_customerTeamImage`
--

LOCK TABLES `programmer_customerTeamImage` WRITE;
/*!40000 ALTER TABLE `programmer_customerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `programmer_customerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `programmer_seller`
--

LOCK TABLES `programmer_seller` WRITE;
/*!40000 ALTER TABLE `programmer_seller` DISABLE KEYS */;
INSERT INTO `programmer_seller` VALUES (3,1,'2019-01-19 17:40:29','2019-11-01 14:16:45',2722113,'2019-11-07 14:17:04',25205836,2147483647,'123','','','USD','2019-01-19 17:46:35',140.60572930152094,74.4981531380572,'',0,0,20000,50,3,0,0,4,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'',0,0,0,0,0,0);
/*!40000 ALTER TABLE `programmer_seller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `programmer_sellerTeam`
--

LOCK TABLES `programmer_sellerTeam` WRITE;
/*!40000 ALTER TABLE `programmer_sellerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `programmer_sellerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `programmer_sellerTeamImage`
--

LOCK TABLES `programmer_sellerTeamImage` WRITE;
/*!40000 ALTER TABLE `programmer_sellerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `programmer_sellerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `programmer_setting`
--

LOCK TABLES `programmer_setting` WRITE;
/*!40000 ALTER TABLE `programmer_setting` DISABLE KEYS */;
INSERT INTO `programmer_setting` VALUES ('boAllowEmailAccountCreation','0'),('boGotNewVendors','0'),('boShowTeam','0'),('nUser','0'),('tLastWriteOfBoShow','1573136224'),('tLastWriteOfHA','18207');
/*!40000 ALTER TABLE `programmer_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `programmer_user`
--

LOCK TABLES `programmer_user` WRITE;
/*!40000 ALTER TABLE `programmer_user` DISABLE KEYS */;
INSERT INTO `programmer_user` VALUES (3,'2019-01-19 17:40:29','100002646477985',NULL,NULL,'emagnusandersson@gmail.com','Magnus Andersson','https://scontent.xx.fbcdn.net/v/t1.0-1/c12.12.155.155a/s50x50/283555_110561719042043_5647438_n.jpg?_nc_cat=104&_nc_oc=AQnjGu-jcEYOLAkgUAfiDYhbj2layE3sIB303PE52-Id7rgB6ZVIYUGop8zWJgUtRDM&_nc_ht=scontent.xx&oh=1b56128d4f34cab6f74f5fd6ebfcffbc&oe=5E615642','533ea106aa27a83df1a73683196d0a83',2,1,'Magnus Andersson',0,'MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAXoM/q7GZdgfEQ4osGyQ+eJ0XY+Se/25b\nDfuBWiJzbRIJ20+tI8rjyKlvzb5sqad17+XYkt/dFcDgL8/Nf2+vRQIDAQAB\n',53,0,0,0,0,0);
/*!40000 ALTER TABLE `programmer_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `programmer_userImage`
--

LOCK TABLES `programmer_userImage` WRITE;
/*!40000 ALTER TABLE `programmer_userImage` DISABLE KEYS */;
INSERT INTO `programmer_userImage` VALUES (3,0x89504E470D0A1A0A0000000D494844520000003200000032020300000063516022000000206348524D00007A26000080840000FA00000080E8000075300000EA6000003A98000017709CBA513C0000000C504C5445004FCFFFFFFF000000FF53002BD1F57400000001624B474401FF022DDE0000000774494D4507E30113112D16EAD234B40000009E4944415428CFBDD0310EC2300C05D0C41252953D3B23CA293842073E52394D8E9211721F8EC28E5B29EE37031B747B52FDFDE310FEF31DC0CA3893807947042E34B62C3678D41038BD86A655CFA1D474EE6A7FAA6E0FD39D3794EEB64B75CD4E11D43A65EE295EE0D65E1A42319B5A1052099D24BDF25CAA7624CD9C1A2B153BA7761171DA0FCFF7CCDC654DA1E73A6DDBE75FEADBF68F9EFE0D7184BC0135FF3D0DD7F2370C0000000049454E44AE426082);
/*!40000 ALTER TABLE `programmer_userImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `programmer_webPushSubscription`
--

LOCK TABLES `programmer_webPushSubscription` WRITE;
/*!40000 ALTER TABLE `programmer_webPushSubscription` DISABLE KEYS */;
INSERT INTO `programmer_webPushSubscription` VALUES (3,'{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/fw6O6d9vZ1o:APA91bETGbQ6zntf_S6QhlxKD30lwM6PjKNMR-fm_NUZizYsUYocB9YKJhnh81sIUzWW8winAHeq3447GvKRc8W_SqhKbc_GRLsb7dqKfxpADypFWlnwpHeqxTHq0j1o7i-BEU8IAl_u\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BGhkpXThpNhFgTRBgWpq-WmpPvrzDpnCSOH9NhWYmI7r64moOBYop_8vZXNknbeTMBPorB1dn6GD0kLNFthryZo\",\"auth\":\"zwkR3l7-74xfTti9NpgZew\"}}');
/*!40000 ALTER TABLE `programmer_webPushSubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `snowremoval_complaint`
--

LOCK TABLES `snowremoval_complaint` WRITE;
/*!40000 ALTER TABLE `snowremoval_complaint` DISABLE KEYS */;
/*!40000 ALTER TABLE `snowremoval_complaint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `snowremoval_customer`
--

LOCK TABLES `snowremoval_customer` WRITE;
/*!40000 ALTER TABLE `snowremoval_customer` DISABLE KEYS */;
INSERT INTO `snowremoval_customer` VALUES (22,0,'2019-11-01 19:36:25','2019-11-01 19:36:25',1,'2019-11-01 19:36:25',0,2147483647,'','','','USD','2019-11-01 19:36:25',0,0,'',0,0,1000,0,0,0,0,0,0,0,0,0,0,1,0);
/*!40000 ALTER TABLE `snowremoval_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `snowremoval_customerTeam`
--

LOCK TABLES `snowremoval_customerTeam` WRITE;
/*!40000 ALTER TABLE `snowremoval_customerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `snowremoval_customerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `snowremoval_customerTeamImage`
--

LOCK TABLES `snowremoval_customerTeamImage` WRITE;
/*!40000 ALTER TABLE `snowremoval_customerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `snowremoval_customerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `snowremoval_seller`
--

LOCK TABLES `snowremoval_seller` WRITE;
/*!40000 ALTER TABLE `snowremoval_seller` DISABLE KEYS */;
INSERT INTO `snowremoval_seller` VALUES (22,1,'2018-08-28 18:37:35','2019-11-01 14:16:45',268501537,'2019-11-01 19:36:11',37136894,2147483647,'','closeby.market','','','2018-08-28 18:54:05',140.49695115955805,74.56577965356485,'',0,0,10000,0,'wagon',0.00,'km',0.00,0.00,0,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `snowremoval_seller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `snowremoval_sellerTeam`
--

LOCK TABLES `snowremoval_sellerTeam` WRITE;
/*!40000 ALTER TABLE `snowremoval_sellerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `snowremoval_sellerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `snowremoval_sellerTeamImage`
--

LOCK TABLES `snowremoval_sellerTeamImage` WRITE;
/*!40000 ALTER TABLE `snowremoval_sellerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `snowremoval_sellerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `snowremoval_setting`
--

LOCK TABLES `snowremoval_setting` WRITE;
/*!40000 ALTER TABLE `snowremoval_setting` DISABLE KEYS */;
INSERT INTO `snowremoval_setting` VALUES ('boAllowEmailAccountCreation','0'),('boGotNewVendors','0'),('boShowTeam','0'),('nUser','0'),('tLastWriteOfBoShow','1572636971'),('tLastWriteOfHA','18201');
/*!40000 ALTER TABLE `snowremoval_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `snowremoval_user`
--

LOCK TABLES `snowremoval_user` WRITE;
/*!40000 ALTER TABLE `snowremoval_user` DISABLE KEYS */;
INSERT INTO `snowremoval_user` VALUES (22,'2018-08-28 18:37:35','100002646477985',NULL,NULL,'emagnusandersson@gmail.com','Magnus Andersson','https://scontent.xx.fbcdn.net/v/t1.0-1/c12.12.155.155a/s50x50/283555_110561719042043_5647438_n.jpg?_nc_cat=104&_nc_oc=AQnjGu-jcEYOLAkgUAfiDYhbj2layE3sIB303PE52-Id7rgB6ZVIYUGop8zWJgUtRDM&_nc_ht=scontent.xx&oh=1b56128d4f34cab6f74f5fd6ebfcffbc&oe=5E615642','9468d7a9ee04c0887e5d4ce694feda55',0,0,'Magnus Andersson',0,'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJNs3si2H5k3GVCKJZs4DHI/KZI1oAJp\n1f2ztSL6GPooSg6I/hX1/VsPXB/2KObyIH7ulzPUcBUnfcoEuLa0UcMCAwEAAQ==\n',128,0,0,0,0,0);
/*!40000 ALTER TABLE `snowremoval_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `snowremoval_userImage`
--

LOCK TABLES `snowremoval_userImage` WRITE;
/*!40000 ALTER TABLE `snowremoval_userImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `snowremoval_userImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `snowremoval_webPushSubscription`
--

LOCK TABLES `snowremoval_webPushSubscription` WRITE;
/*!40000 ALTER TABLE `snowremoval_webPushSubscription` DISABLE KEYS */;
INSERT INTO `snowremoval_webPushSubscription` VALUES (22,'{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/edD9x8fGPMA:APA91bF-pt_2q1rr8zQNUt1RTSkJ91FEu6F1bgaYgiEa_nbeIfoIFFmk3GtqS-eFX9B1ET32mpsx1Z0LWOzJjR3zlZwDXa7EyJAdojf1lhrHsEj5LrIfo2y29dK3BDdg3UPkCRA6Gi0Z\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BL7POTON0fK_-BPRFMHbm6urXCEpV351nKkRM5z8SsrRWv3HqtZoIsU3zNKJhCnM3dxoEu-QNlSHDh49bOmYoPc\",\"auth\":\"rSR54wxg93Hxj3GKxWy2Aw\"}}');
/*!40000 ALTER TABLE `snowremoval_webPushSubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `taxi_complaint`
--

LOCK TABLES `taxi_complaint` WRITE;
/*!40000 ALTER TABLE `taxi_complaint` DISABLE KEYS */;
/*!40000 ALTER TABLE `taxi_complaint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `taxi_customer`
--

LOCK TABLES `taxi_customer` WRITE;
/*!40000 ALTER TABLE `taxi_customer` DISABLE KEYS */;
INSERT INTO `taxi_customer` VALUES (145,0,'2018-11-04 18:50:50','2018-11-04 18:50:50',0,'2018-11-04 18:50:50',0,2147483647,'1-868-397-5961','','','USD','2018-11-04 18:50:50',0,0,'',0,0,1000,0,'N',4,'',4,0,0,0,0,0,0,0,0),(147,0,'2019-01-24 22:26:23','2019-01-24 22:26:23',0,'2019-01-24 22:26:23',0,2147483647,'05426591444','','','USD','2019-01-24 22:26:23',0,0,'',0,0,1000,0,'N',4,'',4,0,0,0,0,0,0,0,0),(159,0,'2019-07-11 09:42:11','0000-00-00 00:00:00',49156,'2019-11-05 09:59:31',35,2147483647,'070','','','USD','2019-07-11 09:42:11',140.60572930152094,74.4981531380572,'',0,0,20000,0,'N',4,'',4,0,0,0,0,0,0,1,0);
/*!40000 ALTER TABLE `taxi_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `taxi_customerTeam`
--

LOCK TABLES `taxi_customerTeam` WRITE;
/*!40000 ALTER TABLE `taxi_customerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `taxi_customerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `taxi_customerTeamImage`
--

LOCK TABLES `taxi_customerTeamImage` WRITE;
/*!40000 ALTER TABLE `taxi_customerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `taxi_customerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `taxi_seller`
--

LOCK TABLES `taxi_seller` WRITE;
/*!40000 ALTER TABLE `taxi_seller` DISABLE KEYS */;
INSERT INTO `taxi_seller` VALUES (8,0,'2011-12-23 11:40:47','2012-01-25 14:11:39',0,'2014-01-30 21:02:10',13726383,31536000,'0703636903','','Uppsala','SEK','2011-12-23 11:45:45',140.547254124444,74.543161840827,'',0,0,20000,0,'wagon',39.00,'km',11.00,720.00,'inCar','0000-00-00 00:00:00',4,0,0,'Toyota Prius','000000',0,0,0,0,0,0,0),(11,0,'2012-01-23 14:50:23','2012-01-25 12:46:41',0,'2014-01-30 21:02:10',13726505,31536000,'0767000964','','Uppsala','SEK','0000-00-00 00:00:00',140.547666133333,74.5431835754553,'',0,0,20000,0,'wagon',45.00,'km',25.00,250.00,'inCar','0000-00-00 00:00:00',4,2,0,'Volvo V70','000000',0,0,0,0,0,0,0),(12,0,'2012-01-24 22:13:23','2012-01-25 14:30:50',0,'2014-01-30 21:02:10',13726505,31536000,'0702968844','','Uppsala','SEK','0000-00-00 00:00:00',140.547666133333,74.5430419585407,'',0,0,20000,0,'wagon',40.00,'km',20.00,250.00,'inCar','0000-00-00 00:00:00',4,0,0,'VW Passat','000000',0,0,0,0,0,0,0),(20,0,'2012-01-31 13:17:28','2012-04-03 11:29:29',0,'2014-01-30 21:02:10',13726505,31536000,'0736630007','','Upplands Väsby','SEK','2012-04-03 11:00:49',140.753115306667,74.8434725774597,'',0,0,20000,0,'wagon',42.00,'km',20.00,400.00,'inCar','0000-00-00 00:00:00',4,0,0,'VW Passat','000000',0,0,0,0,0,0,0),(22,0,'2012-01-31 13:33:12','2012-04-03 10:54:54',0,'2014-01-30 21:02:10',13726505,31536000,'0700511046','','Täby','SEK','2012-04-03 10:54:43',140.753115306667,74.8436725774597,'',0,0,20000,0,'MPV',38.00,'km',23.00,375.00,'inCar','0000-00-00 00:00:00',6,0,0,'VW Touran','000000',0,0,0,0,0,0,0),(67,0,'2012-07-17 07:45:26','2012-10-05 11:58:53',0,'2014-01-30 21:02:10',13726505,31536000,'0739902861','','Sollentuna','SEK','2012-10-05 10:09:30',140.753115306667,74.8433,'',0,0,20000,0,'largeMPV',42.00,'km',17.00,420.00,'inCar','0000-00-00 00:00:00',7,1,0,'VW Caravelle','00',0,0,0,0,0,0,0),(69,1,'2012-07-19 07:28:01','2012-07-19 07:43:37',810745079,'2019-11-07 20:12:32',195387514,2147483647,'0735000132','','Stockholm','SEK','2012-07-19 07:32:10',140.83978409269,75.284824509314,'',0,0,20000,0,'wagon',49.00,'km',20.00,600.00,'inCar','0000-00-00 00:00:00',4,2,0,'Mercedes','00',0,0,0,0,0,0,0),(105,1,'2013-04-01 06:19:59','2013-09-10 06:12:03',810745079,'2019-11-07 20:12:32',193913209,2147483647,'+40763010139','www.taxianywhere.com','Bucharest','RON','2013-04-21 07:43:01',146.58370915556,92.648896673493,'',0,0,20000,0,'sedan',1.39,'km',1.39,13.90,'inCar','2013-07-13 10:00:00',4,0,0,'Dacia Logan','0980',0,0,0,0,0,0,0),(141,0,'2015-03-24 16:59:54','2015-03-24 16:59:54',0,'2015-03-24 16:59:54',0,2592000,'+40745288422','taxiathostulcea@gmail.com','+40745288422','USD','2015-03-24 17:14:10',0,0,'',0,0,20000,0,'sedan',0.50,'km',0.50,5.00,'5min','2015-03-24 17:15:00',4,0,0,'Logan','taxiathostulcea@gmail.com',0,0,0,0,0,0,0),(142,1,'2017-08-31 18:09:28','2019-11-07 17:16:49',87,'2019-11-07 20:12:32',2998909,36000,'07547 502435','http://bijou.weebly.com','','GBP','2019-11-01 10:21:03',127.51190234054836,84.50132631406842,'admin@clarencearchibaldnetwork.org',142,142,1,0,'sedan',0.00,'mile',0.00,0.00,'inCar','2019-11-07 18:00:00',4,0,0,'','',0,0,0,0,0,1,0),(143,0,'2018-01-20 13:10:51','0000-00-00 00:00:00',0,'2018-01-20 13:12:31',0,31536000,'','','','EUR','2018-01-20 13:11:54',0,0,'',0,0,10000,0,'sedan',0.58,'km',0.39,15.00,'inCar','0000-00-00 00:00:00',4,0,0,'','',0,0,0,0,0,0,0),(144,0,'2018-09-26 13:59:48','0000-00-00 00:00:00',0,'2018-09-26 14:00:23',0,2147483647,'9009915195','','','USD','2018-09-26 13:59:48',0,0,'',0,0,1000,0,'sedan',0.00,'km',0.00,0.00,'inCar','0000-00-00 00:00:00',4,0,0,'','',0,0,0,0,0,0,0),(145,0,'2018-11-04 18:12:50','2018-11-04 18:12:50',0,'2018-11-04 18:12:50',0,2147483647,'1-868-397-5961','','','USD','2018-11-04 18:12:50',84.26772633075812,120.37596605363389,'',0,0,1000,0,'sedan',0.00,'km',0.00,0.00,'inCar','0000-00-00 00:00:00',4,0,0,'','',0,0,0,0,0,0,0),(151,0,'2019-02-28 12:17:20','0000-00-00 00:00:00',0,'2019-02-28 12:17:55',0,2147483647,'+421940601212','','','USD','2019-02-28 12:17:20',127.99759808869186,127.99759808869186,'',0,0,1000,0,'sedan',0.00,'km',0.00,0.00,'inCar','0000-00-00 00:00:00',4,0,0,'','',0,0,0,0,0,0,0),(154,0,'2019-05-28 17:09:06','2019-05-28 17:09:06',0,'2019-05-28 17:09:06',0,2147483647,'99360610','','','USD','2019-05-28 17:09:06',0,0,'',0,0,1000,0,'sedan',0.00,'km',0.00,0.00,'inCar','0000-00-00 00:00:00',4,0,0,'','',0,0,0,0,0,0,0),(157,0,'2019-06-30 20:44:19','2019-06-30 20:44:19',0,'2019-06-30 20:44:19',0,2147483647,'+212611954212','','','USD','2019-06-30 20:44:19',0,0,'',0,0,1000,0,'sedan',0.00,'km',0.00,0.00,'inCar','0000-00-00 00:00:00',4,0,0,'','',0,0,0,0,0,0,0),(159,1,'2019-07-10 20:20:28','2019-11-05 09:59:31',810745079,'2019-11-07 20:12:32',10367186,2147483647,'070','','','USD','2019-07-10 20:20:28',140.60572930152094,74.4981531380572,'',159,159,20000,0,'sedan',0.00,'km',0.00,0.00,'inCar','2019-11-07 18:45:00',4,0,0,'','',0,0,0,0,0,1,0),(160,1,'2019-11-05 23:37:57','2019-11-07 16:42:59',7,'2019-11-07 20:12:32',158528,2147483647,'18682972478','','','USD','2019-11-05 23:37:57',84.24838116643377,120.35947355683034,'',142,142,1000,0,'sedan',0.00,'km',0.00,0.00,'inCar','2019-11-07 16:15:00',4,0,0,'','',0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `taxi_seller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `taxi_sellerTeam`
--

LOCK TABLES `taxi_sellerTeam` WRITE;
/*!40000 ALTER TABLE `taxi_sellerTeam` DISABLE KEYS */;
INSERT INTO `taxi_sellerTeam` VALUES (142,'http://bijouservice.weebly.com/',4,1,'2019-11-06 18:37:38'),(159,'',2,1,'2019-11-06 18:37:08');
/*!40000 ALTER TABLE `taxi_sellerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `taxi_sellerTeamImage`
--

LOCK TABLES `taxi_sellerTeamImage` WRITE;
/*!40000 ALTER TABLE `taxi_sellerTeamImage` DISABLE KEYS */;
INSERT INTO `taxi_sellerTeamImage` VALUES (142,0xFFD8FFE000104A46494600010101006000600000FFDB00430001010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101FFDB00430101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101FFC00011080021003203011100021101031101FFC4001E0000010305010100000000000000000000000405080102030709060AFFC4002C10000104010302050402030000000000000301020405060007110812131421315109154161222362B1F0FFC4001801010101010100000000000000000000000001030204FFC4002D1100020201020406020007000000000000010200112131410312516113224271819132A162B1C1D1E1F0F1FFDA000C03010002110311003F00FBEA9A69027C168106AD3CE184EAF6B9CA8050C823D59DAE6A35FDC31B5AE77735115DCB5578E28ACDEC2FF9486F15D73ED14788BFE3FF007AFCFC6A4B186FB238B411C32A6B9AD01E40630959FD873149E22BD808FDCC522804C5945777A31918721EE5451B5A441C0EB1B6AF36ABB7931A0429515F64680C9FF6F33FCB49209C38E45247EE7398613187F10AACE5E31B1DC31EBCF68E0B0E8C47BD1D627A664B2B4A41CA18C0D74B50417A114892C5E5C456BDDFC5A91CCE2AC81340F5739E91D08C72F8AD62222F6AF288BA44AE9112C9731BE5FBDCD6ABA435A3477BB9EA32AF6B7E1DD88F545F5E1117D34B035BCE05753A5E0E3EBDE268FDD5B828EE300C5C87BF60333C8728AB6C1C5B21998C5EDCB6AF6D722CAC35B5B7106D6964C39A9229125B647DD6B40C605C22CB68C84113A5186205F22863755970BDB14460DDE75DB9240A1D6FF409FE921774B3BEB6B343D42EC56F9EEAD341DDBDBECC32ACDF03DABDD1B0495BF78174DE58308F8B5EEE4163D7E3F1772830ACA1E4C689B87B6B2734A8898D4CC7296FF37C8B2F816F2657A389C256F0D955823A005970ADC61761289E4BB51CAD5E60C400A405C50F102B216F3863CBCDE661C324516CA86ABD5491542CB03327469BFD976E36E075157BBAD0DB86D2627BDE3E9B763F1B355C82DD6535F866DD63BB8377B8B676A08018AA4DC38F94026E2F543F23060E178A84E1FB85A4CB690EE78DC3440812D99B87E2F158FA79B88DC3083B21144EA589ED34466B6E6A00372A803F2A5B240B3AE685E2BE4CEFA0CF6266F173D043AD9911D8667D6B8091C7280AB3ACA905492DB650FC0772103E55A8041148E0ED24623DE9D8E62EB1652BCB7EA40FED778FD7F89D2B06E6AF4B15FAAFEE26D66F0A9CA7B2F3C71F1CAF1AE6752ED222790C63906E7B51CA32A107CFBA13B1ED456AFE1DDAE7273F0AA9F9D0E87A6FED63FDFD768913B7DB16DD8B5DDCE99F2EC0B1AA5C871EDBBCC7736FF305B5CAA36291AB62DC6C96798953BE6C9340B99A68F2AF2F20451929E92D24C3391A6B18B1EABCCD844D11805E20272EAAA3E1D58FD05D3799BA92C847A4B139FE02A07C93B0355A4E2BF597F4EBEBD7AEDFA8D7443D50C999B09D326D1F499324CB936583EEBE69BB9BBBBA189DD641596B956346860DADDBDC4EBF1CCCE8833B112D2D8DBD9D3CAA9BDBB3DBBEC4251D63FD1C1F0D785C425AD40B604512C54F285A24920F9AF07A02666E5FC44F2EBF8D1BE523F2271B8206C2AEE75B702D9A9993C976658F4DC331DAF977B5B2EBE35C6237194CE970B15C5E936DE45C51D947CDF1F895C1B6ACA0354D4482D659F85551A3D835F3A25AB23831E2DD920F941E4D8E6CB915D2CDDF5DE6C05138A24D9D483F3A7D4905B71B6D95E11696F22C725C3ECAA6EE6DB5DD940A1C1EDB1D9B65955A4A8847E4D613E767592C67CE2C28CC8B6038D5B1DB3248C73C658BCBA2A6458B559BA000EC0680761B0940034156493DC9D4CDDC2E7C36729C2F1EA9EFC7EBD93FD6A4B326912C7B11E888AAE4E1C8EFE2BC7AA7B73F29FA5F4D506BE454854355DE0861448C8EB5A8EA343BCC45891CE3204E26184563C65115AD20C832B5CC28C837A398F1958E56118F6B98F62AB1C8AD554592C6116275618ADAD1ACC1D38A38618298329F1EB63C28EC5106000319A120EBC6254132021961340C64768123B5048BC56D93F7FF0031D24A177BE9BC788D5D1220E38A389A21C58C28801898310C51C2D4608231098318C636A35A318D8C18DAD6B46C6351134B39EE6C8DAF4BAF6FBDEE5EDB455E137F6BEDF9F8D225E89C2709F8F9F5D22574886910D221A4434886910D221A44FFD9),(159,0x89504E470D0A1A0A0000000D4948445200000032000000320403000000EC11958200000024504C5445FFF600FFF800E2DA001D1C00000000FFFA00E2DC001D1C00E4DC00CCC5003331001B1A0004F0DD61000000424944415438CB6360400046651724C0302A332A43AE8C200288A6A3C8282180C6ACCDC608C080C4B65ED984A48E01D980B24024B351648C04901D342A332A43A60C00D435AF0DEFBC57150000000049454E44AE426082);
/*!40000 ALTER TABLE `taxi_sellerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `taxi_setting`
--

LOCK TABLES `taxi_setting` WRITE;
/*!40000 ALTER TABLE `taxi_setting` DISABLE KEYS */;
INSERT INTO `taxi_setting` VALUES ('boAllowEmailAccountCreation','0'),('boGotNewVendors','0'),('boShowTeam','0'),('nUser','0'),('tLastWriteOfBoShow','1573157552'),('tLastWriteOfHA','18207');
/*!40000 ALTER TABLE `taxi_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `taxi_user`
--

LOCK TABLES `taxi_user` WRITE;
/*!40000 ALTER TABLE `taxi_user` DISABLE KEYS */;
INSERT INTO `taxi_user` VALUES (8,'2017-11-01 11:34:22',NULL,NULL,'tuckerten.myopenid.com','tuckerten.myopenid.com@example.com','','','',0,0,'Umer',0,'',0,0,0,0,0,0),(11,'2017-11-01 11:34:22',NULL,NULL,'tuckerone.myid.net','tuckerone.myid.net@example.com','','','',0,0,'Sana',0,'',0,0,0,0,0,0),(12,'2017-11-01 11:34:22',NULL,NULL,'tuckertwo.myid.net','tuckertwo.myid.net@example.com','','','',0,0,'two',0,'',0,0,0,0,0,0),(20,'2017-11-01 11:34:22',NULL,NULL,'dramthree.myid.net','dramthree.myid.net@example.com','','','',0,0,'dramthree',0,'',0,0,0,0,0,0),(22,'2017-11-01 11:34:22',NULL,NULL,'dramfour.myid.net','dramfour.myid.net@example.com','','','',0,0,'dramfour',0,'',0,0,0,0,0,0),(67,'2017-11-01 11:34:22',NULL,NULL,'granone.myid.net','granone.myid.net@example.com','','','',0,0,'granone',0,'',0,0,0,0,0,0),(69,'2017-11-01 11:34:22','100000816401496',NULL,NULL,'example1@example.com','','https://graph.facebook.com/100000816401496/picture','',0,0,'xay.devil نافز ابوجلالة',0,'',0,0,0,0,0,0),(105,'2017-11-01 11:34:22','100002436678838',NULL,NULL,'example2@example.com','','https://graph.facebook.com/100002436678838/picture','',0,0,'Dumitru Dicu',0,'',0,0,0,0,0,0),(141,'2017-11-01 11:34:22','100003514944761',NULL,NULL,'taxiathostulcea@gmail.com','','https://graph.facebook.com/100003514944761/picture','',0,0,'Taxi Athos',0,'',0,0,0,0,0,0),(142,'2017-11-01 11:34:22','1294580127318839',NULL,NULL,'idesignclothes@gmail.com','Bijou Broadcasting','https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1294580127318839&height=50&width=50&ext=1575731738&hash=AeRroMhCt0WurpvZ','',4,1,'Bijou Global Service',0,'',0,0,0,0,0,1),(143,'2018-01-20 13:10:51','1798707333494525',NULL,NULL,'almantas1989@gmail.com','Almantas Tuskevicius','https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/26733887_1797347246963867_5879848547019597776_n.jpg?oh=dde1278b99af24f98ddece04b1bdbcfe&oe=5AF90FEC','435227bf6f099641ce723fc2b680c40e',0,0,'',0,'',0,0,0,0,0,0),(144,'2018-09-26 13:59:48','286880011917716',NULL,NULL,'raviba4056@gmail.com','Ravi Kushwah','https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=286880011917716&height=50&width=50&ext=1540562372&hash=AeT90vIYHPP3Vy7J','bd97f51f6c0e57ba3438c962388dbb32',0,0,'Ravi Kushwah',0,'',0,0,0,0,0,0),(145,'2018-11-04 18:12:50','111127666293744',NULL,NULL,'wcanradio@gmail.com','Archibald Greenedesigns','https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=111127666293744&height=50&width=50&ext=1543949408&hash=AeTpArx2_8AzmJV5','933e25d0e6a8fc754f146b02cbde6a79',1,1,'Archibald Greenedesigns',0,'',0,0,0,0,0,0),(147,'2019-01-24 22:26:23','10215323415650962',NULL,NULL,'ahmetkocaknzd@gmail.com','Ahmet Kçk','https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10215323415650962&height=50&width=50&ext=1550960773&hash=AeRIrfZVEMeYIWDA','1dc5c01fadc2e68acace14f88ede906f',0,0,'Ahmet Kçk',0,'',0,0,0,0,0,0),(151,'2019-02-28 12:17:20','157539338584661',NULL,NULL,'arrowscab@gmail.com','Norbert Norbertus','https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=157539338584661&height=50&width=50&ext=1553948193&hash=AeSSAfNtbNJw0N4r','7d0dec61e6a58f7383665281afc7a27a',2,1,'Norbertus',0,'',0,0,0,0,0,0),(154,'2019-05-28 17:09:06','2928432907197030',NULL,NULL,'ljalecka@mail.ru','Котя Сол','https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2928432907197030&height=50&width=50&ext=1561655325&hash=AeSaV0W-jLpWjYe2','993d8df5ed71adb47354b7ca697f5a6e',0,0,'Edou',0,'',0,0,0,0,0,0),(157,'2019-06-30 20:44:19','10219121949177492',NULL,NULL,'mouradsigne@gmail.com','Mourad Majidi','https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10219121949177492&height=50&width=50&ext=1564519448&hash=AeRlc3T2faeWW4_y','404b69078e5b9db1cad9e422f9bcfe60',0,0,'Mourad Majidi',0,'',0,0,0,0,0,0),(159,'2019-07-10 20:20:28','100002646477985',NULL,NULL,'emagnusandersson@gmail.com','Magnus Andersson','https://scontent.xx.fbcdn.net/v/t1.0-1/c12.12.155.155a/s50x50/283555_110561719042043_5647438_n.jpg?_nc_cat=104&_nc_oc=AQlrfP28t4SxWwAtCV7XoTgUo_7UE6QWrwlKQERSFneofBYYQWDkF9A-mzwIyUSCZkM&_nc_ht=scontent.xx&oh=62fedea8f0d0b10336b6b765ee2cb2b6&oe=5E615642','f8bc7d788a90de6406878a7a4394b7ca',0,0,'Magnus Andersson',0,'MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAcp61vXvWsx6HEPNAFb1UyqHM7eumT/mw\nsLeAMvQd4G1Mzoet+Bos7ViKtWRh8lfv2wcPVayk6LVVoxUehQft2wIDAQAB\n',10,0,0,0,0,1),(160,'2019-11-05 23:37:57','10157887295443854',NULL,NULL,'debflex@hotmail.com','Debra Felix','https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10157887295443854&height=50&width=50&ext=1575734794&hash=AeRr9OgfW5Mwog2s','cd54964636a7ff5591efb84cd170f64e',0,0,'Debra Felix',0,'',0,0,0,0,0,0);
/*!40000 ALTER TABLE `taxi_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `taxi_userImage`
--

LOCK TABLES `taxi_userImage` WRITE;
/*!40000 ALTER TABLE `taxi_userImage` DISABLE KEYS */;
INSERT INTO `taxi_userImage` VALUES (142,0xFFD8FFE000104A46494600010101006000600000FFDB00430001010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101FFDB00430101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101FFC00011080021003203011100021101031101FFC4001E0000010305010100000000000000000000000405080102030709060AFFC4002C10000104010302050402030000000000000301020405060007110812131421315109154161222362B1F0FFC4001801010101010100000000000000000000000001030204FFC4002D1100020201020406020007000000000000010200112131410312516113224271819132A162B1C1D1E1F0F1FFDA000C03010002110311003F00FBEA9A69027C168106AD3CE184EAF6B9CA8050C823D59DAE6A35FDC31B5AE77735115DCB5578E28ACDEC2FF9486F15D73ED14788BFE3FF007AFCFC6A4B186FB238B411C32A6B9AD01E40630959FD873149E22BD808FDCC522804C5945777A31918721EE5451B5A441C0EB1B6AF36ABB7931A0429515F64680C9FF6F33FCB49209C38E45247EE7398613187F10AACE5E31B1DC31EBCF68E0B0E8C47BD1D627A664B2B4A41CA18C0D74B50417A114892C5E5C456BDDFC5A91CCE2AC81340F5739E91D08C72F8AD62222F6AF288BA44AE9112C9731BE5FBDCD6ABA435A3477BB9EA32AF6B7E1DD88F545F5E1117D34B035BCE05753A5E0E3EBDE268FDD5B828EE300C5C87BF60333C8728AB6C1C5B21998C5EDCB6AF6D722CAC35B5B7106D6964C39A9229125B647DD6B40C605C22CB68C84113A5186205F22863755970BDB14460DDE75DB9240A1D6FF409FE921774B3BEB6B343D42EC56F9EEAD341DDBDBECC32ACDF03DABDD1B0495BF78174DE58308F8B5EEE4163D7E3F1772830ACA1E4C689B87B6B2734A8898D4CC7296FF37C8B2F816F2657A389C256F0D955823A005970ADC61761289E4BB51CAD5E60C400A405C50F102B216F3863CBCDE661C324516CA86ABD5491542CB03327469BFD976E36E075157BBAD0DB86D2627BDE3E9B763F1B355C82DD6535F866DD63BB8377B8B676A08018AA4DC38F94026E2F543F23060E178A84E1FB85A4CB690EE78DC3440812D99B87E2F158FA79B88DC3083B21144EA589ED34466B6E6A00372A803F2A5B240B3AE685E2BE4CEFA0CF6266F173D043AD9911D8667D6B8091C7280AB3ACA905492DB650FC0772103E55A8041148E0ED24623DE9D8E62EB1652BCB7EA40FED778FD7F89D2B06E6AF4B15FAAFEE26D66F0A9CA7B2F3C71F1CAF1AE6752ED222790C63906E7B51CA32A107CFBA13B1ED456AFE1DDAE7273F0AA9F9D0E87A6FED63FDFD768913B7DB16DD8B5DDCE99F2EC0B1AA5C871EDBBCC7736FF305B5CAA36291AB62DC6C96798953BE6C9340B99A68F2AF2F20451929E92D24C3391A6B18B1EABCCD844D11805E20272EAAA3E1D58FD05D3799BA92C847A4B139FE02A07C93B0355A4E2BF597F4EBEBD7AEDFA8D7443D50C999B09D326D1F499324CB936583EEBE69BB9BBBBA189DD641596B956346860DADDBDC4EBF1CCCE8833B112D2D8DBD9D3CAA9BDBB3DBBEC4251D63FD1C1F0D785C425AD40B604512C54F285A24920F9AF07A02666E5FC44F2EBF8D1BE523F2271B8206C2AEE75B702D9A9993C976658F4DC331DAF977B5B2EBE35C6237194CE970B15C5E936DE45C51D947CDF1F895C1B6ACA0354D4482D659F85551A3D835F3A25AB23831E2DD920F941E4D8E6CB915D2CDDF5DE6C05138A24D9D483F3A7D4905B71B6D95E11696F22C725C3ECAA6EE6DB5DD940A1C1EDB1D9B65955A4A8847E4D613E767592C67CE2C28CC8B6038D5B1DB3248C73C658BCBA2A6458B559BA000EC0680761B0940034156493DC9D4CDDC2E7C36729C2F1EA9EFC7EBD93FD6A4B326912C7B11E888AAE4E1C8EFE2BC7AA7B73F29FA5F4D506BE454854355DE0861448C8EB5A8EA343BCC45891CE3204E26184563C65115AD20C832B5CC28C837A398F1958E56118F6B98F62AB1C8AD554592C6116275618ADAD1ACC1D38A38618298329F1EB63C28EC5106000319A120EBC6254132021961340C64768123B5048BC56D93F7FF0031D24A177BE9BC788D5D1220E38A389A21C58C28801898310C51C2D4608231098318C636A35A318D8C18DAD6B46C6351134B39EE6C8DAF4BAF6FBDEE5EDB455E137F6BEDF9F8D225E89C2709F8F9F5D22574886910D221A4434886910D221A44FFD9),(145,0xFFD8FFE000104A46494600010100000100010000FFDB004300100B0C0E0C0A100E0D0E1211101318281A181616183123251D283A333D3C3933383740485C4E404457453738506D51575F626768673E4D71797064785C656763FFDB0043011112121815182F1A1A2F634238426363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363FFC00011080032002603012200021101031101FFC4001A000003000301000000000000000000000000030501040602FFC4002C100002010303030205050100000000000001020300041105122131415122610613325281627191A1C1F0FFC40017010101010100000000000000000000000001020003FFC4001B11010100030101010000000000000000000001021112213161FFDA000C03010002110311003F00D062AA32D5A935CE4E10578C4B372C703DE9D1C017A0C9A9D2EE4525BC92F2DE91EF4F58A38CF0327CD54B2D32EEE8710B6DF2453EF3476B1883CC5573E48CFF0015ACA25C51DA2DC38145534366AA0159656EFC85028A347AFC262B1391F3320119E39AA51476B636D25D3207112EEC7735B91D9145DD98D879570695AADA99747BA65DA36A6E3B88E40E4F14CFA8AE51FE23D40DD3CC9772C609C04438503C63A5548646BEB55BA6DF2BB70467273F9AE4093BC85DA07DBE6AFE8F6FAB48B13DA965B42FEA1BC00403CFBD55F634F16C5AACA80E1636FB781FED1562DACEC9C11236D3FA980A2A393D54F17F696BA687605AE1D772460ED1F93502FF005279936461957A303213BBCFE2B4269B79E0F6E3DA960E457698445C932656494FCA7257AE0F6AEB3E12D56DE2B67B7BD0C88C0A8651D8F9A81342AC0B6307DA9A8047E91C0ED4CC45AED74D16297128DCB247CED72719E7FEFEA8AE2DD891C8047707CD153CE9B7B24F414C5ED4515D625E5FE96FDAB2DF48A28AC5897A0A28A2867FFFD9),(151,0x89504E470D0A1A0A0000000D49484452000000320000003208060000001E3F88B1000000206348524D00007A26000080840000FA00000080E8000075300000EA6000003A98000017709CBA513C00000006624B4744000000000000F943BB7F000000097048597300000B1300000B1301009A9C180000000774494D4507E3021C0C130AB42B2923000008F44944415468DEED99498C1C5719C77FEF555557552F333D9B3D1E4FBC8C9D64E49838B6620725012312AC4810451102450AE2060A1724F0819B4FC90545F80412070E4880441221918520104A1C962820AF716CC7B13D5E66C6B3F62C3DD35DDB7B1F879EEE4C1644C6F63897F94B4FD5A5AA7AF57EEF7BEFFBBEFA1AD6B4A635AD694D9F83D44A1F387CF8302212E672B9878220B83308021D04014110E0FB7EAB799E87EBBA388E038088608C214D33D234218E63E238268A62E238A25EAF13459189E3F86C1CC76F6BAD9383070FAE0EC8B3CF3D479A245EA15038E4FBFE8F8320C837215A20B91CB92688E3A0B506A500C15A214D5392242149922590A8758CA2887ABD5E8DE3F8D9CACCCCF3A562D11E3A74E8338DCD5D0988C932945283699A7ECF719C7C96656459469AA668AD51AA312F993100A46946DC1C7492A095A2582810043E22429224A469DA6A5996618C296559F64C18042F18632E7FD6B1AD0824CB32806EA5545B13C0599A75A5142242660C8BB53AD3D3D3C471845220625958AC313757456987F5EBD7B3AEAB93423EC418F3694025634C7125635B31888820222D00AD3540E3DCF518BF3E4C292FECDBD3CFC6BE75E4F3215A6BD234636EAECA854B573873EE1A23633162A1ABDC86EBBA1F01695AA769E15B0E92A6690B64F9520AC210E5B8CCCF5EE04B7B3BD936B01ED771B0328D8800E0BB500A15FD1BBAD87B5F81A32786F8DB5BC30C5F1B66CBA68DF8BEFF11CBAC2A489224001F0109C3103F08C9A2633CFE68484747056BA6B12228A5508042218048A3E53D78F87E454F7BC0AF5F18E1DD3355EEDAB615A5D4EDB30822586B514AA1B5A6DCD1453CFF2F1EFFEA141D050F8904A7E9A894C25A05D2708F8E5E8231600C0C6E563CFDF53ABFF84DC2C521C51D1BFB5A1ECD2C398C55B588632D22424FCF7AEA0B977978E075BAF31DD848A315380E6847B87025E0B7AF7691668AD0B77CF78969FAD7A56446A132304671CF861A8FED36FCFE1F39A6A72BF87EEE3682380E4A2972619E92BCCEDDBDA3B03087763DB4568C4E3AFCFBB4CFC8B8C7E977EB180B9E0BAF058B6CE84E7970574C47C9A232B0F53A0FDD291CBDB495A1F1393ACB6DB707A4E9B1FC20248966B973D379728EC2268B902A52D1FCE9AF3E7B762CF0E0A0E1DBFB69855DB170EE92CB5FDE543C7520452582CAA0AB64D9BD7596CB936DD46A35ACB5AB0B12C731C092CB55D8E43AFD1D55246B446EAD84A12B169BC4ECD9669B011DA1E1B914D03E98F2CBD30E1363C2BAB246045C05033D33B4B5DD4D65AA82A3F5EA6EF6E5206966D0669E8267100382020D47DFD36CDF08514D612DCB101A508E037D5D70E29CE2B12F821550A268F76BB417738C0EC7B88EBE7D16A9D723AC49D0A210A3500AAE8DC1AFFE28580B61D0F050CBE75400AD607641E8EB563C30A8680B1B4BCED3E0E73CD224C168757BF688D69A85852AF5C8258D1D94DF70B9E72FC3FB57841F3CA958A8C1CFFF60C9968D27F4E1E0539AF94578F10D61781C766E066B056B430497244D50B06210BD929B9B996A92C454E76799AE7A4CCFFB28DBB04A9641CE8387762A1ED8017EAE113B5CA771CCFB8D6B7B07158E06932AB08011164C2FD5C5946429BD6FB655B1C8874BCBC19879AE4F75F1FEF54EB6AFAF8152F495C1D5C2F77F6A01C8B286DB6D6A3182679EB74409AC2B43571124833876184FEE62F4FA04499260ADC55ABB228BAC08248A22A011478C71191F9BE0ED8B7D3C383046B96819BC43F8D67EF8D98B861F3EE9F0E55D8AE52B446B78E988F0C211C34F9E72E9EB00C984C97A3F1766FA181D3E419A26A469863166F5BC96E3382820697E3B5426397169136F9EDDC013BB87F11CC5CECD9A1D9B2D8FEE561CD8A79016884269C5D48CE5F49065B04FE158A8D65DDE4FBEC63BC787989B9DC11883D69A52B1D472DBB71CE4DE7BEF456BCDD4D42457AF5EA35EAB716D7894974F0DB0B13D62EFD6691EDFA7D9BF3347B90069D41C88A2E9BFBEF990E6C07D1E1D05A8D58433B547F8E7850E8E1F7D83388E29954A6CDAB48972B98CB59693274FDE7A9066C6DBDDDD4310848C8C8C303333C3A97363FCAEED7EAC7A8F3D7D236C282BAC80D88F2D0D81BCAB28B45BAA758FB3F123BC79ED0BBCFADACBC4F51ABDBDBDF4F6F692CBE55AE9D0AA5864B917F13CAF3573D3D3D3FCE7D4285E7E3F153BC6CEF6E3AC2FCC9273966D5811AC403DF5184FB67036DACF3FCF071C39F267B086816DDB08C3106B2D5114B5BE635605A4B9D9972B0C43FAFAFA88E398E327CF333ED5CFE6DE036CEF9C624B799AEE7C1D4F5B52099837DD5CABF573F67AC8A933434C8C8D920F7DDADB8AAD895A29C04D5BE4E3524A81182E5FFC800BE785BFFB016D6D65DADBFAF17D0F632CF3D51A95CA196A8BF378AE8BEFFB586B5BFDDE28C42D01F9B4973B1A926891A9FA2CBE4DA989303AE9E0BA9ACC7878AEFB89FE6E06E2A641FED7CB1BDFF5B0A15BF8CE37527CCF325E511C3FE7F1D6318DA3B3FFDFC7ED02F9F8003E3C95D679577B4A653661724631B03125F03C5C65A947AA75AFF0C92AE18D58E7A6377B537EAE91F56A2DE8A5B071F1AA70FE7223AFD2CA4329C1F7EA18A3C9B206B2EF0A8BD18719C0E7BAD945847DF7A4CC56153D1D4214C35D9B0DA3939AEAA262FB26432114A6E71AE9BEC9403B303EA5D8B2D1F2CA118F898A5EAAB5DC986EC91EB156B026A32DAFC8FB4265563133674114C510AA0B429A0A71DC58727102C57CA3F8303B27F8AE21AA6B949215E557370D2222747676B16DDB00954A05632CB34919918C63EF5CA2A36B1DA3339691E1ABECDA750FB9A88058E1FAD828B95C8E62A18099B2F83997DA5C8EAE0D0E617B4C10F81C3B768C5AAD765B40621131F3F373384EA38E5B2C1609C39085854516EA43ECE8DB4AB95CE6CCD98B5466337A7A72F4F76F44BB05F2F910A5348EA3715D8F2489514A512E1BCAE532274F9E248A22ABB55ED197D58AECE836FC7F97B5F625C771BED2D9D9499AA5E4C37CABBA32313141B158A45028303C3C4CA954C25D16FC9AD5C45C2E87EBBAD4EB751CC769E557737373D46AB55794524F03D5CFBAF96F6C41C24EE047C0E04DF4F169B2C029E030F0C1AA59A4F550E3294720A0F5370E280159AAF70A2C954A9B91421A9516B574411ABF1582886A76222822C0DC6CA45FD39AD6B4A635AD6925FA2F8DFB1203467F76730000000049454E44AE426082);
/*!40000 ALTER TABLE `taxi_userImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `taxi_webPushSubscription`
--

LOCK TABLES `taxi_webPushSubscription` WRITE;
/*!40000 ALTER TABLE `taxi_webPushSubscription` DISABLE KEYS */;
INSERT INTO `taxi_webPushSubscription` VALUES (142,'{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/eQos9LOWGN0:APA91bHQq3MPy2x_TEPgKNwCuP4-TZiHtk3dn4cy1ZEw7JSJtXc5hfDnNRJD4mGINqcIhCxdL6mOx0mTNXWOOLHmlUWFx9kKdN6qmg0Ctv5344pxBLHpcxjXedzGLr3OkzGfYy_qxLC_\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BHCPBsaqHlFt763fl7AZg4pqUxT2ER6wJtTemiQxiZGfSzGQKIQd-Eo4mfiFc-bnFss7FzbQVtWQjnD-ikgBlkA\",\"auth\":\"1hWSN4tGo5BKT0FfPP-Jtw\"}}'),(159,'{\"endpoint\":\"https://db5p.notify.windows.com/w/?token=BQYAAADLIG63vvj5rPsH0hOQeo57WpnRLu7OvqZJ2%2fKvYjKD0LLcd4XoIyQ4lgckktKKHYZTyectpWPVWSms%2fczPQML8WGCC33UUVvr%2b41ECl1cM0UeiVddPiKhZ5HQ6prD50XerC7DDpkzWvHUEFbx2H4%2bLIZjTlUex8vT%2f7fd0UhGrvio%2b2RbeXdvL%2bmcdle1lKKFThVw8s2ZlENhLOiKC4yXozrUe5YR%2fakKXsjv43Vf8Jot%2f0LClc0fMtxssrvbR1mOkvBbV6A%2fYQ5bnl5Zuux9j17mtL8uIs%2fWfzOHtqXc3mtvzOKws%2bynim8UtwTeAMVLeoxBRGb506Gjd9u5cHP4x\",\"expirationTime\":1575645584000,\"keys\":{\"auth\":\"VSD2rh502Y0fW5D_PKergw\",\"p256dh\":\"BOVvD3DhMmpcqOQiaNN2lYl2rmE2KwM0_qATtpGQXtosWbbZlEGMJJM8-ALbkg96eKyv4Ek8Yi5xGD3g9pfipLc\"}}');
/*!40000 ALTER TABLE `taxi_webPushSubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transport_complaint`
--

LOCK TABLES `transport_complaint` WRITE;
/*!40000 ALTER TABLE `transport_complaint` DISABLE KEYS */;
/*!40000 ALTER TABLE `transport_complaint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transport_customer`
--

LOCK TABLES `transport_customer` WRITE;
/*!40000 ALTER TABLE `transport_customer` DISABLE KEYS */;
INSERT INTO `transport_customer` VALUES (1,0,'2019-11-01 18:58:45','2019-11-01 18:58:45',64,'2019-11-01 18:58:45',0,2147483647,'','','','USD','2019-11-01 18:58:45',140.50402533819252,74.5744311105535,'',0,0,1000,0,'-',4,'',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0);
/*!40000 ALTER TABLE `transport_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transport_customerTeam`
--

LOCK TABLES `transport_customerTeam` WRITE;
/*!40000 ALTER TABLE `transport_customerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `transport_customerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transport_customerTeamImage`
--

LOCK TABLES `transport_customerTeamImage` WRITE;
/*!40000 ALTER TABLE `transport_customerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `transport_customerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transport_seller`
--

LOCK TABLES `transport_seller` WRITE;
/*!40000 ALTER TABLE `transport_seller` DISABLE KEYS */;
INSERT INTO `transport_seller` VALUES (1,1,'2013-12-14 23:37:27','2019-11-01 14:16:45',139516005,'2019-11-07 14:17:27',43039588,2147483647,'','closeby.market','','SEK','2018-06-27 05:56:16',140.60572930152094,74.4981531380572,'',0,0,20000,0,'wagon',40.00,'km',15.00,300.00,'inCar','2018-06-27 06:15:00',1,1,0,0,0,0,0,0,0,0,0,0,'',0,0,0,0,1,0),(41,1,'2013-09-10 06:14:13','2013-09-10 06:15:04',139516005,'2019-11-07 14:17:27',193845315,2147483647,'+40763010139','','','USD','2013-09-10 06:14:13',146.58370915556,92.648896673493,'',0,0,20000,0,'bike',0.00,'km',0.00,0.00,'inCar','2013-09-10 06:14:13',0,0,0,0,0,0,0,0,0,0,0,0,'',0,0,0,0,0,0),(551,0,'2016-02-02 03:44:52','2016-02-02 03:44:52',0,'2016-02-02 03:44:52',0,2592000,'009779818667068','','','USD','2016-02-02 03:44:52',0,0,'',0,0,20000,0,'sedan',0.00,'km',0.00,0.00,'inCar','0000-00-00 00:00:00',0,0,0,0,0,0,0,0,0,0,0,0,'',0,0,0,0,0,0),(552,0,'2017-10-24 14:13:13','2017-10-24 14:13:13',0,'2017-10-24 14:13:13',0,2592000,'','','','USD','2017-10-24 14:13:13',0,0,'',0,0,20000,0,'sedan',0.00,'km',0.00,0.00,'inCar','0000-00-00 00:00:00',0,0,0,0,0,0,0,0,0,0,0,0,'',0,0,0,0,0,0),(553,0,'2019-05-31 02:21:01','2019-05-31 02:21:01',0,'2019-05-31 02:21:01',0,2147483647,'0769566249','','','USD','2019-05-31 02:21:01',127.99759808869186,127.99759808869186,'',0,0,1000,0,'sedan',0.00,'km',0.00,0.00,'inCar','0000-00-00 00:00:00',0,0,0,0,0,0,0,0,0,0,0,0,'',0,0,0,0,0,0),(554,1,'2019-11-01 10:24:41','2019-11-01 10:24:54',101,'2019-11-07 14:17:27',532353,2147483647,'07547 502435','http://bijouservice.weebly.com/','Milton Keynes United','GBP','2019-11-01 10:31:32',127.49110715646714,84.52684285046004,'admin@clarencearchibaldnetwork.org',0,0,1000,1,'sedan',7.00,'km',0.00,0.00,'atHome','2019-11-01 18:30:00',0,1,0,0,0,0,0,0,0,0,0,0,'',0,0,0,0,1,0);
/*!40000 ALTER TABLE `transport_seller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transport_sellerTeam`
--

LOCK TABLES `transport_sellerTeam` WRITE;
/*!40000 ALTER TABLE `transport_sellerTeam` DISABLE KEYS */;
INSERT INTO `transport_sellerTeam` VALUES (554,'',0,1,'2019-11-06 18:39:16');
/*!40000 ALTER TABLE `transport_sellerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transport_sellerTeamImage`
--

LOCK TABLES `transport_sellerTeamImage` WRITE;
/*!40000 ALTER TABLE `transport_sellerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `transport_sellerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transport_setting`
--

LOCK TABLES `transport_setting` WRITE;
/*!40000 ALTER TABLE `transport_setting` DISABLE KEYS */;
INSERT INTO `transport_setting` VALUES ('boAllowEmailAccountCreation','0'),('boGotNewVendors','0'),('boShowTeam','0'),('nUser','0'),('tLastWriteOfBoShow','1573136247'),('tLastWriteOfHA','18207');
/*!40000 ALTER TABLE `transport_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transport_user`
--

LOCK TABLES `transport_user` WRITE;
/*!40000 ALTER TABLE `transport_user` DISABLE KEYS */;
INSERT INTO `transport_user` VALUES (1,'2017-11-01 11:43:14','100002646477985',NULL,NULL,'emagnusandersson@gmail.com','Magnus Andersson','https://scontent.xx.fbcdn.net/v/t1.0-1/c12.12.155.155a/s50x50/283555_110561719042043_5647438_n.jpg?_nc_cat=104&_nc_oc=AQnwzniJlhNHA0D9NSasrcZ-RiMdybtOTV8-bi3k5xlKmxXfDt50rSIyuOiDLN5BClw&_nc_ht=scontent.xx&oh=472aee7072b9f879beba31edc9650e7a&oe=5E615642','',3,1,'Magnus',0,'MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAaOaPMRMKXD0WNWICEdUNn3KOQLNpf0Kb\n6DpGbS8R0QME/MRQIwSbBWJt1/iiOYJdYCrqu6+r9syioBnWJVOYbwIDAQAB\n',128,0,0,0,0,1),(41,'2017-11-01 11:43:14','100002436678838',NULL,NULL,'example1@example.com','','http://graph.facebook.com/100002436678838/picture','',0,0,'Dumitru Dicu',0,'',0,0,0,0,0,0),(551,'2017-11-01 11:43:14','202460633442505',NULL,NULL,'example2@example.com','Timro Kale','https://scontent.xx.fbcdn.net/hprofile-xta1/v/t1.0-1/p50x50/12193742_158723457816223_2129320133256587949_n.jpg?oh=4f100ab2f05ff758c2f1404ceac918b3&oe=5738B3E9','',0,0,'Timro Kale',0,'',0,0,0,0,0,0),(552,'2017-11-01 11:43:14','915400231959217',NULL,NULL,'amstrongreigns@gmail.com','Amstrong Reigns','https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/22195994_903852986447275_2066075825943896997_n.jpg?oh=7e45a6e6dc38fb71a54d4ad495d630db&oe=5A701AD8','',0,0,'Amstrong Reigns',0,'',0,0,0,0,0,0),(553,'2019-05-31 02:21:01','579873425754526',NULL,NULL,'tmgwaba02@gmail.com','Thandeka Mgwaba','https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=579873425754526&height=50&width=50&ext=1561861246&hash=AeQ2nRe5nUVDTeLy','935a6ee5ee237e520e84a3e2a00d2465',0,0,'Thandeka Mgwaba',0,'',0,0,0,0,0,0),(554,'2019-11-01 10:24:41','1294580127318839',NULL,NULL,'idesignclothes@gmail.com','Bijou Broadcasting','https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1294580127318839&height=50&width=50&ext=1575195815&hash=AeSF3NRXUNwA02n_','708545c6732a3f855ea869a18630983f',0,0,'Bijou Service UK',0,'',0,0,0,0,0,1);
/*!40000 ALTER TABLE `transport_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transport_userImage`
--

LOCK TABLES `transport_userImage` WRITE;
/*!40000 ALTER TABLE `transport_userImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `transport_userImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transport_webPushSubscription`
--

LOCK TABLES `transport_webPushSubscription` WRITE;
/*!40000 ALTER TABLE `transport_webPushSubscription` DISABLE KEYS */;
INSERT INTO `transport_webPushSubscription` VALUES (1,'{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/eyQHivFZCJg:APA91bH0VEergWMLvfqpt7CUFccdtBy1pLf-Ele8ec5_xXs7tUHiQoTwUFQBgQ9fgRDEQQfEVdyEq3_34IVDy8regqVLttIzc5DAPhcnXdTc7BlyW08wscm96DE1vdm0e2XvguVymOHQ\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BHNmMCCBk9uooj86Dd2ngPzR6WKrtAwwopeIc4JXAsvq0snIKIevdwNICkyeWv3YOs-VzsDrTBMh8ppNj0ODckY\",\"auth\":\"12M_hWwo16HFwzxMQKscJg\"}}'),(554,'{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/dC0VgVjZdVs:APA91bFb4dDTidkbyHPyy1z6ivVc0iASznrMhsqRXBo5KkeF-NeUndCs2NUuP9Wa9kwYRqXnQmi_H8E1e48O65Ei5N27P5M228JWrDrdjHXNU_er1DmmqFC4PcnGu0BQpiWvAO4zwCDo\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BJlbT3tzg-Oj8UTBT16J73Fb6l2x0AH13iirqfPHNpJvAY8ePX5GTtuvtmOj5KnhDlfgN6hiL_mKV6xJeliWjno\",\"auth\":\"bbd9pDXVhYkBLpVcuEL1-A\"}}');
/*!40000 ALTER TABLE `transport_webPushSubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `windowcleaner_complaint`
--

LOCK TABLES `windowcleaner_complaint` WRITE;
/*!40000 ALTER TABLE `windowcleaner_complaint` DISABLE KEYS */;
/*!40000 ALTER TABLE `windowcleaner_complaint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `windowcleaner_customer`
--

LOCK TABLES `windowcleaner_customer` WRITE;
/*!40000 ALTER TABLE `windowcleaner_customer` DISABLE KEYS */;
INSERT INTO `windowcleaner_customer` VALUES (21,0,'2019-11-01 19:20:57','2019-11-01 19:20:57',1,'2019-11-01 19:20:57',0,2147483647,'','','','USD','2019-11-01 19:20:57',0,0,'',0,0,1000,0,0,0,0,0,0,0,1,0);
/*!40000 ALTER TABLE `windowcleaner_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `windowcleaner_customerTeam`
--

LOCK TABLES `windowcleaner_customerTeam` WRITE;
/*!40000 ALTER TABLE `windowcleaner_customerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `windowcleaner_customerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `windowcleaner_customerTeamImage`
--

LOCK TABLES `windowcleaner_customerTeamImage` WRITE;
/*!40000 ALTER TABLE `windowcleaner_customerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `windowcleaner_customerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `windowcleaner_seller`
--

LOCK TABLES `windowcleaner_seller` WRITE;
/*!40000 ALTER TABLE `windowcleaner_seller` DISABLE KEYS */;
INSERT INTO `windowcleaner_seller` VALUES (21,1,'2015-07-20 07:17:21','2019-11-01 14:16:45',58804789,'2019-11-01 19:20:46',42538030,2147483647,'','closeby.market','','SEK','2018-06-27 06:12:59',140.52905007460478,74.59787856861158,'',0,0,20000,0,'bike',40.00,'km',15.00,300.00,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `windowcleaner_seller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `windowcleaner_sellerTeam`
--

LOCK TABLES `windowcleaner_sellerTeam` WRITE;
/*!40000 ALTER TABLE `windowcleaner_sellerTeam` DISABLE KEYS */;
/*!40000 ALTER TABLE `windowcleaner_sellerTeam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `windowcleaner_sellerTeamImage`
--

LOCK TABLES `windowcleaner_sellerTeamImage` WRITE;
/*!40000 ALTER TABLE `windowcleaner_sellerTeamImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `windowcleaner_sellerTeamImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `windowcleaner_setting`
--

LOCK TABLES `windowcleaner_setting` WRITE;
/*!40000 ALTER TABLE `windowcleaner_setting` DISABLE KEYS */;
INSERT INTO `windowcleaner_setting` VALUES ('boAllowEmailAccountCreation','0'),('boGotNewVendors','0'),('boShowTeam','0'),('nUser','0'),('tLastWriteOfBoShow','1572636046'),('tLastWriteOfHA','18201');
/*!40000 ALTER TABLE `windowcleaner_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `windowcleaner_user`
--

LOCK TABLES `windowcleaner_user` WRITE;
/*!40000 ALTER TABLE `windowcleaner_user` DISABLE KEYS */;
INSERT INTO `windowcleaner_user` VALUES (21,'2017-11-01 11:45:01','100002646477985',NULL,NULL,'emagnusandersson@gmail.com','Magnus Andersson','https://scontent.xx.fbcdn.net/v/t1.0-1/c12.12.155.155a/s50x50/283555_110561719042043_5647438_n.jpg?_nc_cat=104&_nc_oc=AQnjGu-jcEYOLAkgUAfiDYhbj2layE3sIB303PE52-Id7rgB6ZVIYUGop8zWJgUtRDM&_nc_ht=scontent.xx&oh=1b56128d4f34cab6f74f5fd6ebfcffbc&oe=5E615642','',1,1,'Magnus',0,'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMLviu81yFT7RfxkorLJjJ6a1BHr+IEa\n1iRM2cZs/FldxPIu1bqy63n6Fb6BKbXLzkLYnJabwmGeYAIjgZGSMBMCAwEAAQ==\n',128,0,0,0,0,0);
/*!40000 ALTER TABLE `windowcleaner_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `windowcleaner_userImage`
--

LOCK TABLES `windowcleaner_userImage` WRITE;
/*!40000 ALTER TABLE `windowcleaner_userImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `windowcleaner_userImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `windowcleaner_webPushSubscription`
--

LOCK TABLES `windowcleaner_webPushSubscription` WRITE;
/*!40000 ALTER TABLE `windowcleaner_webPushSubscription` DISABLE KEYS */;
INSERT INTO `windowcleaner_webPushSubscription` VALUES (21,'{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/cE6TKmZunMw:APA91bGU552vPsXHI5seHQLFzrns7k6odxdNubrvcuA-8CbUETkROVVwT4YVRNTFWHROwdaTwb7gvqBCgZqqABDuz9WuXhNXvhTTZeVFSipdwaMU04TKDbeZkUestVgbXxkZQ2sZRGuo\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BMUzXZ3sl4aPwZzdivx5zBWdaqe2alH47a-iedPaSvxPfN8KuBrJ2l5HHfhVHVgkjHGsa9MKR0qjfO-lkrljDkY\",\"auth\":\"A6WxOVUPy-sjvneq3kMBAw\"}}');
/*!40000 ALTER TABLE `windowcleaner_webPushSubscription` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-07 20:16:35
