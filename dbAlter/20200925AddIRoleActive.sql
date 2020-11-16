

ALTER TABLE taxi_user ADD COLUMN iRoleActive int(1) NOT NULL DEFAULT 0 AFTER boWebPushOK;
ALTER TABLE transport_user ADD COLUMN iRoleActive int(1) NOT NULL DEFAULT 0 AFTER boWebPushOK;
ALTER TABLE cleaner_user ADD COLUMN iRoleActive int(1) NOT NULL DEFAULT 0 AFTER boWebPushOK;
ALTER TABLE windowcleaner_user ADD COLUMN iRoleActive int(1) NOT NULL DEFAULT 0 AFTER boWebPushOK;
ALTER TABLE lawnmowing_user ADD COLUMN iRoleActive int(1) NOT NULL DEFAULT 0 AFTER boWebPushOK;
ALTER TABLE snowremoval_user ADD COLUMN iRoleActive int(1) NOT NULL DEFAULT 0 AFTER boWebPushOK;
ALTER TABLE fruitpicker_user ADD COLUMN iRoleActive int(1) NOT NULL DEFAULT 0 AFTER boWebPushOK;
ALTER TABLE programmer_user ADD COLUMN iRoleActive int(1) NOT NULL DEFAULT 0 AFTER boWebPushOK;

-- Check state WHERE s.boShow AND b.boShow
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos FROM taxi_seller s JOIN taxi_buyer b ON s.idUser=b.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos FROM transport_seller s JOIN transport_buyer b ON s.idUser=b.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos FROM cleaner_seller s JOIN cleaner_buyer b ON s.idUser=b.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos FROM windowcleaner_seller s JOIN windowcleaner_buyer b ON s.idUser=b.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos FROM lawnmowing_seller s JOIN lawnmowing_buyer b ON s.idUser=b.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos FROM snowremoval_seller s JOIN snowremoval_buyer b ON s.idUser=b.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos FROM fruitpicker_seller s JOIN fruitpicker_buyer b ON s.idUser=b.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos FROM programmer_seller s JOIN programmer_buyer b ON s.idUser=b.idUser WHERE s.boShow AND b.boShow;

UPDATE taxi_user u JOIN taxi_seller s ON u.idUser=s.idUser SET iRoleActive=boShow;
UPDATE taxi_user u JOIN taxi_buyer b ON u.idUser=b.idUser SET iRoleActive=!boShow;

UPDATE transport_user u JOIN transport_seller s ON u.idUser=s.idUser SET iRoleActive=boShow;
UPDATE transport_user u JOIN transport_buyer b ON u.idUser=b.idUser SET iRoleActive=!boShow;

UPDATE cleaner_user u JOIN cleaner_seller s ON u.idUser=s.idUser SET iRoleActive=boShow;
UPDATE cleaner_user u JOIN cleaner_buyer b ON u.idUser=b.idUser SET iRoleActive=!boShow;

UPDATE windowcleaner_user u JOIN windowcleaner_seller s ON u.idUser=s.idUser SET iRoleActive=boShow;
UPDATE windowcleaner_user u JOIN windowcleaner_buyer b ON u.idUser=b.idUser SET iRoleActive=!boShow;

UPDATE lawnmowing_user u JOIN lawnmowing_seller s ON u.idUser=s.idUser SET iRoleActive=boShow;
UPDATE lawnmowing_user u JOIN lawnmowing_buyer b ON u.idUser=b.idUser SET iRoleActive=!boShow;

UPDATE snowremoval_user u JOIN snowremoval_seller s ON u.idUser=s.idUser SET iRoleActive=boShow;
UPDATE snowremoval_user u JOIN snowremoval_buyer b ON u.idUser=b.idUser SET iRoleActive=!boShow;

UPDATE fruitpicker_user u JOIN fruitpicker_seller s ON u.idUser=s.idUser SET iRoleActive=boShow;
UPDATE fruitpicker_user u JOIN fruitpicker_buyer b ON u.idUser=b.idUser SET iRoleActive=!boShow;

UPDATE programmer_user u JOIN programmer_seller s ON u.idUser=s.idUser SET iRoleActive=boShow;
UPDATE programmer_user u JOIN programmer_buyer b ON u.idUser=b.idUser SET iRoleActive=!boShow;

-- 
-- In production it turns out that "WHERE s.boShow AND b.boShow" returns empty sets, so the below commands are only for development-environment. 
-- 

UPDATE taxi_user u JOIN (taxi_seller s JOIN taxi_buyer b ON s.idUser=b.idUser AND s.boShow AND b.boShow) ON u.idUser=s.idUser SET u.iRoleActive=s.tPos>b.tPos;
UPDATE transport_user u JOIN (transport_seller s JOIN transport_buyer b ON s.idUser=b.idUser AND s.boShow AND b.boShow) ON u.idUser=s.idUser SET u.iRoleActive=s.tPos>b.tPos;
UPDATE cleaner_user u JOIN (cleaner_seller s JOIN cleaner_buyer b ON s.idUser=b.idUser AND s.boShow AND b.boShow) ON u.idUser=s.idUser SET u.iRoleActive=s.tPos>b.tPos;
UPDATE windowcleaner_user u JOIN (windowcleaner_seller s JOIN windowcleaner_buyer b ON s.idUser=b.idUser AND s.boShow AND b.boShow) ON u.idUser=s.idUser SET u.iRoleActive=s.tPos>b.tPos;
UPDATE lawnmowing_user u JOIN (lawnmowing_seller s JOIN lawnmowing_buyer b ON s.idUser=b.idUser AND s.boShow AND b.boShow) ON u.idUser=s.idUser SET u.iRoleActive=s.tPos>b.tPos;
UPDATE snowremoval_user u JOIN (snowremoval_seller s JOIN snowremoval_buyer b ON s.idUser=b.idUser AND s.boShow AND b.boShow) ON u.idUser=s.idUser SET u.iRoleActive=s.tPos>b.tPos;
UPDATE fruitpicker_user u JOIN (fruitpicker_seller s JOIN fruitpicker_buyer b ON s.idUser=b.idUser AND s.boShow AND b.boShow) ON u.idUser=s.idUser SET u.iRoleActive=s.tPos>b.tPos;
UPDATE programmer_user u JOIN (programmer_seller s JOIN programmer_buyer b ON s.idUser=b.idUser AND s.boShow AND b.boShow) ON u.idUser=s.idUser SET u.iRoleActive=s.tPos>b.tPos;


