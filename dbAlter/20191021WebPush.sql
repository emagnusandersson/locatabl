    -- Create webPushSubscription
CREATE TABLE taxi_webPushSubscription (
idUser int(4) NOT NULL auto_increment,
strSubscription varchar(512) CHARSET utf8 NULL,
PRIMARY KEY (idUser),
FOREIGN KEY (idUser) REFERENCES taxi_user(idUser) ON DELETE CASCADE
) ENGINE=INNODB COLLATE utf8_general_ci;
CREATE TABLE transport_webPushSubscription (
idUser int(4) NOT NULL auto_increment,
strSubscription varchar(512) CHARSET utf8 NULL,
PRIMARY KEY (idUser),
FOREIGN KEY (idUser) REFERENCES transport_user(idUser) ON DELETE CASCADE
) ENGINE=INNODB COLLATE utf8_general_ci;
CREATE TABLE cleaner_webPushSubscription (
idUser int(4) NOT NULL auto_increment,
strSubscription varchar(512) CHARSET utf8 NULL,
PRIMARY KEY (idUser),
FOREIGN KEY (idUser) REFERENCES cleaner_user(idUser) ON DELETE CASCADE
) ENGINE=INNODB COLLATE utf8_general_ci;
CREATE TABLE windowcleaner_webPushSubscription (
idUser int(4) NOT NULL auto_increment,
strSubscription varchar(512) CHARSET utf8 NULL,
PRIMARY KEY (idUser),
FOREIGN KEY (idUser) REFERENCES windowcleaner_user(idUser) ON DELETE CASCADE
) ENGINE=INNODB COLLATE utf8_general_ci;

CREATE TABLE lawnmower_webPushSubscription (
idUser int(4) NOT NULL auto_increment,
strSubscription varchar(512) CHARSET utf8 NULL,
PRIMARY KEY (idUser),
FOREIGN KEY (idUser) REFERENCES lawnmower_user(idUser) ON DELETE CASCADE
) ENGINE=INNODB COLLATE utf8_general_ci;
CREATE TABLE snowremoval_webPushSubscription (
idUser int(4) NOT NULL auto_increment,
strSubscription varchar(512) CHARSET utf8 NULL,
PRIMARY KEY (idUser),
FOREIGN KEY (idUser) REFERENCES snowremoval_user(idUser) ON DELETE CASCADE
) ENGINE=INNODB COLLATE utf8_general_ci;
CREATE TABLE fruitpicker_webPushSubscription (
idUser int(4) NOT NULL auto_increment,
strSubscription varchar(512) CHARSET utf8 NULL,
PRIMARY KEY (idUser),
FOREIGN KEY (idUser) REFERENCES fruitpicker_user(idUser) ON DELETE CASCADE
) ENGINE=INNODB COLLATE utf8_general_ci;
CREATE TABLE programmer_webPushSubscription (
idUser int(4) NOT NULL auto_increment,
strSubscription varchar(512) CHARSET utf8 NULL,
PRIMARY KEY (idUser),
FOREIGN KEY (idUser) REFERENCES programmer_user(idUser) ON DELETE CASCADE
) ENGINE=INNODB COLLATE utf8_general_ci;

ALTER TABLE taxi_user
  MODIFY COLUMN nComplaint int(4) UNSIGNED NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  ADD COLUMN boWebPushOK BOOL NOT NULL DEFAULT 0  AFTER nComplaintGivenCum;

ALTER TABLE taxi_customer
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `compassPoint` enum('-','N','NE','E','SE','S','SW','W','NW') NOT NULL DEFAULT '-' AFTER price,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;

ALTER TABLE taxi_seller
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;
  
UPDATE taxi_user u LEFT JOIN taxi_customer c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
UPDATE taxi_user u LEFT JOIN taxi_seller c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
  
  
  
ALTER TABLE transport_user
  MODIFY COLUMN nComplaint int(4) UNSIGNED NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  ADD COLUMN boWebPushOK BOOL NOT NULL DEFAULT 0  AFTER nComplaintGivenCum;

