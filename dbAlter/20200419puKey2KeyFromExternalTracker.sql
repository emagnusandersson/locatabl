

UPDATE taxi_user SET pubKey=SUBSTRING(pubKey, 1, 32);
UPDATE transport_user SET pubKey=SUBSTRING(pubKey, 1, 32);
UPDATE cleaner_user SET pubKey=SUBSTRING(pubKey, 1, 32);
UPDATE windowcleaner_user SET pubKey=SUBSTRING(pubKey, 1, 32);
UPDATE lawnmowing_user SET pubKey=SUBSTRING(pubKey, 1, 32);
UPDATE snowremoval_user SET pubKey=SUBSTRING(pubKey, 1, 32);
UPDATE fruitpicker_user SET pubKey=SUBSTRING(pubKey, 1, 32);
UPDATE programmer_user SET pubKey=SUBSTRING(pubKey, 1, 32);


ALTER TABLE taxi_user CHANGE pubKey keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
ALTER TABLE transport_user CHANGE pubKey keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
ALTER TABLE cleaner_user CHANGE pubKey keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
ALTER TABLE windowcleaner_user CHANGE pubKey keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
ALTER TABLE lawnmowing_user CHANGE pubKey keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
ALTER TABLE snowremoval_user CHANGE pubKey keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
ALTER TABLE fruitpicker_user CHANGE pubKey keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
ALTER TABLE programmer_user CHANGE pubKey keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
  

-- ALTER TABLE taxi_user CHANGE keyTracker keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE transport_user CHANGE keyTracker keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE cleaner_user CHANGE keyTracker keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE windowcleaner_user CHANGE keyTracker keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE lawnmowing_user CHANGE keyTracker keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE snowremoval_user CHANGE keyTracker keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE fruitpicker_user CHANGE keyTracker keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE programmer_user CHANGE keyTracker keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
  
-- ALTER TABLE taxi_user MODIFY keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE transport_user MODIFY keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE cleaner_user MODIFY keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE windowcleaner_user MODIFY keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE lawnmowing_user MODIFY keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE snowremoval_user MODIFY keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE fruitpicker_user MODIFY keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';
-- ALTER TABLE programmer_user MODIFY keyFromExternalTracker VARCHAR(32) NOT NULL DEFAULT '';


-- Set Back

ALTER TABLE taxi_user CHANGE keyFromExternalTracker pubKey VARCHAR(256) NOT NULL DEFAULT '';
ALTER TABLE transport_user CHANGE keyFromExternalTracker pubKey VARCHAR(256) NOT NULL DEFAULT '';
ALTER TABLE cleaner_user CHANGE keyFromExternalTracker pubKey VARCHAR(256) NOT NULL DEFAULT '';
ALTER TABLE windowcleaner_user CHANGE keyFromExternalTracker pubKey VARCHAR(256) NOT NULL DEFAULT '';
ALTER TABLE lawnmowing_user CHANGE keyFromExternalTracker pubKey VARCHAR(256) NOT NULL DEFAULT '';
ALTER TABLE snowremoval_user CHANGE keyFromExternalTracker pubKey VARCHAR(256) NOT NULL DEFAULT '';
ALTER TABLE fruitpicker_user CHANGE keyFromExternalTracker pubKey VARCHAR(256) NOT NULL DEFAULT '';
ALTER TABLE programmer_user CHANGE keyFromExternalTracker pubKey VARCHAR(256) NOT NULL DEFAULT '';