-- Check state WHERE s.boShow AND b.boShow
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM taxi_seller s JOIN taxi_buyer b ON s.idUser=b.idUser JOIN taxi_user u on u.idUser=s.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM transport_seller s JOIN transport_buyer b ON s.idUser=b.idUser JOIN transport_user u on u.idUser=s.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM cleaner_seller s JOIN cleaner_buyer b ON s.idUser=b.idUser JOIN cleaner_user u on u.idUser=s.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM windowcleaner_seller s JOIN windowcleaner_buyer b ON s.idUser=b.idUser JOIN windowcleaner_user u on u.idUser=s.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM lawnmowing_seller s JOIN lawnmowing_buyer b ON s.idUser=b.idUser JOIN lawnmowing_user u on u.idUser=s.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM snowremoval_seller s JOIN snowremoval_buyer b ON s.idUser=b.idUser JOIN snowremoval_user u on u.idUser=s.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM fruitpicker_seller s JOIN fruitpicker_buyer b ON s.idUser=b.idUser JOIN fruitpicker_user u on u.idUser=s.idUser WHERE s.boShow AND b.boShow;
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM programmer_seller s JOIN programmer_buyer b ON s.idUser=b.idUser JOIN programmer_user u on u.idUser=s.idUser WHERE s.boShow AND b.boShow;

-- Check state WHERE (!s.boShow OR s.boShow IS NULL) XOR (!b.boShow OR b.boShow IS NULL)
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM taxi_seller s JOIN taxi_buyer b ON s.idUser=b.idUser RIGHT JOIN taxi_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) XOR (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM transport_seller s JOIN transport_buyer b ON s.idUser=b.idUser JOIN transport_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) XOR (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM cleaner_seller s JOIN cleaner_buyer b ON s.idUser=b.idUser JOIN cleaner_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) XOR (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM windowcleaner_seller s JOIN windowcleaner_buyer b ON s.idUser=b.idUser JOIN windowcleaner_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) XOR (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM lawnmowing_seller s JOIN lawnmowing_buyer b ON s.idUser=b.idUser JOIN lawnmowing_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) XOR (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM snowremoval_seller s JOIN snowremoval_buyer b ON s.idUser=b.idUser JOIN snowremoval_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) XOR (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM fruitpicker_seller s JOIN fruitpicker_buyer b ON s.idUser=b.idUser JOIN fruitpicker_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) XOR (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM programmer_seller s JOIN programmer_buyer b ON s.idUser=b.idUser JOIN programmer_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) XOR (!b.boShow OR b.boShow IS NULL);

-- Check state WHERE (!s.boShow OR s.boShow IS NULL) AND (!b.boShow OR b.boShow IS NULL)
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM taxi_seller s JOIN taxi_buyer b ON s.idUser=b.idUser RIGHT JOIN taxi_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) AND (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM transport_seller s JOIN transport_buyer b ON s.idUser=b.idUser JOIN transport_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) AND (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM cleaner_seller s JOIN cleaner_buyer b ON s.idUser=b.idUser JOIN cleaner_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) AND (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM windowcleaner_seller s JOIN windowcleaner_buyer b ON s.idUser=b.idUser JOIN windowcleaner_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) AND (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM lawnmowing_seller s JOIN lawnmowing_buyer b ON s.idUser=b.idUser JOIN lawnmowing_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) AND (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM snowremoval_seller s JOIN snowremoval_buyer b ON s.idUser=b.idUser JOIN snowremoval_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) AND (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM fruitpicker_seller s JOIN fruitpicker_buyer b ON s.idUser=b.idUser JOIN fruitpicker_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) AND (!b.boShow OR b.boShow IS NULL);
SELECT s.idUser, b.boShow, s.boShow, b.tPos, s.tPos, s.tPos>b.tPos, u.iRoleActive FROM programmer_seller s JOIN programmer_buyer b ON s.idUser=b.idUser JOIN programmer_user u on u.idUser=s.idUser WHERE (!s.boShow OR s.boShow IS NULL) AND (!b.boShow OR b.boShow IS NULL);


-- Set Back

ALTER TABLE taxi_user DROP COLUMN iRoleActive;
ALTER TABLE transport_user DROP COLUMN iRoleActive;
ALTER TABLE cleaner_user DROP COLUMN iRoleActive;
ALTER TABLE windowcleaner_user DROP COLUMN iRoleActive;
ALTER TABLE lawnmowing_user DROP COLUMN iRoleActive;
ALTER TABLE snowremoval_user DROP COLUMN iRoleActive;
ALTER TABLE fruitpicker_user DROP COLUMN iRoleActive;
ALTER TABLE programmer_user DROP COLUMN iRoleActive;
  