ALTER TABLE transport_customer
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `compassPoint` enum('-','N','NE','E','SE','S','SW','W','NW') NOT NULL DEFAULT '-' AFTER price,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;

ALTER TABLE transport_seller
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;
  
UPDATE transport_user u LEFT JOIN transport_customer c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
UPDATE transport_user u LEFT JOIN transport_seller c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
  
  
  
ALTER TABLE cleaner_user
  MODIFY COLUMN nComplaint int(4) UNSIGNED NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  ADD COLUMN boWebPushOK BOOL NOT NULL DEFAULT 0  AFTER nComplaintGivenCum;

ALTER TABLE cleaner_customer
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;

ALTER TABLE cleaner_seller
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;
  
UPDATE cleaner_user u LEFT JOIN cleaner_customer c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
UPDATE cleaner_user u LEFT JOIN cleaner_seller c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
  
  
  
ALTER TABLE windowcleaner_user
  MODIFY COLUMN nComplaint int(4) UNSIGNED NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  ADD COLUMN boWebPushOK BOOL NOT NULL DEFAULT 0  AFTER nComplaintGivenCum;

ALTER TABLE windowcleaner_customer
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;

ALTER TABLE windowcleaner_seller
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;
  
UPDATE windowcleaner_user u LEFT JOIN windowcleaner_customer c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
UPDATE windowcleaner_user u LEFT JOIN windowcleaner_seller c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
  
















  
  
ALTER TABLE lawnmower_user
  MODIFY COLUMN nComplaint int(4) UNSIGNED NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  ADD COLUMN boWebPushOK BOOL NOT NULL DEFAULT 0  AFTER nComplaintGivenCum;

ALTER TABLE lawnmower_customer
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;

ALTER TABLE lawnmower_seller
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;
  
UPDATE lawnmower_user u LEFT JOIN lawnmower_customer c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
UPDATE lawnmower_user u LEFT JOIN lawnmower_seller c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
  
  
  
ALTER TABLE snowremoval_user
  MODIFY COLUMN nComplaint int(4) UNSIGNED NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  ADD COLUMN boWebPushOK BOOL NOT NULL DEFAULT 0  AFTER nComplaintGivenCum;

ALTER TABLE snowremoval_customer
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;

ALTER TABLE snowremoval_seller
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;
  
UPDATE snowremoval_user u LEFT JOIN snowremoval_customer c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
UPDATE snowremoval_user u LEFT JOIN snowremoval_seller c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
  
  
  
ALTER TABLE fruitpicker_user
  MODIFY COLUMN nComplaint int(4) UNSIGNED NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  ADD COLUMN boWebPushOK BOOL NOT NULL DEFAULT 0  AFTER nComplaintGivenCum;

ALTER TABLE fruitpicker_customer
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;

ALTER TABLE fruitpicker_seller
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;
  
UPDATE fruitpicker_user u LEFT JOIN fruitpicker_customer c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
UPDATE fruitpicker_user u LEFT JOIN fruitpicker_seller c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
  
  
  
ALTER TABLE programmer_user
  MODIFY COLUMN nComplaint int(4) UNSIGNED NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) UNSIGNED NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  ADD COLUMN boWebPushOK BOOL NOT NULL DEFAULT 0  AFTER nComplaintGivenCum;

ALTER TABLE programmer_customer
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;

ALTER TABLE programmer_seller
  MODIFY COLUMN `idTeam` int(4) unsigned NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGivenCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintGiven` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaintCum` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `nComplaint` int(4) unsigned NOT NULL DEFAULT 0,
  ADD COLUMN `boWebPushOK` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN `donatedAmount` double NOT NULL DEFAULT 0;
  
UPDATE programmer_user u LEFT JOIN programmer_customer c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
UPDATE programmer_user u LEFT JOIN programmer_seller c ON u.idUser = c.idUser
SET c.nComplaint = u.nComplaint, c.nComplaintCum = u.nComplaintCum, c.nComplaintGiven = u.nComplaintGiven, c.nComplaintGivenCum = u.nComplaintGivenCum;
  




-- Set Back

DROP TABLE taxi_webPushSubscription;
DROP TABLE transport_webPushSubscription;
DROP TABLE cleaner_webPushSubscription;
DROP TABLE windowcleaner_webPushSubscription;
DROP TABLE lawnmower_webPushSubscription;
DROP TABLE snowremoval_webPushSubscription;
DROP TABLE fruitpicker_webPushSubscription;
DROP TABLE programmer_webPushSubscription;

ALTER TABLE taxi_user
  MODIFY COLUMN nComplaint int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) NOT NULL DEFAULT 0, 
  DROP COLUMN boWebPushOK;


UPDATE taxi_customer SET compassPoint='N' WHERE compassPoint='-';
ALTER TABLE taxi_customer
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `compassPoint` enum('N','NE','E','SE','S','SW','W','NW') NOT NULL DEFAULT 'N' AFTER distStartToGoal,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;

ALTER TABLE taxi_seller
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;
  


ALTER TABLE transport_user
  MODIFY COLUMN nComplaint int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) NOT NULL DEFAULT 0, 
  DROP COLUMN boWebPushOK;

UPDATE transport_customer SET compassPoint='N' WHERE compassPoint='-';
ALTER TABLE transport_customer
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `compassPoint` enum('N','NE','E','SE','S','SW','W','NW') NOT NULL DEFAULT 'N' AFTER distStartToGoal,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;

ALTER TABLE transport_seller
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;
  
  
  
ALTER TABLE cleaner_user
  MODIFY COLUMN nComplaint int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) NOT NULL DEFAULT 0, 
  DROP COLUMN boWebPushOK;

ALTER TABLE cleaner_customer
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;

ALTER TABLE cleaner_seller
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;
  
  
  
ALTER TABLE windowcleaner_user
  MODIFY COLUMN nComplaint int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) NOT NULL DEFAULT 0, 
  DROP COLUMN boWebPushOK;

ALTER TABLE windowcleaner_customer
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;

ALTER TABLE windowcleaner_seller
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;
  
  
  
ALTER TABLE lawnmower_user
  MODIFY COLUMN nComplaint int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) NOT NULL DEFAULT 0, 
  DROP COLUMN boWebPushOK;

ALTER TABLE lawnmower_customer
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;

ALTER TABLE lawnmower_seller
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;
  
  
  
ALTER TABLE snowremoval_user
  MODIFY COLUMN nComplaint int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) NOT NULL DEFAULT 0, 
  DROP COLUMN boWebPushOK;

ALTER TABLE snowremoval_customer
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;

ALTER TABLE snowremoval_seller
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;
  
  
  
ALTER TABLE fruitpicker_user
  MODIFY COLUMN nComplaint int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) NOT NULL DEFAULT 0, 
  DROP COLUMN boWebPushOK;

ALTER TABLE fruitpicker_customer
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;

ALTER TABLE fruitpicker_seller
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `experience` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;
  
  
  
ALTER TABLE programmer_user
  MODIFY COLUMN nComplaint int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN nComplaintCum int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGiven int(4) NOT NULL DEFAULT 0, 
  MODIFY COLUMN nComplaintGivenCum int(4) NOT NULL DEFAULT 0, 
  DROP COLUMN boWebPushOK;

ALTER TABLE programmer_customer
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;

ALTER TABLE programmer_seller
  MODIFY COLUMN `idTeam` int(4) NOT NULL DEFAULT 0,
  MODIFY COLUMN `idTeamWanted` int(4) NOT NULL DEFAULT 0,
  DROP COLUMN `nComplaintGivenCum`,
  DROP COLUMN `nComplaintGiven`,
  DROP COLUMN `nComplaintCum`,
  DROP COLUMN `nComplaint`,
  DROP COLUMN `boWebPushOK`,
  DROP COLUMN `donatedAmount`;
